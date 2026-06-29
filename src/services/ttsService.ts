
export class TTSService {
  private static synth: SpeechSynthesis = window.speechSynthesis;
  private static initialized = false;
  private static volume = 1.0;

  static setVolume(vol: number) {
    this.volume = Math.max(0.0, Math.min(1.0, vol));
  }

  static getVolume() {
    return this.volume;
  }

  private static init() {
    if (this.initialized || !this.synth) return;
    
    // Some browsers need a "kick" to start the synth
    this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.synth.getVoices();
    }
    this.initialized = true;
  }

  static async speak(text: string, language: string, options: { 
    rate?: number, 
    pitch?: number, 
    onEnd?: () => void, 
    preferredVoiceName?: string,
    useCloud?: boolean,
    cloudVoiceName?: string
  } = {}) {
    if (options.useCloud) {
      try {
        await this.speakCloud(text, language, options);
        return;
      } catch (err: any) {
        console.error('Cloud TTS failed, falling back to local:', err);
        window.dispatchEvent(new CustomEvent('app-toast-notification', {
          detail: {
            title: "Pro Voice Offline",
            message: `Neural cloud speech encountered an issue (${err.message || 'connection error'}). Falling back to offline voice system.`,
            type: "warning"
          }
        }));
      }
    }

    this.init();
    
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported');
      window.dispatchEvent(new CustomEvent('app-toast-notification', {
        detail: {
          title: "Speech Engine Unsupported",
          message: "Your current browser does not support local speech synthesis. Try using Google Chrome or Safari.",
          type: "error"
        }
      }));
      if (options.onEnd) options.onEnd();
      return;
    }

    // Stop any current speech
    this.synth.cancel();

    // Mapping language to BCP 47 tags
    const langMap: Record<string, string> = {
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Modern Hebrew': 'he-IL',
      'Arabic': 'ar-SA',
      'modern hebrew': 'he-IL',
      'spanish': 'es-ES',
      'french': 'fr-FR',
      'german': 'de-DE',
      'arabic': 'ar-SA',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ar': 'ar-SA',
      'he': 'he-IL'
    };

    const targetLang = langMap[language] || langMap[language.toLowerCase()] || 'en-GB';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = options.rate || 0.85; // Slightly slower for better clarity
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = TTSService.volume;
    
    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event: any) => {
      console.error('SpeechSynthesis error:', event);
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        window.dispatchEvent(new CustomEvent('app-toast-notification', {
          detail: {
            title: "Speech Playback Issue",
            message: `Local voice system reported an anomaly (${event.error || 'interrupted'}).`,
            type: "warning"
          }
        }));
      }
      if (options.onEnd) options.onEnd();
    };

    // Try to find a better voice
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const languageCode = targetLang.split('-')[0].toLowerCase();
      const localizedVoices = voices.filter(v => v.lang.toLowerCase().startsWith(languageCode));
      
      let preferredVoice = null;
      
      // 1. Try explicitly selected voice
      if (options.preferredVoiceName) {
        preferredVoice = voices.find(v => v.name === options.preferredVoiceName);
      }
      
      // 2. Try high-quality defaults if no explicit selection or selection not found
      if (!preferredVoice) {
        preferredVoice = localizedVoices.find(v => 
          v.name.includes('Google') || 
          v.name.includes('Premium') || 
          v.name.includes('Natural') || 
          v.name.includes('Enhanced')
        );
      }
      
      // 3. Last resort: first localized voice found
      if (!preferredVoice) {
        preferredVoice = localizedVoices[0];
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    // Safari/Chrome fix: sometimes utterance needs to be re-triggered or resumed
    setTimeout(() => {
      this.synth.speak(utterance);
      // Extra kick for some mobile browsers
      if (this.synth.paused) {
        this.synth.resume();
      }
    }, 50);
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    // Also stop any playing audio elements
    const audios = document.querySelectorAll('audio[data-tts="cloud"]');
    audios.forEach(a => (a as HTMLAudioElement).pause());
  }

  private static async speakCloud(text: string, language: string, options: { onEnd?: () => void, cloudVoiceName?: string } = {}) {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text, 
        language,
        voiceName: options.cloudVoiceName || 'Aoede'
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error || 'Cloud TTS failed';
      if (errData.code === "API_KEY_EXPIRED" || errMsg.includes("expired") || errMsg.includes("API key") || errMsg.includes("API_KEY_INVALID")) {
        window.dispatchEvent(new CustomEvent('ai-studio-api-key-expired', { 
          detail: { error: errMsg } 
        }));
      }
      throw new Error(errMsg);
    }
    
    const { audio, mimeType } = await response.json();
    const resolvedMimeType = mimeType || 'audio/wav';
    const audioUrl = `data:${resolvedMimeType};base64,${audio}`;
    
    const audioEl = new Audio(audioUrl);
    audioEl.setAttribute('data-tts', 'cloud');
    audioEl.volume = TTSService.volume;
    audioEl.onended = () => options.onEnd?.();
    audioEl.onerror = (e) => {
      console.error('Cloud TTS Audio Element playback/load error:', e);
      window.dispatchEvent(new CustomEvent('app-toast-notification', {
        detail: {
          title: "Audio Decoder Error",
          message: "Could not play back Pro voice audio. Your browser may lack the necessary codecs.",
          type: "warning"
        }
      }));
      options.onEnd?.();
    };
    await audioEl.play();
  }
}
