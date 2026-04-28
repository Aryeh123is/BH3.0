import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, Clock, PlayCircle, CheckCircle2, Volume2, Star } from 'lucide-react';
import { EXAM_THEMES, READ_ALOUD_TASKS, ROLE_PLAY_CARDS, PICTURE_CARDS } from '../data/speaking_exam_data';
import { GoogleGenAI, Modality } from '@google/genai';
import Markdown from 'react-markdown';

interface SpeakingExamModeProps {
  onBack: () => void;
}

type ModeState = 'setup' | 'preparation' | 'exam' | 'feedback';
type ExamSection = 'read_aloud' | 'role_play' | 'picture_card' | 'general_conversation';

interface ChatMessage {
  role: 'user' | 'examiner';
  text: string;
}

export function SpeakingExamMode({ onBack }: SpeakingExamModeProps) {
  const [modeState, setModeState] = useState<ModeState>('setup');
  const [theme, setTheme] = useState<string>('');
  const [extraTime, setExtraTime] = useState<boolean>(false);
  const [prepSeconds, setPrepSeconds] = useState<number>(0);
  
  // Tasks
  const [readAloud, setReadAloud] = useState<any>(null);
  const [rolePlay, setRolePlay] = useState<any>(null);
  const [pictureCards, setPictureCards] = useState<any[]>([]);
  const [selectedPictureId, setSelectedPictureId] = useState<string>('');
  
  // Exam
  const [examSection, setExamSection] = useState<ExamSection>('read_aloud');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Feedback
  const [feedbackMarkdown, setFeedbackMarkdown] = useState('');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Setup generic tasks
    setReadAloud(READ_ALOUD_TASKS[Math.floor(Math.random() * READ_ALOUD_TASKS.length)]);
    setRolePlay(ROLE_PLAY_CARDS[Math.floor(Math.random() * ROLE_PLAY_CARDS.length)]);
  }, []);

  const handleStartPrep = () => {
    let chosenTheme = theme;
    if (!chosenTheme || chosenTheme === 'random') {
      chosenTheme = EXAM_THEMES[Math.floor(Math.random() * EXAM_THEMES.length)];
      setTheme(chosenTheme);
    }
    // Filter picture cards by theme or random if not enough
    let availablePics = PICTURE_CARDS.filter(p => p.theme === chosenTheme);
    if (availablePics.length < 2) {
      availablePics = [...PICTURE_CARDS].sort(() => 0.5 - Math.random()).slice(0, 2);
    } else {
      availablePics = availablePics.slice(0, 2);
    }
    setPictureCards(availablePics);
    setPrepSeconds(extraTime ? 18 * 60 : 15 * 60);
    setModeState('preparation');
  };

  useEffect(() => {
    if (modeState === 'preparation' && prepSeconds > 0) {
      const timer = setInterval(() => setPrepSeconds(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (modeState === 'preparation' && prepSeconds === 0) {
      startExam();
    }
  }, [modeState, prepSeconds]);

  const initChat = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      alert("Missing Gemini API Key");
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // System instruction builds the examiner persona based on current section
    const sysInstruction = `You are an official GCSE Spanish Examiner conducting a spoken exam.
Student Theme: ${theme}.
You will conduct the exam in this order:
1. Read Aloud Task: Assess them reading aloud, ask 2 short questions on the text.
2. Role Play: You play the specified role, ask questions.
3. Picture Card: The student has selected a picture card, ask questions.
4. General Conversation: Ask questions on the theme.

Keep your responses VERY short, naturally spoken in Spanish. Wait for their answers. Do not act like a robot. You are evaluating them for their GCSE grade.`

    chatInstanceRef.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: sysInstruction,
      }
    });
  };

  const startExam = () => {
    if (!selectedPictureId && pictureCards.length > 0) {
       setSelectedPictureId(pictureCards[0].id);
    }
    initChat();
    setModeState('exam');
    setExamSection('read_aloud');
    addAiExaminerMessage("¡Hola! Vamos a empezar el examen de español. Empecemos con la tarea de lectura. Por favor, lee el texto en voz alta.");
  };

  const playAudio = async (text: string) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const float32Data = new Float32Array(bytes.length / 2);
        const dataView = new DataView(bytes.buffer);
        for (let i = 0; i < float32Data.length; i++) {
          float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Error:", e);
    }
  };

  const addAiExaminerMessage = (msg: string) => {
    setChatLog(prev => [...prev, { role: 'examiner', text: msg }]);
    playAudio(msg);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Su navegador no soporta reconocimiento de voz. Use Chrome, Safari, o Edge.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Use primarily Spanish
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
      if (final) {
        handleUserMessage(final);
      }
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
      setInterimTranscript('');
    };

    /* onend trigger when user stops speaking for a moment or completes */
    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim() || !chatInstanceRef.current) return;
    setChatLog(prev => [...prev, { role: 'user', text }]);
    setIsProcessing(true);

    try {
      const response = await chatInstanceRef.current.sendMessage({ message: text });
      const examinerResponse = response.text || "Lo siento, no te he escuchado. ¿Puedes repetir?";
      addAiExaminerMessage(examinerResponse);
    } catch (error) {
      console.error(error);
      addAiExaminerMessage("Hubo un error de conexión, continuemos.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFeedback = async () => {
    setModeState('feedback');
    setFeedbackMarkdown("Generando comentarios detallados del examinador... Por favor espera.");
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      const transcriptStr = chatLog.map(m => `${m.role === 'examiner' ? 'Examiner' : 'Student'}: ${m.text}`).join("\n");
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a Senior GCSE Spanish Examiner evaluating a speaking exam transcript.
Here is the transcript:
${transcriptStr}

Write a detailed feedback report in Markdown formatting following EXACTLY this structure:
## Estimated Mark
Give a total mark (out of 60) and estimated GCSE grade (e.g. Grade 7). Give a brief breakdown.

## What went well
At least 3 positive points with examples from their speech (e.g. good vocabulary, tense usage).

## What needs improvement
At least 3 points where they struggled (e.g. hesitation, grammar errors, limited tense variety).

## Grade 9 Upgrades
Give 3 specific examples of how they could have rephrased their weaker answers into Grade 9 model answers.

## Personal Revision Targets
3 bullet points of what they must practice next.
`,
      });
      setFeedbackMarkdown(response.text || "Feedback generation failed.");
    } catch (e) {
       console.error("Feedback error", e);
       setFeedbackMarkdown("Error generating feedback. Please check API key.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-900/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Terminar / Volver</span>
          </button>
          
          {modeState === 'exam' && (
            <div className={`flex px-3 py-1.5 rounded-full items-center gap-2 border transition-all ${isRecording ? 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800' : 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50'}`}>
               <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : 'text-indigo-500'}`} />
               <span className={`text-sm font-bold ${isRecording ? 'text-red-700 dark:text-red-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                  {isRecording ? "Grabando..." : "Listo"}
               </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {modeState === 'setup' && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-indigo-900/5 border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Speaking Exam Mode</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Train Like the Real Exam.</p>
            
            <div className="space-y-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select your GCSE Theme</label>
                 <select 
                   value={theme}
                   onChange={e => setTheme(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   <option value="" disabled>Choose a theme...</option>
                   {EXAM_THEMES.map(t => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                   <option value="random">Not sure / Pick for me</option>
                 </select>
              </div>

              <div>
                 <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                   <input type="checkbox" checked={extraTime} onChange={() => setExtraTime(!extraTime)} className="w-5 h-5 accent-indigo-600" />
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white">Extra Time (25%)</p>
                     <p className="text-sm text-slate-500 dark:text-slate-400">18 minutes preparation time instead of 15</p>
                   </div>
                 </label>
              </div>

              <button 
                onClick={handleStartPrep}
                disabled={!theme}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                Start Preparation Room
              </button>
            </div>
          </div>
        )}

        {modeState === 'preparation' && (
          <div className="space-y-8">
            <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between sticky top-[72px] z-40">
              <div>
                <h2 className="text-2xl font-black">Preparation Room</h2>
                <p className="text-indigo-100 font-medium">Read Aloud, Role Play & Picture Card</p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-lg px-6 py-3 rounded-2xl">
                <Clock className="w-6 h-6 animate-pulse" />
                <span className="text-3xl font-black tabular-nums tracking-widest">
                  {Math.floor(prepSeconds / 60)}:{(prepSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Task 1: Read Aloud</h3>
                  {readAloud && (
                    <div>
                      <p className="font-bold text-indigo-600 mb-2">{readAloud.title}</p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{readAloud.text}</p>
                    </div>
                  )}
               </div>
               
               <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">Task 2: Role Play</h3>
                  {rolePlay && (
                    <div>
                      <p className="font-bold text-emerald-600 mb-3 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">{rolePlay.scenario}</p>
                      <ul className="space-y-2 pl-2">
                        {rolePlay.bulletPoints.map((bp: string, i: number) => (
                          <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300 font-medium">
                            <span className="text-emerald-500">•</span>
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Task 3: Picture Card</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">You must select ONE card to discuss in the exam.</p>
               <div className="grid md:grid-cols-2 gap-6">
                 {pictureCards.map(card => (
                   <div 
                     key={card.id}
                     onClick={() => setSelectedPictureId(card.id)}
                     className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedPictureId === card.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-100 dark:border-slate-700 hover:border-amber-200'}`}
                   >
                     <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-widest text-amber-600">{card.theme}</p>
                       {selectedPictureId === card.id && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                     </div>
                     <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 flex items-center justify-center text-4xl">
                       {card.imageUrl.split('[')[0]}
                     </div>
                     <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">{card.description}</p>
                     <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Questions to prepare for:</p>
                     <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 pl-4 list-disc font-medium">
                       {card.questions.map((q: string, i: number) => <li key={i}>{q}</li>)}
                     </ul>
                   </div>
                 ))}
               </div>
            </div>

            <button 
               onClick={startExam}
               className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
            >
              <PlayCircle className="w-6 h-6" />
              START EXAM NOW
            </button>
          </div>
        )}

        {modeState === 'exam' && (
          <div className="flex flex-col h-[600px]">
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between text-sm shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-4 text-slate-400 font-bold">
                  <span className={examSection === 'read_aloud' ? 'text-indigo-600 dark:text-indigo-400' : ''}>1. Read Aloud</span>
                  <span className={examSection === 'role_play' ? 'text-indigo-600 dark:text-indigo-400' : ''}>2. Role Play</span>
                  <span className={examSection === 'picture_card' ? 'text-indigo-600 dark:text-indigo-400' : ''}>3. Picture Card</span>
                  <span className={examSection === 'general_conversation' ? 'text-indigo-600 dark:text-indigo-400' : ''}>4. General Conv</span>
                </div>
                <button onClick={() => setExamSection(s => s === 'read_aloud' ? 'role_play' : s === 'role_play' ? 'picture_card' : s === 'picture_card' ? 'general_conversation' : 'general_conversation')} className="text-xs font-bold uppercase tracking-widest bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">
                  Next Section ⏭
                </button>
             </div>

             <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {chatLog.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                        {m.role === 'examiner' && <Volume2 className="w-5 h-5 mb-3 text-indigo-500" />}
                        <p className="font-medium text-lg leading-relaxed">{m.text}</p>
                     </div>
                  </div>
                ))}
                
                {interimTranscript && (
                  <div className="flex justify-end opacity-75">
                     <div className="max-w-[80%] rounded-2xl p-4 bg-indigo-500 text-white italic shadow-md">
                        <p className="font-medium text-lg">{interimTranscript}...</p>
                     </div>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="flex justify-start">
                     <div className="max-w-[80%] rounded-2xl p-4 bg-white dark:bg-slate-800 flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                     </div>
                  </div>
                )}
             </div>

             <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl mt-auto sticky bottom-4">
               <button
                 onMouseDown={startRecording}
                 onMouseUp={stopRecording}
                 onTouchStart={startRecording}
                 onTouchEnd={stopRecording}
                 onMouseLeave={stopRecording}
                 className={`flex-1 overflow-hidden transition-all duration-300 relative py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg select-none ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-[0.98]' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}`}
               >
                 {isRecording && <div className="absolute inset-0 bg-red-400 animate-ping opacity-20 rounded-2xl" />}
                 <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
                 {isRecording ? "Grabando..." : "Manten pulsado para hablar"}
               </button>

               {chatLog.length > 5 && (
                 <button onClick={generateFeedback} className="ml-4 px-6 py-5 text-sm font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 transition-colors shadow-sm">
                   Finalizar
                 </button>
               )}
             </div>
          </div>
        )}

        {modeState === 'feedback' && (
          <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl shadow-indigo-900/5 border border-slate-100 dark:border-slate-700 max-w-none">
             <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
                <Star className="w-8 h-8 fill-current" />
                <h2 className="text-3xl font-black m-0">Official Examiner Feedback</h2>
             </div>
             
             {feedbackMarkdown.includes("Por favor") ? (
               <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <span className="font-bold tracking-widest uppercase text-sm animate-pulse">{feedbackMarkdown}</span>
               </div>
             ) : (
               <div className="markdown-body">
                 <Markdown>{feedbackMarkdown}</Markdown>
               </div>
             )}
             
             {!feedbackMarkdown.includes("Por favor") && (
               <button onClick={() => setModeState('setup')} className="w-full mt-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all text-lg tracking-widest uppercase">
                 Start Another Exam
               </button>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
