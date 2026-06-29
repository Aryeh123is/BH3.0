
import { TTSService } from '../../services/ttsService';

export interface AudioEngineConfig {
  onEnded?: () => void;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  preferredVoiceName?: string;
  useCloud?: boolean;
  cloudVoiceName?: string;
}

export class ListeningAudioEngine {
  private static playCounts: Record<string, number> = {};
  private static currentUtterances: SpeechSynthesisUtterance[] = [];
  private static STORAGE_KEY = 'vocariox_listening_plays';

  private static loadPlayCounts() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.playCounts = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load play counts:", e);
      this.playCounts = {};
    }
  }

  private static savePlayCounts() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.playCounts));
    } catch (e) {
      console.error("Failed to save play counts:", e);
    }
  }

  static play(clipId: string, transcript: string, language: string, isExam: boolean, config?: AudioEngineConfig) {
    this.loadPlayCounts();
    const playLimit = 2; // v3.9.0/v3.9.6: Max of two times across all listening
    
    if (isExam && (this.playCounts[clipId] || 0) >= playLimit) {
      console.warn(`EXAM INTEGRITY: ${playLimit} plays only enforcement triggered. Refresh attempt blocked.`);
      return;
    }

    // Stop current
    this.stop();

    // v3.9.0/v3.9.1/v3.9.2: Natural examiner pacing delay (invisible)
    const initialDelay = isExam ? 1500 : 500;
    
    setTimeout(() => {
      this.playCounts[clipId] = (this.playCounts[clipId] || 0) + 1;
      this.savePlayCounts();

      if (config?.onStart) config.onStart();
      
      if (config?.useCloud) {
        import('../../services/ttsService').then(({ TTSService }) => {
          TTSService.speak(transcript, language, {
            useCloud: true,
            cloudVoiceName: config.cloudVoiceName,
            onEnd: () => {
              if (config?.onEnded) config.onEnded();
            }
          });
        });
        return;
      }

      // v3.9.2/v3.9.4: Speech Naturalisation Layer (Local Fallback)
      // Break transcript into natural chunks (punctuations) for rhythm
      const chunks = transcript.split(/([.,!?;:—])\s*/).reduce((acc: string[], val, i) => {
        if (i % 2 === 0) acc.push(val);
        else if (acc.length > 0) acc[acc.length - 1] += val;
        return acc;
      }, []).filter(c => c.trim().length > 0);

      const langMap: Record<string, string> = {
        'spanish': 'es-ES',
        'french': 'fr-FR',
        'german': 'de-DE',
        'arabic': 'ar-SA',
        'hebrew': 'he-IL',
        'modern hebrew': 'he-IL',
        'english': 'en-GB',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'ar': 'ar-SA',
        'he': 'he-IL'
      };

      const targetLang = langMap[language.toLowerCase()] || 'en-GB';

      const speakChunks = async (index: number) => {
        if (index >= chunks.length) {
          if (config?.onEnded) config.onEnded();
          return;
        }

        const chunk = chunks[index];
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = targetLang;
        utterance.volume = TTSService.getVolume();
        
        // v3.9.2/v3.9.4: Variation in speed mid-sentence & delivery jitter
        const baseRate = isExam ? 0.82 : 0.88;
        const jitteredRate = baseRate + (Math.random() * 0.10 - 0.05); 
        utterance.rate = jitteredRate;
        utterance.pitch = 1.0 + (Math.random() * 0.04 - 0.02); // Tiny pitch variance for human feel

        // Find better voice
        const voices = window.speechSynthesis.getVoices();
        const localizedVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0].toLowerCase()));
        
        let preferredVoice = null;
        if (config?.preferredVoiceName) {
          preferredVoice = voices.find(v => v.name === config.preferredVoiceName);
        }

        if (!preferredVoice) {
          preferredVoice = localizedVoices.find(v => 
            v.name.includes('Google') || 
            v.name.includes('Premium') || 
            v.name.includes('Natural') || 
            v.name.includes('Enhanced')
          ) || localizedVoices[0];
        }

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          // v3.9.4: Contextual pause variation
          // Sentence end (.) = longer pause. Comma (,) = shorter. Unmarked = micro-hesitation.
          let pause = Math.random() * 200 + 100; // Default micro-hesitation
          if (chunk.endsWith('.') || chunk.endsWith('!') || chunk.endsWith('?')) {
            pause = Math.random() * 400 + 500; // Sentence boundary
          } else if (chunk.endsWith(',') || chunk.endsWith(';') || chunk.endsWith(':')) {
            pause = Math.random() * 250 + 250; // Clause boundary
          }
          
          setTimeout(() => speakChunks(index + 1), pause);
        };

        utterance.onerror = (e: any) => {
          console.error("Speech Synthesis Error:", e);
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            window.dispatchEvent(new CustomEvent('app-toast-notification', {
              detail: {
                title: "Voice System Error",
                message: `The offline voice play system reported an error during listening task (${e.error || 'interrupted'})`,
                type: "warning"
              }
            }));
          }
          if (config?.onEnded) config.onEnded();
        };

        this.currentUtterances.push(utterance);
        window.speechSynthesis.speak(utterance);
      };

      speakChunks(0);
    }, initialDelay);
  }

  static stop() {
    window.speechSynthesis.cancel();
    this.currentUtterances = [];
  }

  static reset() {
    this.playCounts = {};
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
    this.stop();
  }

  static getPlayCount(clipId: string): number {
    if (Object.keys(this.playCounts).length === 0) {
      this.loadPlayCounts();
    }
    return this.playCounts[clipId] || 0;
  }
}
