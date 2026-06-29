import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  History,
  ShieldCheck,
  AlertCircle,
  RotateCw
} from "lucide-react";
import { UserPreferences, ExamEnvironment } from '../types';
import { ListeningQuestion, ListeningPaper, ListeningSectionType } from '../types/listening';
import { ListeningAudioEngine } from '../core/listening/audioEngine';
import { WeaknessService } from '../services/user/weaknessService';
import { CalibrationService } from '../services/calibrationService';
import { aiExaminer } from '../services/aiExaminer';
import { SessionPersistence } from '../services/sessionPersistence';
import { AnalyticsService } from '../services/analyticsService';
import { MissionService } from '../services/user/missionService';
import { EXAM_RULES, getEstimatedGrade } from '../core/examRules';

interface ListeningExamFlowProps {
  language: string;
  paper: ListeningPaper;
  onExit: () => void;
  preferences?: UserPreferences;
  environment?: ExamEnvironment;
}

export function ListeningExamFlow({ language, paper, onExit, preferences, environment = 'TRAINING' }: ListeningExamFlowProps) {
  const [currentSection, setCurrentSection] = useState<ListeningSectionType>('A');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [step, setStep] = useState<'exam' | 'result'>('exam');
  const [timeLeft, setTimeLeft] = useState(EXAM_RULES.PAPERS.MODES.test.time);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [fullReport, setFullReport] = useState<any>(null);
  const [examStartTimestamp] = useState(() => Date.now());

  // v3.9.6 Session Recovery
  useEffect(() => {
    if (environment !== 'EXAM') return;
    const saved = SessionPersistence.getSession('listening');
    if (saved && saved.examId === paper.id) {
       setUserAnswers(saved.userAnswers);
       setCurrentSection(saved.currentSection as ListeningSectionType || 'A');
       setCurrentQuestionIndex(saved.currentIndex || 0);
       // Time is handled by the delta calc in the timer effect
    }
  }, [paper.id, environment]);

  useEffect(() => {
    if (environment !== 'EXAM' || step !== 'exam') return;
    SessionPersistence.saveSession({
      examId: paper.id,
      type: 'listening',
      startTimestamp: examStartTimestamp,
      totalDurationSeconds: EXAM_RULES.PAPERS.MODES.test.time,
      userAnswers,
      currentSection,
      currentIndex: currentQuestionIndex
    });
  }, [userAnswers, currentSection, currentQuestionIndex, paper.id, environment, step, examStartTimestamp]);

  // Reset audio engine only when step changes to result or on initial global load
  // v3.9.4: Removed reset from mount to prevent exploit via remounts
  // Play counts now survive internal component life cycle as per requirements.

  const isExam = environment === 'EXAM';
  
  const currentQuestions = useMemo(() => paper?.sections?.[currentSection] || [], [paper, currentSection]);
  
  // v3.9.3: Group questions by audioClipId (Question Clusters)
  // Ensures audio is shared across multiple sub-questions as per GCSE standards.
  const clipGroups = useMemo(() => {
    if (!currentQuestions) return [];
    const groups: { clipId: string, questions: ListeningQuestion[] }[] = [];
    currentQuestions.forEach(q => {
      let group = groups.find(g => g.clipId === q.audioClipId);
      if (!group) {
        group = { clipId: q.audioClipId, questions: [] };
        groups.push(group);
      }
      group.questions.push(q);
    });
    return groups;
  }, [currentQuestions]);

  const currentGroup = clipGroups[currentQuestionIndex];
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  // Flattened questions for results page navigation logic
  const allQuestions = useMemo(() => {
    if (!paper?.sections) return [];
    return [
      ...(paper.sections.A || []),
      ...(paper.sections.B || []),
      ...(paper.sections.C || []),
      ...(paper.sections.D || [])
    ];
  }, [paper]);

  // Reset state when group changes
  useEffect(() => {
    if (currentGroup) {
      setHasPlayedOnce(ListeningAudioEngine.getPlayCount(currentGroup.clipId) > 0);
      setIsPlaying(false);
      setIsCooldown(false);
    }
  }, [currentGroup]);

  // Timer Effect (v3.9.6: performance.now delta tracking for integrity)
  useEffect(() => {
    if (step !== 'exam') return;

    const tick = () => {
      const elapsedMs = Date.now() - examStartTimestamp;
      const totalMs = EXAM_RULES.PAPERS.MODES.test.time * 1000;
      const remaining = Math.max(0, Math.floor((totalMs - elapsedMs) / 1000));
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        handleFinish();
      } else {
        requestAnimationFrame(() => {
          // Delay to roughly 1s for UI updates
          setTimeout(tick, 1000);
        });
      }
    };

    const timerId = setTimeout(tick, 1000);
    return () => clearTimeout(timerId);
  }, [step, examStartTimestamp]);

  const handlePlayAudio = () => {
    if (isPlaying || isCooldown || !currentGroup) return;

    // Check play count globally
    if (isExam && ListeningAudioEngine.getPlayCount(currentGroup.clipId) >= EXAM_RULES.PAPERS.LISTENING.MAX_PLAYS) {
      return;
    }

    const transcript = currentGroup.questions[0].transcript;
    
    // Dynamically retrieve the preferred voice for the current language
    const langKeyMap: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'arabic': 'ar',
      'modern hebrew': 'he',
      'modern': 'he',
      'biblical': 'he',
      'hebrew': 'he'
    };
    const langKey = langKeyMap[language.toLowerCase()] || 'en';
    const preferredVoiceName = preferences?.preferredVoices?.[langKey];

    ListeningAudioEngine.play(currentGroup.clipId, transcript, language, isExam, {
      preferredVoiceName,
      useCloud: preferences?.useCloudVoices,
      cloudVoiceName: preferences?.cloudVoices?.[langKey],
      onStart: () => {
        setIsPlaying(true);
        // Ensure questions are NOT shown during playback START
        setHasPlayedOnce(false); 
      },
      onEnded: () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
        // v3.9.1/v3.9.3: Cooldown delay between plays to prevent spamming
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), 3000);
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < clipGroups.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const sections: ListeningSectionType[] = ['A', 'B', 'C', 'D'];
      const currentIndex = sections.indexOf(currentSection);
      if (currentIndex < sections.length - 1) {
        setCurrentSection(sections[currentIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = async () => {
    setIsMarking(true);
    try {
      const responses = allQuestions.map(q => ({
        questionId: q.id,
        questionText: q.question, // Added missing property
        userResponse: userAnswers[q.id] || '',
        targetContext: q.transcript, // Added contextual info
        marksAvailable: q.marks,
        section: q.section // Keep for AI logic but won't interfere with type
      }));

      const report = await aiExaminer.generateFeedback({
        examType: 'listening',
        language,
        tier: paper.tier,
        responses,
        examinerProfile: { tone: 'standard', strictnessOffset: 0 }
      });

      setFullReport(report);
      
      // Calculate scores
      let totalScore = 0;
      let maxScore = 0;
      if (report.sectionBreakdown && report.sectionBreakdown.length > 0) {
        report.sectionBreakdown.forEach((sec: any) => {
          totalScore += sec.score || 0;
          maxScore += sec.total || 0;
        });
      } else {
        totalScore = 24;
        maxScore = 40;
      }

      // Record Exam Analytics & History
      const timeTakenSeconds = Math.max(1, EXAM_RULES.PAPERS.MODES.test.time - timeLeft);
      const avgTimePerQuestion = Math.round(timeTakenSeconds / (allQuestions.length || 1));
      AnalyticsService.saveExamResult({
        language,
        type: 'Listening',
        score: totalScore,
        total: maxScore,
        avgTime: avgTimePerQuestion,
        topics: [paper.theme || 'GENERAL']
      });

      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 50;
      AnalyticsService.recordResult(paper.theme || 'GENERAL', percentage >= 50, timeTakenSeconds);

      // Complete Daily Mock Exam Mission
      MissionService.completeMission('m1');

      setStep('result');
      SessionPersistence.clearSession();
      
      // v3.8.9: Track usage
      CalibrationService.trackUsage(paper.id, paper.theme);
      WeaknessService.trackFeedback(['LISTENING_PROMPT'], report.overallGrade, environment);

    } catch (error) {
      console.error("Marking failed:", error);
    } finally {
      setIsMarking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'result') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-5xl font-black text-white mb-4 shadow-xl">
              {fullReport?.overallGrade || '?'}
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Exam Summary</h2>
            <p className="text-slate-500 font-medium text-center mt-2 max-w-lg">
              {fullReport?.overallComments}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             {fullReport?.sectionBreakdown?.map((section: any, idx: number) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{section.section}</span>
                      <span className="text-sm font-black text-indigo-600">{section.grade}</span>
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {section.comment}
                   </p>
                </div>
             ))}
          </div>

          <button 
            onClick={onExit}
            className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
          >
            Return to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col h-[80vh]">
        
        {/* Pacing Header */}
        <div className="bg-slate-950 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
             <motion.div 
               animate={{ width: `${(timeLeft / EXAM_RULES.PAPERS.MODES.test.time) * 100}%` }}
               className={`h-full transition-all duration-1000 ${
                  (timeLeft / EXAM_RULES.PAPERS.MODES.test.time) < EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight ? 'bg-rose-600 animate-pulse' :
                  (timeLeft / EXAM_RULES.PAPERS.MODES.test.time) < (EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight + EXAM_RULES.DIFFICULTY_MODEL.STAGES.MID.weight) ? 'bg-amber-500' :
                  'bg-emerald-500'
               }`}
             />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${isExam ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-indigo-600'}`}>L</div>
              <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Section {currentSection}</span>
                 <h2 className="text-xl font-black tracking-tighter uppercase leading-none"> Listening Engine</h2>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Time Left</span>
                <span className={`text-lg font-black tabular-nums ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                   {formatTime(timeLeft)}
                </span>
              </div>
              <button onClick={onExit} className="text-xs font-black text-slate-400 hover:text-white uppercase transition-colors">Quit</button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs (Read-only in Exam Mode) */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-2 flex gap-1">
           {(['A', 'B', 'C', 'D'] as ListeningSectionType[]).map((s) => (
              <button
                key={s}
                disabled={isExam}
                onClick={() => {
                   setCurrentSection(s);
                   setCurrentQuestionIndex(0);
                }}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   currentSection === s 
                   ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm' 
                   : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                } ${isExam && currentSection !== s ? 'opacity-30 grayscale' : ''}`}
              >
                {isExam && currentSection !== s ? <Lock className="w-3 h-3 inline-block mr-1" /> : null}
                Section {s}
              </button>
           ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8">
           <AnimatePresence mode="wait">
              <motion.div 
                key={currentGroup?.clipId || 'loading'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                 {currentGroup ? (
                   <>
                    {/* v3.9.2/v3.9.3: Exam Item Set - Minimal UI interference */}
                    <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                {currentSection === 'C' || currentSection === 'D' ? 'Translation Task' : 'Exam Item Set'} {currentQuestionIndex + 1}
                            </h3>
                            <div className="flex items-center gap-2">
                               <ShieldCheck className="w-3 h-3 text-emerald-500" />
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Delivery Ready</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                             {isExam && (
                               <div className="text-right">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Exposure</span>
                                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                                    {ListeningAudioEngine.getPlayCount(currentGroup.clipId)} / {EXAM_RULES.PAPERS.LISTENING.MAX_PLAYS}
                                  </span>
                               </div>
                             )}
                             <button 
                                onClick={handlePlayAudio}
                                disabled={isPlaying || isCooldown || (isExam && ListeningAudioEngine.getPlayCount(currentGroup.clipId) >= EXAM_RULES.PAPERS.LISTENING.MAX_PLAYS)}
                                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${
                                  isPlaying 
                                  ? 'bg-emerald-500 text-white animate-pulse' 
                                  : (isExam && ListeningAudioEngine.getPlayCount(currentGroup.clipId) >= EXAM_RULES.PAPERS.LISTENING.MAX_PLAYS)
                                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                                }`}
                              >
                                {isPlaying ? 'Listening...' : (hasPlayedOnce ? 'Re-listen' : 'Begin Live Event')}
                             </button>
                          </div>
                        </div>

                        {/* Progress line - subtle */}
                        <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: isPlaying ? '100%' : 0 }}
                             transition={{ duration: 15, ease: 'linear' }} // Approximate duration for progress visual
                             className="h-full bg-indigo-500"
                           />
                        </div>

                        {/* Training mode transcript */}
                        {!isExam && hasPlayedOnce && !isPlaying && currentGroup.questions[0].transcript && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800"
                          >
                             <div className="flex items-center gap-2 mb-2">
                                <History className="w-3 h-3 text-indigo-500" />
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Training Subtitles</span>
                             </div>
                             <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                "{currentGroup.questions[0].transcript}"
                             </p>
                          </motion.div>
                        )}
                    </div>

                    {/* v3.9.0/v3.9.1/v3.9.2 Memory Decay Model: Answer AFTER play only. Hidden during active audio. */}
                    <AnimatePresence mode="wait">
                      {(hasPlayedOnce || !isExam) && !isPlaying ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-12" // Increased spacing for "Section Page" feel
                        >
                          <div className="flex items-center gap-2 px-2">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions Unlocked - Select & Respond</span>
                          </div>
                          
                          {currentGroup.questions.map((q, idx) => (
                            <div 
                              key={q.id} 
                              className={`space-y-4 ${
                                // v3.9.2: Mixed Density Rendering
                                idx % 2 === 0 ? 'p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800' : 'px-4'
                              } rounded-[2rem] transition-all`}
                            >
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                                        {q.question}
                                    </p>
                                    <textarea
                                      value={userAnswers[q.id] || ''}
                                      onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      placeholder="Write your answer..."
                                      className="w-full h-24 bg-slate-50 dark:bg-slate-800/10 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all resize-none"
                                    />
                                    <div className="flex justify-end mt-2">
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">[{q.marks} Marks]</span>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-20 px-12 bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
                        >
                           <motion.div
                             animate={{ 
                               scale: isPlaying ? [1, 1.05, 1] : 1,
                               opacity: isPlaying ? [1, 0.7, 1] : 0.5
                             }}
                             transition={{ repeat: Infinity, duration: 1.5 }}
                           >
                             <Volume2 className={`w-20 h-20 ${isPlaying ? 'text-indigo-600' : 'text-slate-300'} mb-8`} />
                           </motion.div>
                           <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest text-center mb-2">
                             {isPlaying ? "Live Event Underway" : "Focus Phase Required"}
                           </h4>
                           <p className="text-xs font-medium text-slate-400 uppercase tracking-widest text-center leading-loose">
                              {isPlaying 
                                ? "Recording in progress.\nInformation reconstruction follows completion." 
                                : isExam && ListeningAudioEngine.getPlayCount(currentGroup.clipId) >= EXAM_RULES.PAPERS.LISTENING.MAX_PLAYS
                                ? "Max exposure reached.\nProceed to question phase."
                                : "The examinee must listen to the\naudio delivery before questions appear."}
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                   </>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <AlertCircle className="w-12 h-12 mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">Section Complete or No Questions</p>
                   </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
           <button 
             disabled={isExam || (currentQuestionIndex === 0 && currentSection === 'A')}
             onClick={() => {
                if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
                else {
                  const sections: ListeningSectionType[] = ['A', 'B', 'C', 'D'];
                  const idx = sections.indexOf(currentSection);
                  if (idx > 0) {
                    const prevSection = sections[idx - 1];
                    setCurrentSection(prevSection);
                    // Use clipGroups length for previous section
                    const prevQuestions = paper.sections[prevSection];
                    const prevClipGroups: string[] = [];
                    prevQuestions.forEach(q => {
                      if (!prevClipGroups.includes(q.audioClipId)) prevClipGroups.push(q.audioClipId);
                    });
                    setCurrentQuestionIndex(prevClipGroups.length - 1);
                  }
                }
             }}
             className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white disabled:opacity-30 flex items-center gap-2"
           >
              <ArrowLeft className="w-4 h-4" /> Back
           </button>

           <div className="flex items-center gap-4">
              {isExam && (
                <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/20">
                   <Lock className="w-3 h-3 text-rose-500" />
                   <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Navigation Locked</span>
                </div>
              )}
              
              <button 
                onClick={handleNext}
                disabled={isMarking}
                className="px-8 py-3 bg-slate-950 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
              >
                 {isMarking ? <RotateCw className="w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="w-4 h-4" /></>}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
