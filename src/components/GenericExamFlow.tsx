
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Clock, 
  Brain,
  AlertCircle,
  ArrowLeft,
  Play,
  History,
  Target,
  Zap,
  Sparkles,
  Timer,
  Star,
  X,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { GCSEQuestion } from '../types/question';
import { QuestionEngine } from '../services/questionEngine';
import { AnalyticsService } from '../services/analyticsService';
import { MissionService } from '../services/user/missionService';
import { AIExaminer, AIFeedbackReport } from '../services/aiExaminer';
import { ImageWithFallback } from './ImageWithFallback';
import { auth } from '../firebase';
import { ExamEnvironment } from '../types';
import { WeaknessService } from '../services/user/weaknessService';
import { ShieldCheck } from 'lucide-react';
import { EXAM_RULES, getEstimatedGrade } from '../core/examRules';

interface GenericExamFlowProps {
  language: string;
  type: string;
  onExit: () => void;
  examMode?: 'practice' | 'test' | 'full';
  topic?: string;
  environment?: ExamEnvironment;
}

export function GenericExamFlow({ language, type, onExit, examMode = 'practice', topic, environment = 'TRAINING' }: GenericExamFlowProps) {
  const user = auth.currentUser;
  const isExam = environment === 'EXAM';
  
  // Force full exam mode in EXAM environment
  const effectiveExamMode = isExam ? 'full' : examMode;

  const [step, setStep] = useState<'intro' | 'exam' | 'result' | 'review'>('intro');
  const [questions, setQuestions] = useState<GCSEQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState<{ correct: boolean, time: number, userResponse: string }[]>([]);
  const [feedback, setFeedback] = useState<AIFeedbackReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const examConfig = EXAM_RULES.PAPERS.MODES[effectiveExamMode as keyof typeof EXAM_RULES.PAPERS.MODES];

  useEffect(() => {
    let loadedQuestions = QuestionEngine.getQuestions({
      language,
      types: type === 'all' ? undefined : [type],
      topics: topic ? [topic] : undefined,
      limit: examConfig.limit,
      excludeRecent: true
    });
    // Fallback if no questions matched the specified topic category
    if (loadedQuestions.length === 0 && topic) {
      loadedQuestions = QuestionEngine.getQuestions({
        language,
        types: type === 'all' ? undefined : [type],
        limit: examConfig.limit,
        excludeRecent: true
      });
    }
    setQuestions(loadedQuestions);
  }, [language, type, effectiveExamMode, topic]);

  const startExam = () => {
    setStep('exam');
    setTimeRemaining(examConfig.time);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      if (examConfig.time > 0) {
        setTimeRemaining(prev => {
          if (prev === 300) {
            setAlert("5 Minutes Remaining");
            setTimeout(() => setAlert(null), 5000);
          }
          if (prev === 60) {
            setAlert("1 Minute Remaining!");
            setTimeout(() => setAlert(null), 5000);
          }
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep('result');
    
    // Save to history
    const correctCount = results.filter(r => r.correct).length;
    const avgTime = results.reduce((acc, r) => acc + r.time, 0) / (results.length || 1);
    
    AnalyticsService.saveExamResult({
      language,
      type,
      score: correctCount,
      total: questions.length,
      avgTime: Math.round(avgTime),
      topics: Array.from(new Set(questions.map(q => q.topic)))
    });

    // Complete daily missions
    MissionService.completeMission('m1');
    MissionService.completeMission('m2');
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedTarget = currentQuestion.answer.toLowerCase();
    const isCorrect = normalizedUser === normalizedTarget || 
                     (currentQuestion.acceptableAnswers?.some(a => a.toLowerCase() === normalizedUser) ?? false);

    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    AnalyticsService.recordResult(currentQuestion.topic, isCorrect, timeTaken);
    setResults([...results, { correct: isCorrect, time: timeTaken, userResponse: userAnswer }]);
    
    if (effectiveExamMode === 'practice') {
      setShowFeedback(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      startTimeRef.current = Date.now();
    } else {
      handleComplete();
    }
  };

  const currentQuestion = questions[currentIndex];

  // Intro Screen
  if (step === 'intro') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {language} {type}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 font-bold">
              <span className={isExam ? 'text-rose-600' : ''}>
                {isExam ? 'GCSE EXAM MODE' : effectiveExamMode === 'full' ? 'Official Simulation' : effectiveExamMode === 'test' ? 'Timed Test' : 'Quick Practice'}
              </span>
              <span>•</span>
              <span>{questions.length} Questions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Clock className="w-5 h-5 text-indigo-500 mb-2" />
            <div className="text-sm font-black text-slate-900 dark:text-white">
              {examConfig.time > 0 ? `${examConfig.time / 60} Mins` : 'No Limit'}
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Duration</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <div className="text-sm font-black text-slate-900 dark:text-white">GCSE Style</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quality</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Brain className="w-5 h-5 text-emerald-500 mb-2" />
            <div className="text-sm font-black text-slate-900 dark:text-white">Adaptive</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Difficulty</div>
          </div>
        </div>

        <div className={`bg-amber-50 dark:bg-amber-900/10 border p-6 rounded-2xl mb-8 ${isExam ? 'border-rose-400 bg-rose-50/50' : 'border-amber-100 dark:border-amber-900/30'}`}>
          <h4 className={`font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 ${isExam ? 'text-rose-900' : 'text-amber-900 dark:text-amber-400'}`}>
            {isExam && <ShieldCheck className="w-4 h-4" />}
            {isExam ? 'STRICT EXAM CONDITIONS' : 'Official Candidate Instructions'}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isExam ? 'text-rose-900/40' : 'text-amber-900/40 dark:text-amber-400/40'}`}>Candidate Name</label>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{user?.displayName || 'ISAAC SAUL'}</div>
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isExam ? 'text-rose-900/40' : 'text-amber-900/40 dark:text-amber-400/40'}`}>Centre Number</label>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 text-right">61008 / 0521</div>
              </div>
            </div>
            <div className={`h-px ${isExam ? 'bg-rose-200' : 'bg-amber-200/50 dark:bg-amber-900/30'}`} />
            <ul className="text-slate-600 dark:text-slate-400 text-sm font-bold space-y-2">
              <li className="flex gap-2"><span>•</span> <span>You must not have any unauthorized materials in your possession.</span></li>
              <li className="flex gap-2"><span>•</span> <span>Total marks for this paper: {questions.length * 2}</span></li>
              <li className="flex gap-2"><span>•</span> <span>Dictionaries are NOT permitted. Realism Calibration Active.</span></li>
              {isExam && <li className="flex gap-2 text-rose-600"><span>•</span> <span>Adaptive assistance and instant feedback are DISABLED.</span></li>}
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onExit} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 transition-colors">
            Back
          </button>
          <button 
            onClick={startExam}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Exam</span>
          </button>
        </div>
      </motion.div>
    );
  }

  const handleAiEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const payload = {
        examType: (type === 'writing' ? 'writing' : type === 'listening' ? 'listening' : 'reading') as any,
        language: language,
        tier: 'higher',
        responses: questions.map((q, i) => ({
          questionId: q.id,
          questionText: q.question,
          userResponse: results[i]?.userResponse || '',
          marksAvailable: q.marks
        }))
      };

      try {
        const report = await AIExaminer.generateFeedback(payload);
        setFeedback(report);

        // Track results for weakness detection
        if (report.estimatedGCSEGrade) {
          const weaknessTags = report.sectionBreakdown.flatMap(s => s.weaknesses);
          WeaknessService.trackFeedback(weaknessTags, report.estimatedGCSEGrade, environment);
        }
      } catch (e) {
        setFeedback(AIExaminer.getFallbackFeedback(payload));
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  if (feedback) {
     return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12">
           <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Examiner Report</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-[0.2em]">{language} • {type}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="md:col-span-1 bg-indigo-600 rounded-[2.5rem] p-8 text-center text-white shadow-xl shadow-indigo-600/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Estimated Grade</p>
                    <div className="text-7xl font-black mb-2">{feedback.estimatedGCSEGrade}</div>
                    <div className="px-4 py-1.5 bg-white/20 rounded-full inline-block text-[10px] font-black uppercase tracking-widest">
                       Official Standard
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-6 flex flex-col justify-center">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Brain className="w-4 h-4 text-indigo-500" />
                         AI Assessment Summary
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-sm leading-relaxed mb-6 italic">
                        "{feedback.overallComments}"
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {feedback.sectionBreakdown[0]?.strengths.slice(0, 2).map((s, i) => (
                           <div key={i} className="flex gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight">{s}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 mb-12">
                 <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    Examiner Next Steps
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedback.nextSteps.map((step, i) => (
                       <div key={i} className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 flex gap-3">
                          <span className="text-indigo-500">•</span>
                          {step}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex gap-4">
                <button
                   onClick={onExit}
                   className="flex-1 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                   Return to Hub
                </button>
                <button
                   onClick={() => setFeedback(null)}
                   className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-700"
                >
                   Review Mark Scheme
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (step === 'result') {
    const correctCount = results.filter(r => r.correct).length;
    const avgTime = results.reduce((acc, r) => acc + r.time, 0) / (results.length || 1);
    const scorePct = Math.round((correctCount / (questions.length || 1)) * 100);
    const estimatedGrade = getEstimatedGrade(scorePct);
    const weaknesses = AnalyticsService.getWeakestTopics(2);
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Confetti-like background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center mb-12 relative z-10">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-indigo-600/10 transition-all duration-1000"
                  style={{ height: `${scorePct}%` }}
                ></div>
                <div className="text-center relative z-10">
                  <div className="text-6xl font-black text-slate-900 dark:text-white leading-none">{scorePct}%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Accuracy</div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-sm shadow-xl whitespace-nowrap">
                Pass Grade Reached
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                <CheckCircle2 className="w-3 h-3" />
                Assessment Validated
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                Great job, {user?.displayName?.split(' ')[0] || 'Candidate'}!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-6 leading-relaxed">
                Your performance in this {language} {type} simulation indicates a strong grasp of the fundamental concepts.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                 <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">Top 15% Percentile</span>
                 </div>
                 <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">+12% vs Last Session</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GCSE Grade Est.</span>
               </div>
               <div className="text-5xl font-black text-indigo-600 mb-2">{estimatedGrade}</div>
               <div className="text-xs font-bold text-slate-500 italic">Based on 2024 Boundaries</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raw Mark</span>
               </div>
               <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{correctCount}/{questions.length}</div>
               <div className="text-xs font-bold text-slate-500">Correct candidates responses</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Efficiency</span>
               </div>
               <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{avgTime.toFixed(0)}<span className="text-2xl ml-1">s</span></div>
               <div className="text-xs font-bold text-slate-500">Average time per mark</div>
            </div>
          </div>

        {weaknesses.length > 0 && (
          <div className="text-left mb-8">
            <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest mb-4">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Focus Areas
            </h4>
            <div className="space-y-3">
              {weaknesses.map(w => (
                <div key={w.topic} className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                  <div className="font-bold text-slate-900 dark:text-white">{w.topic}</div>
                  <div className="text-rose-600 font-black">{Math.round(w.accuracy)}% accuracy</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={() => onExit()}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm"
          >
            Dashboard
          </button>
          {examMode !== 'practice' && (
            <button 
              onClick={handleAiEvaluation}
              disabled={isEvaluating}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 relative overflow-hidden group shadow-xl shadow-indigo-600/20"
            >
              {isEvaluating && <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
              <Sparkles className="w-5 h-5" />
              <span>Full AI Report</span>
            </button>
          )}
          <button 
            onClick={() => {
              setStep('review');
              setCurrentIndex(0);
            }}
            className={`${examMode !== 'practice' ? 'flex-1' : 'flex-[2]'} py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] text-sm`}
          >
            <span>Review Full Paper</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
    );
  }

  // Review Screen
  if (step === 'review') {
    const q = questions[currentIndex];
    const res = results[currentIndex];

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setStep('result')} className="flex items-center gap-2 text-slate-500 font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Summary
            </button>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Reviewing {currentIndex + 1} / {questions.length}
            </div>
          </div>

          <div className={`p-8 rounded-3xl mb-8 border-2 shadow-sm ${res?.correct ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/50' : 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/50'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 font-black uppercase text-sm tracking-[0.2em]">
                {res?.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                <span className={res?.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {res?.correct ? 'Correct Implementation' : 'Correction Required'}
                </span>
              </div>
              <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                {q.topic}
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{q.question}</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your response</div>
                <div className={`font-bold text-lg ${res?.correct ? 'text-emerald-600' : 'text-rose-500 line-through decoration-rose-300'}`}>
                  {userAnswer || (res as any)?.answer || '[No Response Provided]'}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Examiner Answer</div>
                <div className="font-black text-lg text-emerald-600">
                  {q.answer}
                </div>
              </div>
            </div>

            {/* EDUCATIONAL FEEDBACK SYSTEM */}
            <div className="space-y-4">
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Examiner Insights</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed italic">
                  {q.explanation || "This question tests your ability to use specific vocabulary in context. Pay close attention to grammar markers."}
                </p>
              </div>

              {!res?.correct && (
                <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-widest">Common Mistakes</span>
                  </div>
                  <ul className="text-slate-600 dark:text-slate-400 text-xs font-bold space-y-2">
                    <li>• Incorrect verb ending for the {q.tier} tier context.</li>
                    <li>• Misinterpretation of the key vocabulary '{q.question.split(' ').slice(-1)}'.</li>
                    <li>• Make sure to include all necessary accents or grammatical markers.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 disabled:opacity-50 text-slate-600 dark:text-slate-400 rounded-xl font-black"
            >
              Previous
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex-1 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-black"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Screen
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-slate-900 dark:text-white">
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-2xl flex items-center gap-3 border-2 border-rose-400"
          >
            <AlertCircle className="w-6 h-6" />
            {alert}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Exam Header */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 rounded-t-[2.5rem] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</div>
            <div className="font-black text-slate-900 dark:text-white">{language} {type}</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</div>
            <div className="font-black text-slate-900 dark:text-white">{currentIndex + 1} of {questions.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {examConfig.time > 0 && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${timeRemaining < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <Timer className="w-5 h-5" />
              <span className="font-black mono tabular-nums">{formatTime(timeRemaining)}</span>
            </div>
          )}
          <button onClick={onExit} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">
            Quit
          </button>
        </div>
      </div>

      {/* Main Paper */}
      <div className="bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl rounded-b-[2.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* GCSE Section Marker */}
            <div className="flex items-center justify-between mb-8">
              <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Section {Math.floor(currentIndex / 5) + 1}
              </div>
              <div className="text-xs font-bold text-slate-400 italic">
                [{currentQuestion.marks} Marks]
              </div>
            </div>

            {currentQuestion.image && (
              <div className="mb-8">
                <ImageWithFallback src={currentQuestion.image} alt="Exam illustration" className="w-full h-48 sm:h-64 rounded-3xl" />
              </div>
            )}

            <div className="mb-12">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed mb-8">
                <span className="text-indigo-600 dark:text-indigo-400 mr-4 tabular-nums">Q{currentIndex + 1}.</span>
                {currentQuestion.question}
              </h3>

              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showFeedback}
                    placeholder="Enter candidate response..."
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:outline-none focus:border-indigo-500 transition-all text-xl"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && !showFeedback && userAnswer.trim() && handleSubmit()}
                  />
                  {!showFeedback && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                      <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-black text-slate-400 uppercase">Enter</kbd>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-6 rounded-2xl border-2 ${results[currentIndex].correct ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {results[currentIndex].correct ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                          <span className={`font-black ${results[currentIndex].correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                            {results[currentIndex].correct ? 'CORRECT' : 'INCORRECT'}
                          </span>
                        </div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {results[currentIndex].correct ? currentQuestion.marks : 0} / {currentQuestion.marks} MARKS
                        </div>
                      </div>
                      
                      {!results[currentIndex].correct && (
                        <p className="text-slate-600 dark:text-slate-400 font-bold mb-4">
                          Expect Answer: <span className="text-slate-900 dark:text-white underline decoration-rose-200 decoration-2">{currentQuestion.answer}</span>
                        </p>
                      )}
                      
                      {currentQuestion.explanation && (
                        <div className="flex gap-3 p-4 bg-white/50 dark:bg-black/20 rounded-xl mt-4 border border-white/50">
                          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {!showFeedback ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="flex-1 py-5 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      Submit Response
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 group shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                      <span>{currentIndex < questions.length - 1 ? 'Continue' : 'Complete Exam'}</span>
                      <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-12 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
