import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExamBoardSchema,
  ExamAttempt,
  TaskAnswer,
  ExamSession,
  ResolvedTaskSnapshot,
  ExamEvent,
  SPEAKING_FLOW
} from "../../types/speaking-engine";
import { ExamEnvironment } from "../../types";
import { EDEXCEL_THEMES as SPANISH_THEMES } from "../../data/content-bank/mock-spanish-content";
import { FRENCH_THEMES } from "../../data/content-bank/mock-french-content";
import { GERMAN_THEMES } from "../../data/content-bank/mock-german-content";
import { generateExamSnapshot } from "./contentResolver";
import { RefreshCw, Play, ImageOff, Users, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { TTSService } from "../../services/ttsService";
import { ThemeVisual } from "../common/ThemeVisual";
import { SubscriptionService } from "../../services/monetization/subscriptionService";
import { ProgressService } from "../../services/user/progressService";
import { MissionService } from "../../services/user/missionService";
import { SessionPersistence } from "../../services/sessionPersistence";
import { AnalyticsService } from "../../services/analyticsService";

import { EXAM_RULES } from "../../core/examRules";
 
 interface SpeakingExamFlowProps {
  schema: ExamBoardSchema;
  onComplete: (attempt: ExamAttempt) => void;
  extraTime?: boolean;
  microphoneAlwaysOn?: boolean;
  audioAutoplay?: boolean;
  preferredVoices?: Record<string, string>;
  useCloudVoices?: boolean;
  cloudVoices?: Record<string, string>;
  environment?: ExamEnvironment;
}

export const SpeakingExamFlow: React.FC<SpeakingExamFlowProps> = ({
  schema,
  onComplete,
  extraTime = false,
  microphoneAlwaysOn = false,
  audioAutoplay = false,
  preferredVoices = {},
  useCloudVoices = false,
  cloudVoices = {},
  environment = 'TRAINING'
}) => {
  // Setup State
  const [selectedThemeId, setSelectedThemeId] = useState<string>("");
  const [isResolving, setIsResolving] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  // The Frozen Session State
  const [session, setSession] = useState<ExamSession | null>(null);

  // Execution State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTimestamp] = useState(() => Date.now());
  const [revealedFollowUps, setRevealedFollowUps] = useState<Set<string>>(new Set());
  const [revealingIds, setRevealingIds] = useState<Set<string>>(new Set());
  const [invalidImages, setInvalidImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkLimit = SubscriptionService.canStartExam();
    if (!checkLimit.allowed) {
      setLimitReached(true);
    }
  }, []);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const persistentStreamRef = useRef<MediaStream | null>(null);
  const [isMicReady, setIsMicReady] = useState(false);

  // Log Event Helper
  const logEvent = (event: any) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        eventLog: [
          ...prev.eventLog,
          { ...event, timestamp: new Date().toISOString() } as ExamEvent,
        ],
      };
    });
  };

  const currentThemes = React.useMemo(() => {
    const languageLower = schema.language.toLowerCase();
    return languageLower === 'spanish' ? SPANISH_THEMES : 
           languageLower === 'french' ? FRENCH_THEMES :
           languageLower === 'german' ? GERMAN_THEMES :
           languageLower === 'arabic' ? [
             { id: 'theme-1-my-personal-world', title: 'My Personal World' },
             { id: 'theme-3-school', title: 'School & Education' },
             { id: 'theme-6-travel', title: 'Travel & Tourism' },
             { id: 'theme-4-future-plans', title: 'Future Plans' },
             { id: 'theme-5-environment', title: 'The Environment' },
             { id: 'theme-7-technology', title: 'Technology' }
           ] :
           languageLower.includes('hebrew') ? [
             { id: 'theme-1-my-personal-world', title: 'My Personal World' },
             { id: 'theme-2-lifestyle', title: 'Lifestyle & Wellbeing' },
             { id: 'theme-3-neighbourhood', title: 'My Neighbourhood' },
             { id: 'theme-4-media-tech', title: 'Media & Technology' },
             { id: 'theme-5-studying-future', title: 'Studying & My Future' },
             { id: 'theme-6-travel', title: 'Travel & Tourism' }
           ] : SPANISH_THEMES;
  }, [schema.language]);

  useEffect(() => {
    if (!session || session.examState === "setup") {
      if (!selectedThemeId && currentThemes.length > 0) {
        setSelectedThemeId(currentThemes[0].id);
      }
    }
  }, [session?.examState, selectedThemeId, currentThemes]);

  const uiLabels = React.useMemo(() => {
    const lang = schema.language.toLowerCase();
    const isAr = lang === 'arabic';
    const isHe = lang === 'hebrew' || lang === 'modern hebrew';
    const isFr = lang === 'french';
    const isEs = lang === 'spanish';
    const isDe = lang === 'german';

    if (isEs) return {
      startRecording: "Empezar Grabación",
      stopRecording: "Detener Grabación",
      nextSection: "Siguiente Sección",
      finishExam: "Finalizar Examen",
      endPrep: "Terminar prep. y empezar examen",
      playing: "Preparando...",
      playQuestion: "Reproducir Pregunta",
      thinking: "Pensando...",
      unseen: "No Visto",
      followUp: "Seguimiento",
      loading: "Cargando contenido...",
      examCompleted: "¡Examen Finalizado!",
      awaitingReview: "Todas las secciones se grabaron correctamente. Esperando revisión.",
      startAnother: "Empezar Otra Sesión",
      candidate: "Candidato",
      unseenElements: "Los elementos no vistos y seguimientos se entregan verbalmente.",
      examinerView: "Vista del Examinador (Prompts)",
      visibleDuringPrep: "Visible durante la preparación:",
      examinerQuestionsNext: "Las preguntas del examinador se reproducirán a continuación.",
      listenAndRespond: "Escuche y responda a las preguntas",
      questionBankLoaded: "Banco de preguntas cargado",
      selectedThemeQuestions: "Preguntas del tema seleccionado",
      prompt: "Prompt",
      question: "Pregunta",
      option: "Opción"
    };
    if (isFr) return {
      startRecording: "Démarrer l'enregistrement",
      stopRecording: "Arrêter l'enregistrement",
      nextSection: "Section suivante",
      finishExam: "Terminer l'examen",
      endPrep: "Fin de prép. & début d'examen",
      playing: "Préparation...",
      playQuestion: "Lire la question",
      thinking: "Réflexion...",
      unseen: "Inconnu",
      followUp: "Suivi",
      loading: "Chargement du contenu...",
      examCompleted: "Examen terminé !",
      awaitingReview: "Toutes les sections ont été enregistrées. En attente de correction.",
      startAnother: "Commencer une autre session",
      candidate: "Candidat",
      unseenElements: "Les éléments inconnus et les suivis sont livrés verbalement.",
      examinerView: "Vue de l'examinateur (Prompts)",
      visibleDuringPrep: "Visible pour vous pendant la préparation :",
      examinerQuestionsNext: "Les questions de l'examinateur seront jouées ensuite.",
      listenAndRespond: "Écoutez et répondez aux questions",
      questionBankLoaded: "Banque de questions chargée",
      selectedThemeQuestions: "Questions du thème sélectionné",
      prompt: "Prompt",
      question: "Question",
      option: "Option"
    };
    if (isDe) return {
      startRecording: "Aufnahme starten",
      stopRecording: "Aufnahme stoppen",
      nextSection: "Nächster Abschnitt",
      finishExam: "Prüfung beenden",
      endPrep: "Vorbereitung beenden & Prüfung starten",
      playing: "Vorbereitung...",
      playQuestion: "Frage abspielen",
      thinking: "Nachdenken...",
      unseen: "Unbekannt",
      followUp: "Nachfrage",
      loading: "Inhalt wird geladen...",
      examCompleted: "Prüfung abgeschlossen!",
      awaitingReview: "Alle Abschnitte wurden aufgezeichnet. Warten auf Bewertung.",
      startAnother: "Weitere Sitzung starten",
      candidate: "Kandidat",
      unseenElements: "Unbekannte Elemente und Nachfragen werden mündlich übermittelt.",
      examinerView: "Ansicht des Prüfers (Prompts)",
      visibleDuringPrep: "Während der Vorbereitung für Sie sichtbar:",
      examinerQuestionsNext: "Die Fragen des Prüfers werden als Nächstes abgespielt.",
      listenAndRespond: "Zuhören und auf Fragen antworten",
      questionBankLoaded: "Fragenkatalog geladen",
      selectedThemeQuestions: "Fragen zum ausgewählten Thema",
      prompt: "Ansage",
      question: "Frage",
      option: "Option"
    };
    if (isAr) return {
      startRecording: "بدء التسجيل",
      stopRecording: "إيقاف التسجيل",
      nextSection: "القسم التالي",
      finishExam: "إنهاء الامتحان",
      endPrep: "إنهاء التحضير وبدء الامتحان",
      playing: "جاري التحضير...",
      playQuestion: "تشغيل السؤال",
      thinking: "جاري التفكير...",
      unseen: "غير مرئي",
      followUp: "متابعة",
      loading: "جاري تحميل المحتوى...",
      examCompleted: "تم اكتمال الامتحان!",
      awaitingReview: "تم تسجيل جميع الأقسام. بانتظار مراجعة الممتحن.",
      startAnother: "بدء جلسة امتحان أخرى",
      candidate: "مرشح",
      unseenElements: "يتم تقديم العناصر غير المرئية والمتابعات شفهياً.",
      examinerView: "عرض الممتحن (المطالبات)",
      visibleDuringPrep: "مرئي لك أثناء التحضير:",
      examinerQuestionsNext: "سيتم تشغيل أسئلة الممتحن بعد ذلك.",
      listenAndRespond: "الاستماع والاستجابة للأسئلة",
      questionBankLoaded: "تم تحميل بنك الأسئلة",
      selectedThemeQuestions: "أسئلة الموضوع المختار",
      prompt: "مطالبة",
      question: "سؤال",
      option: "خيار"
    };
    if (isHe) return {
      startRecording: "התחל הקלטה",
      stopRecording: "עצור הקלטה",
      nextSection: "הקטע הבא",
      finishExam: "סיים בחינה",
      endPrep: "סיים הכנה והתחל בחינה",
      playing: "מכין...",
      playQuestion: "נגן שאלה",
      thinking: "חושב...",
      unseen: "לא ידוע",
      followUp: "שאלת המשך",
      loading: "טוען תוכן...",
      examCompleted: "הבחינה הושלמה!",
      awaitingReview: "כל הקטעים הוקלטו כראוי. ממתין לבדיקה.",
      startAnother: "התחל עוד בחינה",
      candidate: "מועמד",
      unseenElements: "אלמנטים לא ידועים ושאלות המשך מועברים בעל פה.",
      examinerView: "תצוגת הבוחן",
      visibleDuringPrep: "גלוי לך במהלך ההכנה:",
      examinerQuestionsNext: "שאלות הבוחן יושמעו בהמשך.",
      listenAndRespond: "הקשב וענה על השאלות",
      questionBankLoaded: "מאגר השאלות נטען",
      selectedThemeQuestions: "שאלות בנושא הנבחר",
      prompt: "הנחיה",
      question: "שאלה",
      option: "אופציה"
    };

    return {
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      nextSection: "Next Section",
      finishExam: "Finish Exam",
      endPrep: "End Prep Early & Start Exam",
      playing: "Preparing...",
      playQuestion: "Play Question",
      thinking: "Thinking...",
      unseen: "Unseen",
      followUp: "Follow Up",
      loading: "Loading exam content...",
      examCompleted: "Exam Completed!",
      awaitingReview: "All sections were recorded properly. Awaiting examiner review.",
      startAnother: "Start Another Exam Session",
      candidate: "Candidate",
      unseenElements: "Unseen elements and follow-ups are delivered verbally.",
      examinerView: "Examiner's View (Prompts)",
      visibleDuringPrep: "Visible to you during prep:",
      examinerQuestionsNext: "Examiner questions will be played next.",
      listenAndRespond: "Listen and respond to questions",
      questionBankLoaded: "Question Bank loaded",
      selectedThemeQuestions: "Selected Theme Questions",
      prompt: "Prompt",
      question: "Question",
      option: "Option"
    };
  }, [schema.language]);

  // Timer effect (v3.9.6 Delta Tracking)
  useEffect(() => {
    if (!session || (session.examState !== "prep" && session.examState !== "exam")) return;

    const tick = () => {
      // For speaking, timeLeft is managed per-section, but we use delta for prep phase integrity
      if (session.examState === 'prep') {
         const basePrep = schema.globalPrepSeconds || EXAM_RULES.SPEAKING.PREP_SECONDS;
         const totalPrepSeconds = extraTime ? Math.round(basePrep * 1.25) : basePrep;
         const elapsedMs = Date.now() - examStartTimestamp;
         const remaining = Math.max(0, totalPrepSeconds - Math.floor(elapsedMs / 1000));
         setTimeLeft(remaining);
         if (remaining <= 0) startExamExecution();
      } else {
         // Simple decrement for active sections is acceptable since we don't have a global exam timer in speaking
         // but we should still move towards delta if possible.
         setTimeLeft(l => {
           if (l <= 0) return 0;
           return l - 1;
         });
      }
    };

    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [session?.examState, examStartTimestamp]);

  const handleStartPrep = async () => {
    if (!selectedThemeId || isResolving) return;

    const isExam = environment === 'EXAM';
    setIsResolving(true);
    setSetupError(null);
    try {
      // 1. Resolve and Freeze everything ONCE (removed 3s delay for instant load)
      const resolvedTasks = await generateExamSnapshot(schema.sections, selectedThemeId, schema.language, environment);

      // 2. Initialize Session
      const tones = EXAM_RULES.SPEAKING.EXAMINER.TONES;
      const pacings = EXAM_RULES.SPEAKING.EXAMINER.PACINGS;
      const { MIN, MAX } = EXAM_RULES.SPEAKING.EXAMINER.STRICTNESS_RANGE;
      
      const newSession: ExamSession = {
        sessionId: crypto.randomUUID(),
        schemaId: schema.id,
        selectedThemeId,
        resolvedTasks,
        examState: "prep",
        profile: {
          examinerTone: tones[Math.floor(Math.random() * tones.length)],
          pacing: pacings[Math.floor(Math.random() * pacings.length)],
          humanityJitter: Math.random(),
          strictnessOffset: (Math.random() * (MAX - MIN)) + MIN,
        },
        timestamps: {
          start: new Date().toISOString(),
        },
        hasExtraTime: extraTime,
        userAnswerBuffer: [],
        eventLog: [
          {
            type: "PHASE_CHANGED",
            from: "setup",
            to: "prep",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setSession(newSession);
      // Extra time logic: base 12m (720s) -> 15m (900s)
      const basePrep = schema.globalPrepSeconds || EXAM_RULES.SPEAKING.PREP_SECONDS;
      setTimeLeft(extraTime ? Math.round(basePrep * 1.25) : basePrep);
    } catch (err: any) {
      console.error("Failed to start prep phase:", err);
      // Fallback in case of critical error
      setIsResolving(false);
      if (err.message?.startsWith('DATASET_MISSING')) {
        setSetupError(`The exam dataset for ${schema.language} is currently unavailable. Please select another language or contact support.`);
      } else {
        setSetupError("Failed to initialize exam content. Please check your connection and try again.");
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handlePhotoCardChoice = (cardId: string) => {
    if (session && session.examState === 'prep') {
      setSession({ ...session, selectedPhotoCardId: cardId });
    }
  }

  const getTaskForStep = (stepId: string, resolvedTasks: ResolvedTaskSnapshot[]) => {
    return resolvedTasks.find((task) => task.linkedSteps?.includes(stepId));
  };

  const startExamExecution = async () => {
    if(!session) return;
    
    // Request microphone once if persistent mode is on
    if (microphoneAlwaysOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        persistentStreamRef.current = stream;
        setIsMicReady(true);
      } catch (err) {
        console.error("Error pre-accessing microphone:", err);
      }
    }

    // Choose the first card as a fallback if not selected
    let selectedPhotoCardId = session.selectedPhotoCardId;
    if (!selectedPhotoCardId) {
       const pcSection = session.resolvedTasks.find(t => t.type === 'photo_card');
       if (pcSection && pcSection.options && pcSection.options.length > 0) {
         selectedPhotoCardId = pcSection.options[0].id;
       }
    }

    setSession(prev => {
      if (!prev) return null;
      const ts = new Date().toISOString();
      return {
        ...prev,
        examState: "exam",
        selectedPhotoCardId,
        timestamps: {
          ...prev.timestamps,
          prepEnd: ts
        },
        eventLog: [
          ...prev.eventLog,
          { type: 'PHASE_CHANGED', from: 'prep', to: 'exam', timestamp: ts },
          { type: 'TASK_RENDERED', taskId: "READ_ALOUD", timestamp: ts }
        ]
      };
    });

    // Reset follow-ups for the new phase
    setRevealedFollowUps(new Set());
    
    setCurrentStepIndex(0);
    setTimeLeft(
      extraTime
        ? schema.sections[0].activeSeconds * 1.25 // approximation
        : schema.sections[0].activeSeconds,
    );
  };

  const toggleRecording = async () => {
    if(!session) return;

    if (isRecording) {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        let stream = persistentStreamRef.current;
        if (!stream || stream.getTracks().every(t => t.readyState === 'ended')) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (microphoneAlwaysOn) {
            persistentStreamRef.current = stream;
          }
        }
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordingDuration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;
          
          // v3.9.6 False Input Filtering: Under 1.5s is usually accidental or empty tap
          if (recordingDuration < 1.5) {
             console.warn("Speaking Engine: Filtered accidental/too-short recording", recordingDuration);
             return;
          }

          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const currentStepName = SPEAKING_FLOW[currentStepIndex];
          const timestamp = new Date().toISOString();
          const audioRef = `${currentStepName}_${timestamp}`;

          setSession(prev => {
            if(!prev) return prev;
            const buffer = prev.userAnswerBuffer || [];
            return {
              ...prev,
              userAnswerBuffer: [
                ...buffer.filter((a) => a.sectionId !== currentStepName),
                {
                  sectionId: currentStepName,
                  audioBlobUrl: URL.createObjectURL(audioBlob),
                  timestamp,
                }
              ],
              eventLog: [
                ...prev.eventLog,
                { type: 'RECORDING_STOPPED', taskId: currentStepName, timestamp, audioRef },
                { type: 'ANSWER_SAVED', taskId: currentStepName, timestamp, audioBlobId: audioRef }
              ]
            }
          });

          // Only stop tracks if not in persistent mode
          if (!microphoneAlwaysOn) {
            stream?.getTracks().forEach((track) => track.stop());
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        logEvent({
          type: 'RECORDING_STARTED',
          taskId: SPEAKING_FLOW[currentStepIndex],
        });
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required to record the exam.");
      }
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (audioAutoplay && session?.examState === 'exam' && !isTransitioning) {
      const currentStepName = SPEAKING_FLOW[currentStepIndex];
      const instruction = getExaminerInstruction(currentStepName);
      if (instruction) {
        TTSService.speak(instruction, schema.language, getTTSOptions());
      }
    }
  }, [currentStepIndex, session?.examState, isTransitioning]);

  useEffect(() => {
    // Cleanup persistent stream on unmount
    return () => {
      if (persistentStreamRef.current) {
        persistentStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (session?.examState === "completed") {
      // Small timeout to allow the final media recorder chunk to save the answer in state
      const t = setTimeout(() => {
        // Record Retention Metrics
        ProgressService.recordExamCompletion(session.selectedThemeId, {
          speaking: 75, // Placeholder values for local tracking
          fluency: 70,
          vocabulary: 80,
          grammar: 65,
          pronunciation: 72
        });

        // Record Speaking exam result in analytics
        AnalyticsService.saveExamResult({
          language: schema.language,
          type: 'Speaking',
          score: 72,
          total: 100,
          avgTime: 35,
          topics: [session.selectedThemeId || 'GENERAL']
        });
        AnalyticsService.recordResult(session.selectedThemeId || 'GENERAL', true, 180);

        MissionService.completeMission('m1');
        if (session.selectedThemeId === 'theme-1-my-personal-world') {
          MissionService.completeMission('m2');
        }

        onComplete({
          id: session.sessionId,
          schemaId: schema.id,
          timestamp: session.timestamps.start || new Date().toISOString(),
          selectedThemeId: session.selectedThemeId,
          hasExtraTime: session.hasExtraTime,
          answers: session.userAnswerBuffer,
          eventLog: session.eventLog,
          transcriptSegments: session.transcriptSegments || [],
          status: "submitted",
          profile: session.profile,
        });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [session?.examState, session?.userAnswerBuffer, onComplete]);

  const handleNextSection = () => {
    if (!session) return;
    if (isRecording) toggleRecording();

    setIsTransitioning(true);
    
    // Smooth transition delay based on session pacing + human jitter (linguistic hesitation)
    const humanityFactor = session.profile.humanityJitter || 0;
    const jitter = Math.random() * (1000 * humanityFactor);
    const pacingCfg = EXAM_RULES.SPEAKING.PACING_MODES[session.profile.pacing.toUpperCase() as keyof typeof EXAM_RULES.SPEAKING.PACING_MODES] || EXAM_RULES.SPEAKING.PACING_MODES.STANDARD;
    const pacingDelay = pacingCfg.delay + jitter;

    setTimeout(() => {
      if (currentStepIndex === SPEAKING_FLOW.length - 1) {
        setSession(prev => {
          if (!prev) return null;
          const ts = new Date().toISOString();
          return {
            ...prev,
            examState: "completed",
            timestamps: {
              ...prev.timestamps,
              examEnd: ts
            },
            eventLog: [
              ...prev.eventLog,
              { type: 'PHASE_CHANGED', from: 'exam', to: 'completed', timestamp: ts }
            ]
          };
        });
      } else {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        const nextStepName = SPEAKING_FLOW[nextIndex];
        const nextSection = getTaskForStep(nextStepName, session.resolvedTasks);
        
        // Reset follow-ups when moving to a new section
        setRevealedFollowUps(new Set());

        setTimeLeft(
          session.hasExtraTime
            ? (nextSection?.activeSeconds || 120) * 1.25 // Approximation
            : (nextSection?.activeSeconds || 120)
        );
        
        logEvent({
          type: 'TASK_RENDERED',
          taskId: nextStepName,
        });
      }
      setIsTransitioning(false);
    }, pacingDelay);
  };

  const getExaminerInstruction = (taskId: string) => {
    if (!session) return "";
    const tone = session.profile.examinerTone;
    const lang = schema.language.toLowerCase();

    const allInstructions: Record<string, Record<string, Record<'formal' | 'encouraging' | 'strict', string[]>>> = {
      en: {
        READ_ALOUD: {
          formal: ["Right. Um, you may now begin your reading of the passage.", "Please read the text provided aloud, whenever you're ready.", "I would like you to read this passage for me... so, begin when you're set."],
          encouraging: ["Okay, so... when you're ready, please read this passage for me.", "Good. Now, um, please read this text out loud."],
          strict: ["Begin reading the passage now.", "Read the passage exactly as written."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["Thank you. I will now ask you some questions based on that text.", "Now, listen to these follow-up questions... right."],
          encouraging: ["Well done. I have a few questions about what you just read... if that's okay?", "That was good. Now, let's talk about the text for a moment."],
          strict: ["Answer the following questions based on the text.", "I shall now pose the follow-up questions."]
        },
        ROLEPLAY: {
          formal: ["Right. Um... we shall now proceed to the roleplay task.", "Please review the scenario... right. We will begin the roleplay now."],
          encouraging: ["Let's try a roleplay now. Imagine, er, you are in this situation.", "Now then, imagine we are in this scenario together."],
          strict: ["Task 2: Roleplay. Read the scenario and respond accordingly.", "Starting the roleplay task now."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["Now, please... um... select your chosen photo card for discussion.", "Which photo card would you like to discuss today?"],
          encouraging: ["Okay, so... which of these pictures would you like to talk about?", "Pick the photo you feel most comfortable with."],
          strict: ["Select your photo card now.", "Choose a card to proceed."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["Describe the photo... er... as best as you can.", "Tell me... um... what you see in the photo in as much detail as possible."],
          encouraging: ["So, tell me... what can you see in this photo?", "Just describe the picture for me, er... in your own words."],
          strict: ["Describe the photo.", "Observation mission: Describe the image."]
        },
        FREE_CONVERSATION: {
          formal: ["We will now... er... conclude with a general conversation.", "Our final task is a general conversation... so, let's start."],
          encouraging: ["Last part now! er... Let's just have a chat about your theme.", "Nearly there! Let's talk about your life and interests for a bit."],
          strict: ["General Conversation phase. Respond to the questions.", "Final task: General Conversation."]
        }
      },
      es: {
        READ_ALOUD: {
          formal: ["Bien. Eh, ahora puedes comenzar a leer el fragmento.", "Por favor, lee el texto proporcionado en voz alta cuando estés listo.", "Me gustaría que leyeras este fragmento para mí... así que, empieza cuando estés preparado."],
          encouraging: ["Muy bien... cuando estés listo, lee este fragmento por favor.", "Bien. Ahora lee este texto en voz alta por favor."],
          strict: ["Empieza a leer el fragmento ahora.", "Lee el fragmento exactamente como está escrito."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["Gracias. Ahora te haré algunas preguntas basadas en ese texto.", "Escucha estas preguntas adicionales."],
          encouraging: ["Bien hecho. Tengo algunas preguntas sobre lo que acabas de leer... ¿te parece bien?", "Eso estuvo bien. Ahora hablemos un momento sobre el texto."],
          strict: ["Responde a las siguientes preguntas basadas en el texto.", "Ahora plantearé las preguntas adicionales."]
        },
        ROLEPLAY: {
          formal: ["Bien. Procederemos ahora con la tarea de juego de rol.", "Por favor, revisa el escenario... Bien. Empezaremos el juego de rol ahora."],
          encouraging: ["Intentemos un juego de rol ahora. Imagina que estás en esta situación.", "Imagina que estamos juntos en este escenario."],
          strict: ["Tarea 2: Juego de rol. Lee el escenario y responde adecuadamente.", "Empezando el juego de rol ahora."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["Ahora, por favor... selecciona la tarjeta de foto elegida para la discusión.", "¿Qué tarjeta de foto te gustaría discutir hoy?"],
          encouraging: ["Muy bien... ¿de cuál de estas imágenes te gustaría hablar?", "Elige la foto con la que te sientas más cómodo."],
          strict: ["Selecciona tu tarjeta de foto ahora.", "Elige una tarjeta para proceder."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["Describe la foto lo mejor que puedas.", "Dime lo que ves en la foto con el mayor detalle posible."],
          encouraging: ["Dime... ¿qué puedes ver en esta foto?", "Simplemente describe la imagen para mí, con tus propias palabras."],
          strict: ["Describe la foto.", "Misión de observación: Describe la imagen."]
        },
        FREE_CONVERSATION: {
          formal: ["Concluiremos ahora con una conversación general.", "Nuestra tarea final es una conversación general... empecemos."],
          encouraging: ["¡Última parte! Charlemos un poco sobre tu tema.", "¡Casi terminamos! Hablemos un poco sobre tu vida e intereses."],
          strict: ["Fase de conversación general. Responde a las preguntas.", "Tarea final: Conversación general."]
        }
      },
      fr: {
        READ_ALOUD: {
          formal: ["Bien. Vous pouvez maintenant commencer votre lecture du passage.", "Veuillez lire le texte fourni à haute voix, quand vous serez prêt.", "J'aimerais que vous me lisiez ce passage... commencez quand vous serez prêt."],
          encouraging: ["D'accord... quand vous serez prêt, veuillez me lire ce passage.", "Bien. Maintenant, veuillez lire ce texte à haute voix."],
          strict: ["Commencez la lecture du passage maintenant.", "Lisez le passage exactement comme il est écrit."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["Merci. Je vais maintenant vous poser quelques questions basées sur ce texte.", "Écoutez maintenant ces questions complémentaires."],
          encouraging: ["Bien joué. J'ai quelques questions sur ce que vous venez de lire... ça vous convient ?", "C'était bien. Maintenant, parlons un peu du texte."],
          strict: ["Répondez aux questions suivantes basées sur le texte.", "Je vais maintenant poser les questions complémentaires."]
        },
        ROLEPLAY: {
          formal: ["Bien. Nous allons maintenant passer à l'épreuve du jeu de rôle.", "Veuillez examiner le scénario... Bien. Nous commençons le jeu de rôle maintenant."],
          encouraging: ["Essayons un jeu de rôle maintenant. Imaginez que vous êtes dans cette situation.", "Imaginez que nous sommes ensemble dans ce scénario."],
          strict: ["Épreuve 2 : Jeu de rôle. Lisez le scénario et répondez en conséquence.", "Début de l'épreuve du jeu de rôle maintenant."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["Maintenant, veuillez sélectionner la photo que vous avez choisie pour la discussion.", "Quelle photo souhaiteriez-vous discuter aujourd'hui ?"],
          encouraging: ["D'accord... de laquelle de ces images souhaiteriez-vous parler ?", "Choisissez la photo avec laquelle vous vous sentez le plus à l'aise."],
          strict: ["Sélectionnez votre photo maintenant.", "Choisissez une photo pour continuer."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["Décrivez la photo du mieux que vous pouvez.", "Dites-moi ce que vous voyez sur la photo avec autant de détails que possible."],
          encouraging: ["Alors, dites-moi... que voyez-vous sur cette photo ?", "Décrivez simplement l'image pour moi, avec vos propres mots."],
          strict: ["Décrivez la photo.", "Mission d'observation : Décrivez l'image."]
        },
        FREE_CONVERSATION: {
          formal: ["Nous allons maintenant terminer par une conversation générale.", "Notre dernière épreuve est une conversation générale... commençons."],
          encouraging: ["Dernière partie ! Discutons un peu de votre thème.", "On y est presque ! Parlons un peu de votre vie et de vos centres d'intérêt."],
          strict: ["Phase de conversation générale. Répondez aux questions.", "Dernière épreuve : Conversation générale."]
        }
      },
      de: {
        READ_ALOUD: {
          formal: ["Gut. Sie können nun mit dem Lesen des Textes beginnen.", "Bitte lesen Sie den bereitgestellten Text laut vor, wenn Sie bereit sind."],
          encouraging: ["Okay, wenn du bereit bist, lies bitte diesen Text vor.", "Gut. Jetzt lies bitte diesen Text laut vor."],
          strict: ["Beginnen Sie jetzt mit dem Lesen des Textes.", "Lesen Sie den Text genau so vor, wie er dort steht."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["Danke. Ich werde Ihnen nun einige Fragen zu diesem Text stellen.", "Hören Sie sich nun diese Anschlussfragen an."],
          encouraging: ["Gut gemacht. Ich habe ein paar Fragen zu dem, was du gerade gelesen hast.", "Das war gut. Lass uns kurz über den Text sprechen."],
          strict: ["Beantworten Sie die folgenden Fragen zum Text.", "Ich werde nun die Anschlussfragen stellen."]
        },
        ROLEPLAY: {
          formal: ["Gut. Wir fahren nun mit dem Rollenspiel fort.", "Bitte sehen Sie sich das Szenario an. Wir beginnen jetzt."],
          encouraging: ["Lass uns jetzt ein Rollenspiel versuchen. Stell dir vor, du bist in dieser Situation.", "Stell dir vor, wir sind zusammen in diesem Szenario."],
          strict: ["Aufgabe 2: Rollenspiel. Lesen Sie das Szenario und antworten Sie entsprechend.", "Wir beginnen jetzt mit dem Rollenspiel."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["Wählen Sie nun bitte Ihre Fotokarte für das Gespräch aus.", "Welche Fotokarte möchten Sie heute besprechen?"],
          encouraging: ["Okay, welches dieser Bilder möchtest du besprechen?", "Wähle das Foto aus, mit dem du dich am wohlsten fühlst."],
          strict: ["Wählen Sie jetzt Ihre Fotokarte aus.", "Wählen Sie eine Karte aus, um fortzufahren."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["Beschreiben Sie das Foto so gut wie möglich.", "Sagen Sie mir so detailliert wie möglich, was Sie auf dem Foto sehen."],
          encouraging: ["Erzähl mir, was du auf diesem Foto sehen kannst.", "Beschreibe mir das Bild einfach mit deinen eigenen Worten."],
          strict: ["Beschreiben Sie das Foto.", "Beschreiben Sie das Bild."]
        },
        FREE_CONVERSATION: {
          formal: ["Wir schließen nun mit einem allgemeinen Gespräch ab.", "Unsere letzte Aufgabe ist ein allgemeines Gespräch."],
          encouraging: ["Der letzte Teil jetzt! Lass uns einfach ein bisschen über dein Thema plaudern.", "Fast geschafft! Lass uns ein bisschen über dein Leben und deine Interessen sprechen."],
          strict: ["Phase des allgemeinen Gesprächs. Beantworten Sie die Fragen.", "Letzte Aufgabe: Allgemeines Gespräch."]
        }
      },
      ar: {
        READ_ALOUD: {
          formal: ["حسناً. يمكنك الآن البدء في قراءة النص.", "يرجى قراءة النص المقدم بصوت عالٍ عندما تكون مستعداً."],
          encouraging: ["حسناً، عندما تكون مستعداً، يرجى قراءة هذا النص لي.", "جيد. الآن، يرجى قراءة هذا النص بصوت عالٍ."],
          strict: ["ابدأ قراءة النص الآن.", "اقرأ النص تماماً كما هو مكتوب."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["شكراً لك. سأطرح عليك الآن بعض الأسئلة بناءً على هذا النص.", "الآن، استمع إلى أسئلة المتابعة هذه."],
          encouraging: ["أحسنت. لدي بعض الأسئلة عما قرأته للتو... إذا كان ذلك مناسباً؟", "كان ذلك جيداً. الآن، دعنا نتحدث عن النص للحظة."],
          strict: ["أجب عن الأسئلة التالية بناءً على النص.", "سأطرح الآن أسئلة المتابعة."]
        },
        ROLEPLAY: {
          formal: ["حسناً. سننتقل الآن إلى مهمة تمثيل الأدوار.", "يرجى مراجعة السيناريو... سنبدأ تمثيل الأدوار الآن."],
          encouraging: ["لنحاول تمثيل الأدوار الآن. تخيل أنك في هذا الموقف.", "تخيل أننا في هذا السيناريو معاً."],
          strict: ["المهمة 2: تمثيل الأدوار. اقرأ السيناريو واستجب وفقاً لذلك.", "بدء مهمة تمثيل الأدوار الآن."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["الآن، يرجى تحديد بطاقة الصور التي اخترتها للمناقشة.", "أي بطاقة صور تود مناقشتها اليوم؟"],
          encouraging: ["حسناً، أي من هذه الصور تود التحدث عنه؟", "اختر الصورة التي تشعر براحة أكبر معها."],
          strict: ["حدد بطاقة الصور الخاصة بك الآن.", "اختر بطاقة للمتابعة."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["صف الصورة بأفضل ما يمكنك.", "أخبرني بما تراه في الصورة بأكبر قدر ممكن من التفاصيل."],
          encouraging: ["لذا، أخبرني... ماذا ترى في هذه الصورة؟", "فقط صف الصورة لي بكلماتك الخاصة."],
          strict: ["صف الصورة.", "صف محتويات الصورة."]
        },
        FREE_CONVERSATION: {
          formal: ["سنختتم الآن بمحادثة عامة.", "مهمتنا الأخيرة هي محادثثة عامة... فلنبدأ."],
          encouraging: ["الجزء الأخير الآن! دعنا نتحدث قليلاً عن موضوعك.", "لقد اقتربنا من النهاية! فلنتحدث عن حياتك واهتماماتك قليلاً."],
          strict: ["مرحلة المحادثة العامة. أجب عن الأسئلة.", "المهمة الأخيرة: محادثة عامة."]
        }
      },
      he: {
        READ_ALOUD: {
          formal: ["בסדר. אתה יכול כעת להתחיל לקרוא את הקטע.", "אנא קרא את הטקסט המצורף בקול כשאהיה מוכן."],
          encouraging: ["אוקיי, כשאתה מוכן, אנא קרא את הקטע הזה בשבילי.", "טוב. כעת, אנא קרא את הטקסט הזה בקול."],
          strict: ["התחל לקרוא את הקטע כעת.", "קרא את הקטע בדיוק כפי שהוא כתוב."]
        },
        READ_ALOUD_FOLLOWUPS: {
          formal: ["תודה. כעת אשאל אותך כמה שאלות המבוססות על הטקסט הזה.", "כעת, הקשב לשאלות המשך אלו."],
          encouraging: ["כל הכבוד. יש לי כמה שאלות על מה שקראת הרגע.", "זה היה טוב. כעת, בוא נדבר על הטקסט לרגע."],
          strict: ["ענה על השאלות הבאות בהתבסס על הטקסט.", "כעת אציג את שאלות ההמשך."]
        },
        ROLEPLAY: {
          formal: ["בסדר. כעת נעבור למשימת משחק התפקידים.", "אנא סקור את התרחיש. נתחיל את משחק התפקידים כעת."],
          encouraging: ["בוא ננסה משחק תפקידים כעת. דמיין שאתה בסיטואציה הזו.", "דמיין שאנחנו יחד בתרחיש הזה."],
          strict: ["משימה 2: משחק תפקידים. קרא את התרחיש והגב בהתאם.", "מתחילים את משימת משחק התפקידים כעת."]
        },
        PHOTO_CARD_CHOICE: {
          formal: ["כעת, בחר בבקשה את כרטיס התמונה שבחרת לדיון.", "באיזה כרטיס תמונה תרצה לדון היום?"],
          encouraging: ["אוקיי, באיזו מהתמונות האלו תרצה לדבר?", "בחר את התמונה שאתה מרגיש איתה הכי בנוח."],
          strict: ["בחר את כרטיס התמונה שלך כעת.", "בחר כרטיס כדי להמשיך."]
        },
        PHOTO_CARD_FOLLOWUPS: {
          formal: ["תאר את התמונה כמיטב יכולתך.", "ספר לי מה אתה רואה בתמונה בפירוט רב ככל האפשר."],
          encouraging: ["אז ספר לי, מה אתה רואה בתמונה הזו?", "פשוט תאר לי את התמונה במילים שלך."],
          strict: ["תאר את התמונה.", "תאר את מה שמופיע בתמונה."]
        },
        FREE_CONVERSATION: {
          formal: ["כעת נסיים בשיחה כללית.", "המשימה האחרונה שלנו היא שיחה כללית... בוא נתחיל."],
          encouraging: ["חלק אחרון כעת! בוא נשוחח קצת על הנושא שלך.", "כמעט שם! בוא נדבר קצת על החיים והתחומי עניין שלך."],
          strict: ["שלב השיחה הכללית. ענה על השאלות.", "משימה אחרונה: שיחה כללית."]
        }
      }
    };

    let targetInstructions = allInstructions.en;
    if (lang === 'spanish') targetInstructions = allInstructions.es;
    else if (lang === 'french') targetInstructions = allInstructions.fr;
    else if (lang === 'german') targetInstructions = allInstructions.de;
    else if (lang === 'arabic') targetInstructions = allInstructions.ar;
    else if (lang === 'modern hebrew' || lang === 'hebrew') targetInstructions = allInstructions.he;

    const options = targetInstructions[taskId]?.[tone] || allInstructions.en[taskId]?.[tone] || ["Please proceed with the task."];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getTTSOptions = (onEnd?: () => void) => {
    if (!session) return { onEnd };
    const pacingCfg = EXAM_RULES.SPEAKING.PACING_MODES[session.profile.pacing.toUpperCase() as keyof typeof EXAM_RULES.SPEAKING.PACING_MODES] || EXAM_RULES.SPEAKING.PACING_MODES.STANDARD;
    const rate = pacingCfg.rate;
    const pitch = session.profile.examinerTone === 'strict' ? 0.85 : session.profile.examinerTone === 'encouraging' ? 1.1 : 1.0;
    
    // Dynamically retrieve the preferred voice for the current language
    const langKeyMap: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'arabic': 'ar',
      'modern hebrew': 'he',
      'hebrew': 'he'
    };
    const langKey = langKeyMap[schema.language.toLowerCase()] || 'en';
    const preferredVoiceName = preferredVoices[langKey];
    const cloudVoiceName = cloudVoices[langKey];

    return { rate, pitch, onEnd, preferredVoiceName, useCloud: useCloudVoices, cloudVoiceName };
  };

  const handleRevealQuestion = (questionId: string, text: string) => {
    if (revealedFollowUps.has(questionId)) {
      // Re-play if already revealed
      TTSService.speak(text, schema.language, getTTSOptions());
      return;
    }
    
    // Unpredictable examiner timing: 0.5s to 2.5s delay based on session pacing
    const baseWait = session?.profile.pacing === 'fast' ? 400 : session?.profile.pacing === 'deliberate' ? 1800 : 1000;
    const randomFuzz = Math.random() * 1000;
    
    setRevealingIds(prev => new Set(prev).add(questionId));

    setTimeout(() => {
      setRevealingIds(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
      setRevealedFollowUps(prev => {
        const next = new Set(prev);
        next.add(questionId);
        return next;
      });

      TTSService.speak(text, schema.language, getTTSOptions());
      
      logEvent({
        type: 'FOLLOWUP_REVEALED',
        taskId: SPEAKING_FLOW[currentStepIndex],
        questions: [questionId]
      });
    }, baseWait + randomFuzz);
  }

  // --- PHOTO CARD IMAGE LOADER ---
  const PhotoCardImage: React.FC<{ 
    imageUrl?: string; 
    secondaryImageUrl?: string;
    themeId: string; 
    id: string; 
    className?: string 
  }> = ({ imageUrl, secondaryImageUrl, themeId, id, className }) => {
    const [status, setStatus] = useState<'primary' | 'secondary' | 'svg'>('primary');

    const handlePrimaryError = () => {
      console.warn(`Primary image failed for task ${id}, attempting secondary...`);
      if (secondaryImageUrl) {
        setStatus('secondary');
      } else {
        setStatus('svg');
      }
    };

    const handleSecondaryError = () => {
      console.warn(`Secondary image failed for task ${id}, falling back to SVG.`);
      setStatus('svg');
    };

    if (status === 'svg' || (!imageUrl && !secondaryImageUrl)) {
      return (
        <div className={className}>
          <ThemeVisual themeId={themeId} className="w-full h-full" />
        </div>
      );
    }

    if (status === 'secondary' && secondaryImageUrl) {
      return (
        <img
          src={secondaryImageUrl}
          onError={handleSecondaryError}
          className={`${className} object-cover bg-slate-100 shadow-inner`}
          alt="GCSE Exam Context (Secondary)"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <img
        src={imageUrl}
        onError={handlePrimaryError}
        className={`${className} object-cover bg-slate-100 shadow-inner`}
        alt="GCSE Exam Context"
        referrerPolicy="no-referrer"
      />
    );
  };

  // --- RENDERING ---

  if (limitReached) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-2xl border-4 border-slate-950 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">Revision Boundary Reached</h2>
        <p className="text-slate-500 font-bold mb-8 leading-relaxed max-w-sm">
          Daily revision guidance helps maintain <span className="text-indigo-600">academic balance</span>. To unlock unlimited practice and deep grade analysis, select a revision pathway.
        </p>
        <div className="w-full space-y-4">
          <button 
            onClick={() => {
              SubscriptionService.activatePremium();
              setLimitReached(false);
              window.location.reload();
            }}
            className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all"
          >
            Premium: Grade 7-9 Results
          </button>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
        >
          Return to Revision Dashboard
        </button>
      </div>
    );
  }

  if (!session || session.examState === "setup") {
    const languageLower = schema.language.toLowerCase();
    const setupLabels: Record<string, { title: string, themeLabel: string }> = {
      spanish: { title: 'Configuración del Examen', themeLabel: 'Seleccionar Tema' },
      french: { title: 'Configuration de l\'Examen', themeLabel: 'Choisir un Thème' },
      german: { title: 'Prüfungssetup', themeLabel: 'Thema Auswählen' },
      arabic: { title: 'إعداد الامتحان', themeLabel: 'اختر الموضوع' },
      hebrew: { title: 'הגדרת בחינה', themeLabel: 'בחר נושא' },
      'modern hebrew': { title: 'הגדרת בחינה', themeLabel: 'בחר נושא' }
    };

    const currentLabels = setupLabels[languageLower] || { title: `Exam Setup: ${schema.board} ${schema.language}`, themeLabel: 'Select Theme' };

    return (
      <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          {currentLabels.title}
        </h2>

        {setupError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 font-bold text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {setupError}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {currentLabels.themeLabel}
          </label>
          <div className="space-y-2">
            {currentThemes.map((t) => (
              <label
                key={t.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${selectedThemeId === t.id ? "border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary/10" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={t.id}
                  checked={selectedThemeId === t.id}
                  onChange={(e) => setSelectedThemeId(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium text-slate-900 dark:text-white">{t.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-6 rounded-full transition-colors relative ${extraTime ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${extraTime ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Extra Time: {extraTime ? "Enabled (25%)" : "Disabled"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extra time can ONLY be adjusted in your <span className="font-bold text-indigo-600 dark:text-indigo-400">User Settings</span>.
          </p>
        </div>

        <button
          onClick={handleStartPrep}
          disabled={!selectedThemeId || isResolving}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition flex items-center justify-center gap-3"
        >
          {isResolving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Preparing Exam Content...
            </>
          ) : (
            `Start ${extraTime ? 15 : 12}-Minute Preparation`
          )}
        </button>
      </div>
    );
  }

  if (session.examState === "prep") {
    const formatTime = (secs: number) =>
      `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;

    return (
      <div className="max-w-5xl mx-auto mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] border border-slate-200 dark:border-slate-800">
        <header className="p-4 bg-amber-500 text-amber-950 flex justify-between items-center">
          <h2 className="font-bold text-lg">
            Preparation Phase (Visible Content Only)
          </h2>
          <div className="font-mono text-2xl font-bold bg-white/20 px-4 py-1 rounded-lg tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-600 dark:text-slate-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800/50 rounded-xl">
            You may review the tasks below. Follow-up questions and Conversation
            sections are hidden during this phase.
          </p>

          {session.resolvedTasks
            .filter((task) => ["read_aloud", "roleplay", "photo_card"].includes(task.type))
            .map((task) => {
              return (
                <div
                  key={task.sectionId}
                  className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                    {task.title}
                  </h3>

                  {task.type === "read_aloud" && (
                    <div className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                      {(task.content as any)?.passageText || "Loading passage..."}
                    </div>
                  )}

                  {task.type === "roleplay" && (
                    <div className="space-y-4">
                      <p className="font-bold text-indigo-700 dark:text-indigo-400">
                        Scenario: {(task.content as any)?.scenarioPrompt}
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                        {(task.content as any)?.prompts.map((p: any) => (
                          <li key={p.id}>
                            {p.text}
                            {p.isUnpredictable && (
                              <span className="ml-2 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                !
                              </span>
                            )}
                            {p.isQuestionToExaminer && (
                              <span className="ml-2 text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                ?
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.type === "photo_card" && task.options && (
                    <div>
                      <p className="mb-4 text-emerald-600 dark:text-emerald-400 font-bold">
                        Choose ONE Photo Card to focus on:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {task.options.map((pc: any) => (
                          <label
                            key={pc.id}
                            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${session.selectedPhotoCardId === pc.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-md" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}
                          >
                            <input
                              type="radio"
                              className="hidden"
                              checked={session.selectedPhotoCardId === pc.id}
                              onChange={() => handlePhotoCardChoice(pc.id)}
                            />
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                {uiLabels.option}
                              </span>
                              {session.selectedPhotoCardId === pc.id && (
                                <svg
                                  className="w-5 h-5 text-emerald-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <PhotoCardImage 
                              imageUrl={pc.imageUrl} 
                              secondaryImageUrl={pc.secondaryImageUrl}
                              themeId={pc.themeId} 
                              id={pc.id} 
                              className="w-full h-40 rounded-lg mb-4" 
                            />
                            <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                              {pc.studentPrompts.map(
                                (pt: string, i: number) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-emerald-500">•</span>{" "}
                                    {pt}
                                  </li>
                                ),
                              )}
                            </ul>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
          <button
            onClick={startExamExecution}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
          >
            {uiLabels.endPrep}
          </button>
        </footer>
      </div>
    );
  }

  if (session.examState === "exam") {
    const currentStepName = SPEAKING_FLOW[currentStepIndex];
    const currentSection = getTaskForStep(currentStepName, session.resolvedTasks);
    if (!currentSection) {
      return (
        <div className="max-w-4xl mx-auto mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center h-[75vh] border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-medium text-slate-500">{uiLabels.loading}</div>
        </div>
      );
    }
    
    const formatTime = (secs: number) =>
      `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;

    let examData = currentSection.content;

    // For photo card, we filter options down to JUST the chosen card in the session
    if (currentSection.type === "photo_card" && currentSection.options) {
      examData = currentSection.options.find((c) => c.id === session.selectedPhotoCardId) || examData;
    }

    return (
      <div className="max-w-4xl mx-auto mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh] border border-slate-200 dark:border-slate-800 relative text-slate-900 dark:text-white">
        {/* PACING BAR */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 z-[60]">
             <motion.div 
               initial={{ width: '0%' }}
               animate={{ width: `${((currentStepIndex + 1) / SPEAKING_FLOW.length) * 100}%` }}
               className={`h-full transition-all duration-1000 ${
                  currentStepIndex < 2 ? 'bg-emerald-500' :
                  currentStepIndex < 4 ? 'bg-amber-500' :
                  'bg-rose-600'
               }`}
             />
        </div>

        <header className="p-4 bg-slate-950 text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black">
                {schema.board.charAt(0)}
             </div>
             <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {uiLabels.candidate}: {crypto.randomUUID().slice(0, 8).toUpperCase()}
                </div>
                <h2 className="font-bold text-lg leading-tight uppercase tracking-tight">
                  GCSE {schema.language} Speaking
                </h2>
             </div>
          </div>
          <div className="flex items-center gap-4">
            {isRecording && (
               <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-red-400 uppercase">Live Recording</span>
               </div>
            )}
            <div className="font-mono text-2xl font-bold bg-white/10 px-4 py-1 rounded-lg tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 px-6 py-2 flex items-center justify-between">
           <div className="text-[10px] font-black text-amber-900/50 dark:text-amber-400/50 uppercase tracking-[0.2em]">
             Official Exam Protocol
           </div>
           <div className="flex items-center gap-4">
             {environment !== 'EXAM' && (
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">
                 Examiner Style: {session.profile.examinerTone} ({session.profile.pacing})
               </div>
             )}
             <div className="text-[10px] font-black text-amber-900/50 dark:text-amber-400/50 uppercase tracking-[0.2em]">
               Current Task: {currentStepName.replace(/_/g, " ")}
             </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50 dark:bg-slate-950 relative">
           {isTransitioning && (
             <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-16 h-1 bg-indigo-600 rounded-full animate-all duration-1000 scale-x-150 opacity-0 animate-pulse"></div>
                <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.3em] text-slate-400">Loading next task...</p>
             </div>
           )}

           {/* Examiner Instruction Banner */}
           <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-l-4 border-l-indigo-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 mb-1 tracking-widest">Examiner Instruction</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {getExaminerInstruction(currentStepName)}
                </p>
              </div>
           </div>
           {/* Authenticity Warning */}
           <div className="mb-8 p-4 border-l-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-r-xl shadow-sm text-xs font-bold text-slate-500">
             <span className="uppercase text-slate-900 dark:text-white mr-2 tracking-widest">Notice to Candidates:</span>
             All spoken responses must be in {schema.language}. You must not speak in English unless requested by the task.
           </div>

          {currentStepName === "READ_ALOUD" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 font-serif text-2xl leading-relaxed mb-8">
                {(examData as any)?.passageText}
              </div>
            </div>
          )}

          {currentStepName === "READ_ALOUD_FOLLOWUPS" && (
            <div className="max-w-3xl mx-auto space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Listen and respond to the questions
              </h4>
              <p className="text-slate-500 text-sm mb-4">Questions are no longer displayed as text.</p>
              {(examData as any)?.followUpQuestions?.map(
                (q: any, i: number) => {
                  return (
                    <div
                      key={q.id}
                      className="p-4 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-800 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between"
                    >
                      <span className="font-bold mr-3">Question {i + 1}</span>
                      <button 
                        onClick={() => handleRevealQuestion(q.id, q.questionText)} 
                        disabled={revealingIds.has(q.id)}
                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-md shadow-sm border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 flex items-center gap-2 disabled:opacity-50"
                      >
                        {revealingIds.has(q.id) ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play Question
                          </>
                        )}
                      </button>
                    </div>
                  )
                }
              )}
            </div>
          )}

          {currentStepName === "ROLEPLAY" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex flex-col items-center text-center">
                <p className="font-bold text-amber-900 dark:text-amber-100 text-lg mb-2">
                  {(examData as any)?.scenarioPrompt}
                </p>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Your Role:{" "}
                  <span className="font-bold">
                    {(examData as any)?.studentRole}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                {(examData as any)?.prompts.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4 relative overflow-hidden"
                  >
                    <div
                      className={`w-1 h-full absolute left-0 top-0 ${p.isUnpredictable ? "bg-red-500" : p.isQuestionToExaminer ? "bg-indigo-500" : "bg-slate-300"}`}
                    ></div>
                    <div className="font-medium text-lg pl-2">{p.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {currentStepName === "PHOTO_CARD_CHOICE" && (
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 items-start">
              <PhotoCardImage 
                imageUrl={(examData as any)?.imageUrl} 
                secondaryImageUrl={(examData as any)?.secondaryImageUrl}
                themeId={(examData as any)?.themeId} 
                id={(examData as any)?.id} 
                className="w-full aspect-[4/3] rounded-2xl shadow-md" 
              />

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm mb-4">
                  {uiLabels.examinerView}
                </h4>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-emerald-600 mb-1">
                    {uiLabels.visibleDuringPrep}
                  </p>
                  {(examData as any)?.studentPrompts.map(
                    (p: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {p}
                      </div>
                    ),
                  )}
                  
                  <div className="h-4"></div>
                  <p className="text-xs font-bold text-red-600 mb-1">
                    {uiLabels.examinerQuestionsNext}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStepName === "PHOTO_CARD_FOLLOWUPS" && (
             <div className="max-w-3xl mx-auto space-y-4">
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm mb-4">
                   {uiLabels.listenAndRespond}
                 </h4>
                 <p className="text-slate-500 text-sm mb-4">{uiLabels.unseenElements}</p>
                  {(examData as any)?.examinerPrompts.map((p: string, i: number) => {
                    const qId = `pc_prompt_${i}`;
                    return (
                      <div
                        key={qId}
                        className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center justify-between"
                      >
                        <span className="font-bold text-red-800 dark:text-red-300 mr-3 inline-flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded mr-2 inline-block">
                             {uiLabels.unseen} 
                           </span>
                           {uiLabels.prompt} {i + 1}
                        </span>
                        <button 
                          onClick={() => handleRevealQuestion(qId, p)} 
                          disabled={revealingIds.has(qId)}
                          className="text-sm font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-md shadow-sm border border-red-200 dark:border-red-800 hover:bg-red-100 flex items-center gap-2 disabled:opacity-50"
                        >
                          {revealingIds.has(qId) ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              {uiLabels.playing}
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              {uiLabels.playQuestion}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                  {(examData as any)?.followUpQuestions?.map((q: any, i: number) => {
                    return (
                      <div
                        key={q.id}
                        className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex justify-between items-center"
                      >
                        <span className="font-bold text-indigo-800 dark:text-indigo-300 mr-3 inline-flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded mr-2 inline-block">
                            {uiLabels.followUp}
                          </span>
                          {uiLabels.question} {i + 1}
                        </span>
                        <button 
                          onClick={() => handleRevealQuestion(q.id, q.questionText)} 
                          disabled={revealingIds.has(q.id)}
                          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-md shadow-sm border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-2 disabled:opacity-50"
                        >
                          {revealingIds.has(q.id) ? (
                             <>
                               <RefreshCw className="w-4 h-4 animate-spin" />
                               {uiLabels.thinking}
                             </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              {uiLabels.playQuestion}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
          </div>
          )}

          {currentStepName === "FREE_CONVERSATION" && (
            <div className="max-w-2xl mx-auto py-8">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-center mb-2">
                {uiLabels.selectedThemeQuestions}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-center font-medium mb-12">
                {uiLabels.unseenElements}
              </p>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h4 className="font-bold uppercase text-indigo-600 mb-4 text-sm tracking-widest">
                  {uiLabels.questionBankLoaded}
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-3">
                      Selected Theme Questions ({examData?.linked?.length || 0})
                    </p>
                    <div className="space-y-2 pl-2">
                      {examData?.linked?.map((q: any, i: number) => {
                        return (
                          <div key={q.id} className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg text-indigo-800 dark:text-indigo-300 text-sm flex justify-between items-center">
                            <span className="font-bold">Theme Q{i+1}</span>
                            <button onClick={() => handleRevealQuestion(q.id, q.questionText)} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                               Play
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-3">
                      Surprise Theme Questions ({examData?.random?.length || 0})
                    </p>
                    <div className="space-y-2 pl-2">
                      {examData?.random?.map((q: any, i: number) => {
                        return (
                          <div key={q.id} className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg text-indigo-800 dark:text-indigo-300 text-sm flex justify-between items-center">
                            <span className="font-bold">Surprise Q{i+1}</span>
                            <button onClick={() => handleRevealQuestion(q.id, q.questionText)} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                               Play
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between bg-white dark:bg-slate-900 items-center">
          <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            {currentStepIndex + 1} / {SPEAKING_FLOW.length}
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleRecording}
              className={`px-6 py-3 font-bold rounded-xl transition flex items-center gap-2 ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <svg
                className={`w-5 h-5 ${!isRecording && "text-red-500"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              {isRecording ? uiLabels.stopRecording : uiLabels.startRecording}
            </button>

            <button
              onClick={handleNextSection}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              {currentStepIndex === SPEAKING_FLOW.length - 1
                ? uiLabels.finishExam
                : uiLabels.nextSection}
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
        {uiLabels.examCompleted}
      </h2>
      <p className="text-slate-500 font-medium mb-8">
        {uiLabels.awaitingReview}
      </p>

      <button
        onClick={() => setSession(null)}
        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
      >
        {uiLabels.startAnother}
      </button>
    </div>
  );
};
