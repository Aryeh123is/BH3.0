
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Clock, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  ArrowLeft,
  BookOpen,
  History,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { WritingPaper, WritingTask } from '../data/writingPrompts';
import { aiExaminer } from '../services/aiExaminer';
import { UserPreferences, ExamEnvironment } from '../types';
import { WeaknessService } from '../services/user/weaknessService';
import { CalibrationService } from '../services/calibrationService';
import { SessionPersistence } from '../services/sessionPersistence';
import { AnalyticsService } from '../services/analyticsService';
import { MissionService } from '../services/user/missionService';
import { EXAM_RULES, validateWritingStructure } from '../core/examRules';

interface WritingExamModeProps {
  paper: WritingPaper;
  onExit: () => void;
  isPremium?: boolean;
  preferences?: UserPreferences;
  environment?: ExamEnvironment;
  examinerProfile?: { tone: string; strictnessOffset: number };
}

export function WritingExamMode({ 
  paper, 
  onExit, 
  isPremium = false, 
  preferences,
  environment = 'TRAINING',
  examinerProfile,
}: WritingExamModeProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(
    paper.difficulty === 'higher' 
      ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 
      : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60
  ); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [examState, setExamState] = useState<'instructions' | 'exam' | 'feedback'>('instructions');
  const [examStartTimestamp] = useState(() => Date.now());
  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [isRedrafting, setIsRedrafting] = useState(false);

  const paperTasks = validateWritingStructure(paper.tasks);

  const currentTask = paperTasks[currentTaskIndex];

  // Word count helper (v3.9.6 Integrity Logic)
  const getWordCount = (text: string) => {
    const rawWords = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (rawWords.length === 0) return 0;
    
    const filteredWords = [];
    let repeatedCount = 0;
    
    for (let i = 0; i < rawWords.length; i++) {
        const word = rawWords[i].toLowerCase().replace(/[.,!?;:]/g, '');
        const prevWord = i > 0 ? rawWords[i-1].toLowerCase().replace(/[.,!?;:]/g, '') : null;
        
        if (word === prevWord && word.length > 0) {
            repeatedCount++;
            if (repeatedCount > 1) continue; // v3.9.6: Block "the the the" inflation
        } else {
            repeatedCount = 0;
        }
        filteredWords.push(rawWords[i]);
    }

    return filteredWords.length;
  };

  // Timer effect (v3.9.6 Delta tracking)
  useEffect(() => {
    if (examState !== 'exam') return;

    const tick = () => {
      const totalSeconds = paper.difficulty === 'higher' 
        ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 
        : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60;
      
      const elapsedMs = Date.now() - examStartTimestamp;
      const remaining = Math.max(0, totalSeconds - Math.floor(elapsedMs / 1000));
      
      setTimeLeft(remaining);
      if (remaining <= 0) handleSubmit();
    };

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [examState, examStartTimestamp]);

  // Session Recovery
  useEffect(() => {
    if (environment !== 'EXAM') return;
    const saved = SessionPersistence.getSession('writing');
    if (saved && saved.examId === paper.id) {
       setAnswers(saved.userAnswers);
       setExamState('exam');
    }
  }, [paper.id, environment]);

  useEffect(() => {
    if (environment !== 'EXAM' || examState !== 'exam') return;
    SessionPersistence.saveSession({
      examId: paper.id,
      type: 'writing',
      startTimestamp: examStartTimestamp,
      totalDurationSeconds: paper.difficulty === 'higher' 
        ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 
        : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60,
      userAnswers: answers
    });
  }, [answers, examState, examStartTimestamp, paper.id, environment, paper.difficulty]);

  // Local persistence for drafts
  useEffect(() => {
    const saved = localStorage.getItem(`writing-draft-${paper.id}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [paper.id]);

  const saveDraft = (newAnswers: Record<string, string>) => {
    setAnswers(newAnswers);
    localStorage.setItem(`writing-draft-${paper.id}`, JSON.stringify(newAnswers));
  };

  const handleTaskChange = (val: string) => {
    saveDraft({ ...answers, [currentTask.id]: val });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Concatenate answers for AI evaluation
      const submission = paperTasks.map(t => ({
        taskId: t.id,
        type: t.type,
        prompt: t.prompt,
        bullets: t.bullets,
        answer: answers[t.id] || ''
      }));

      const results = await aiExaminer.gradeWritingPaper(paper.language, submission, isPremium, examinerProfile);
      
      // Track academic weaknesses
      if (results.weaknessTags) {
        WeaknessService.trackFeedback(results.weaknessTags, results.grade, environment);
      }

      // v3.8.9: Track usage for rotation
      CalibrationService.trackUsage(paper.id, paper.theme || 'GENERAL');

      // Save writing results to analytics
      const totalTimeSeconds = Math.max(1, Math.round((Date.now() - examStartTimestamp) / 1000));
      const avgTimePerTask = Math.round(totalTimeSeconds / (paperTasks.length || 1));
      const totalMarks = paper.tasks.reduce((sum, task) => sum + (task.marks || 0), 0);
      
      AnalyticsService.saveExamResult({
        language: paper.language,
        type: 'Writing',
        score: results.score,
        total: totalMarks,
        avgTime: avgTimePerTask,
        topics: [paper.theme || 'GENERAL']
      });

      const percentage = totalMarks > 0 ? (results.score / totalMarks) * 100 : 50;
      AnalyticsService.recordResult(paper.theme || 'GENERAL', percentage >= 50, totalTimeSeconds);

      // Complete Daily Mock Exam Mission
      MissionService.completeMission('m1');

      const newAttempt = {
        timestamp: Date.now(),
        grade: results.grade,
        score: results.score,
        feedback: results
      };

      setAttemptHistory(prev => [...prev, newAttempt]);
      setFeedback(results);
      setExamState('feedback');
      SessionPersistence.clearSession();
      setIsRedrafting(false);
      localStorage.removeItem(`writing-draft-${paper.id}`);
    } catch (error) {
      console.error("Submission failed", error);
      // Fallback local marking
      const fallbackResults = {
        grade: "Pending review",
        score: Object.keys(answers).length * 10,
        summary: "Your exam was saved locally, but we had trouble reaching the AI examiner. Check your internet connection.",
        tasks: paper.tasks.map(t => ({
          taskId: t.id,
          wordCount: getWordCount(answers[t.id] || ''),
          status: (answers[t.id]?.length || 0) > 50 ? 'Complete' : 'Short'
        }))
      };
      setFeedback(fallbackResults);
      setExamState('feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderText = () => {
    const lang = paper.language.toLowerCase();
    if (lang === 'spanish') return 'Escribe tu respuesta aquí...';
    if (lang === 'french') return 'Écrivez votre réponse ici...';
    if (lang === 'german') return 'Schreiben Sie Ihre Antwort hier...';
    if (lang === 'arabic') return 'اكتب إجابتك هنا...';
    if (lang === 'hebrew' || lang === 'modern hebrew' || lang === 'biblical hebrew') return 'כתוב את תשובתך כאן...';
    return 'Write your answer here in the target language...';
  };

  const isRTL = paper.language.toLowerCase() === 'arabic' || paper.language.toLowerCase() === 'hebrew' || paper.language.toLowerCase() === 'modern hebrew';

  const getMentionLabel = () => {
    const lang = paper.language.toLowerCase();
    if (lang === 'spanish' || lang === 'french') return 'You should mention:';
    if (lang === 'german') return 'Sie sollten folgende Punkte erwähnen:';
    if (lang === 'arabic') return 'يجب أن تذكر:';
    if (lang === 'hebrew' || lang === 'modern hebrew') return 'עליך לציין:';
    return 'You should mention:';
  };

  const getWordCountGuidance = () => {
    const lang = paper.language.toLowerCase();
    const count = currentTask.type === '90-word' ? '90' : '150';
    const targetLangName = paper.language.charAt(0).toUpperCase() + paper.language.slice(1);
    
    if (lang === 'spanish' || lang === 'french') return `Write approximately ${count} words in ${targetLangName}.`;
    if (lang === 'german') return `Schreiben Sie ca. ${count} Wörter auf Deutsch.`;
    if (lang === 'arabic') return `اكتب حوالي ${count} كلمة باللغة العربية.`;
    if (lang === 'hebrew' || lang === 'modern hebrew') return `כתוב כ-${count} מילים בעברית.`;
    return `Write approximately ${count} words in ${targetLangName}.`;
  };

  if (examState === 'instructions') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 ${environment === 'EXAM' ? 'bg-rose-500/10' : 'bg-indigo-500/10'} rounded-2xl`}>
              <PenTool className={`w-8 h-8 ${environment === 'EXAM' ? 'text-rose-500' : 'text-indigo-500'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-black">{paper.title}</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                {environment === 'EXAM' ? 'GCSE Exam Conditions active' : `GCSE Writing Section • ${paper.difficulty} Tier`}
              </p>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            {environment === 'EXAM' && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-4">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <p className="font-black text-rose-600 dark:text-rose-400">Strict Exam Mode</p>
                  <p className="text-xs font-bold text-rose-500/80 uppercase tracking-tight">Adaptive assistance disabled • Single attempt only</p>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <Clock className={`w-6 h-6 ${environment === 'EXAM' ? 'text-rose-500' : 'text-indigo-500'} shrink-0`} />
              <div>
                <p className="font-bold">Suggested Time: {timeLeft / 60} Minutes</p>
                <p className="text-sm text-slate-500">Manage your time across the 3 tasks.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <FileText className="w-6 h-6 text-indigo-500 shrink-0" />
              <div>
                <p className="font-bold">Total Marks: 60</p>
                <p className="text-sm text-slate-500">Questions are graded on communication, content, and accuracy.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="w-6 h-6 text-indigo-500 shrink-0" />
              <div>
                <p className="font-bold">Exam Conditions</p>
                <p className="text-sm text-slate-500">Do not use dictionaries or translators during this session.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setExamState('exam')}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20"
            >
              Start Exam
            </button>
            <button 
              onClick={onExit}
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black transition-all"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (examState === 'feedback') {
    const previousAttempt = attemptHistory.length > 1 ? attemptHistory[attemptHistory.length - 2] : null;
    const currentAttempt = attemptHistory[attemptHistory.length - 1];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto text-slate-900 dark:text-white">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={onExit} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-black">{paper.title}</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Marked by AI Examiner</p>
            </div>
            <div className="flex gap-2">
              {environment === 'TRAINING' && (
                <button 
                  onClick={() => {
                    setExamState('exam');
                    setIsRedrafting(true);
                  }}
                  className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20"
                  title="Redraft & Improve"
                >
                  <PenTool className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Score Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden"
          >
            {previousAttempt && (
              <div className="mb-8 flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Progression: Grade {previousAttempt.grade} → Grade {currentAttempt.grade}
                </p>
              </div>
            )}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BarChart3 className="w-48 h-48" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="flex flex-col items-center">
                 <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{feedback.grade}</div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Est. GCSE Grade</div>
              </div>
              <div className="h-px md:h-24 w-full md:w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black mb-4">Examiner's Summary</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {feedback.summary}
                </p>
              </div>
            </div>

            {feedback.moderation && (
              <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-4">
                 <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                 <div>
                    <h5 className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-1">Board Moderation Verified</h5>
                    <p className="text-xs font-bold text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                      {feedback.moderation.note}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                       <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">AI Logic: {feedback.moderation.originalPercentage.toFixed(1)}%</div>
                       <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">•</div>
                       <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">Moderated Score: {feedback.moderation.finalPercentage.toFixed(1)}%</div>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>

          {!isPremium && (
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 fill-current" />
                <div>
                  <p className="font-black">Unlock Full Feedback</p>
                  <p className="text-xs font-bold text-white/80">Get line-by-line grammar analysis and grade roadmaps.</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm">Upgrade</button>
            </div>
          )}

          {/* Task Detailed Feedback */}
          <div className="grid gap-6">
            {paperTasks.map((task, idx) => {
              const f = feedback.tasks?.[idx] || {};
              return (
                <div key={task.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-black uppercase tracking-tight">{task.type} Task</h4>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${f.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {f.status || 'Marked'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Your Answer</h5>
                      <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-medium leading-relaxed italic text-slate-700 dark:text-slate-300">
                        {answers[task.id] || "No answer provided."}
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                        <span>Word count: {getWordCount(answers[task.id] || '')}</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Assessment</h5>
                      <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">{f.comment || "Good effort on addressing the bullet points."}</p>
                      {f.suggestions && (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Key Improvements:</p>
                          {f.suggestions.map((s: string, i: number) => (
                            <div key={i} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                              <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
            {environment === 'TRAINING' && (
              <button 
                onClick={() => {
                  setExamState('exam');
                  setIsRedrafting(true);
                }}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                Redraft & Improve
              </button>
            )}
            <button 
              onClick={onExit}
              className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black transition-all"
            >
              Finish Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${environment === 'EXAM' ? 'bg-slate-50 dark:bg-slate-950 border-4 border-rose-500/20' : 'bg-slate-100 dark:bg-black'} p-4 md:p-8 flex flex-col text-slate-900 dark:text-white`}>
      {/* EXAM TOOLBAR */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-black leading-tight">
              {paper.title} 
              {isRedrafting && <span className="text-indigo-500 ml-2">(Redrafting)</span>}
              {environment === 'EXAM' && <span className="text-rose-500 ml-2 flex items-center gap-1 text-sm"><ShieldCheck className="w-4 h-4" /> EXAM MODE</span>}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 ${environment === 'EXAM' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : isRedrafting ? 'bg-indigo-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {environment === 'EXAM' ? 'Fixed Exam Board Structure • No Assistance' : isRedrafting ? 'Improvement Loop Active' : 'Session Live'} • {paper.difficulty} Tier
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</span>
            <div className={`text-2xl font-black tabular-nums transition-all ${timeLeft < 300 ? 'text-rose-500 scale-110' : 'text-slate-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* PACING BAR */}
          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
             <motion.div 
               initial={{ width: '100%' }}
               animate={{ width: `${(timeLeft / (paper.difficulty === 'higher' ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60)) * 100}%` }}
               className={`h-full transition-colors duration-1000 ${
                  (timeLeft / (paper.difficulty === 'higher' ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60)) < EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight ? 'bg-rose-500 animate-pulse' :
                  (timeLeft / (paper.difficulty === 'higher' ? EXAM_RULES.WRITING.TIMER_MINUTES.HIGHER * 60 : EXAM_RULES.WRITING.TIMER_MINUTES.FOUNDATION * 60)) < (EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight + EXAM_RULES.DIFFICULTY_MODEL.STAGES.MID.weight) ? 'bg-amber-500' :
                  'bg-emerald-500'
               }`}
             />
          </div>

          <button 
            onClick={() => {
              if (window.confirm("Ready to submit your paper? You won't be able to edit it after this.")) {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20 disabled:opacity-50"
          >
            {isSubmitting ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit Paper
          </button>
        </div>
      </div>

      {/* EXAM STRUCTURE BAR */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           <div className={`flex-1 text-center py-2 rounded-xl transition-all ${currentTask.type === '90-word' ? 'bg-indigo-600 text-white shadow-lg' : ''}`}>90 Word Task</div>
           <div className="w-8 flex justify-center opacity-20">→</div>
           <div className={`flex-1 text-center py-2 rounded-xl transition-all ${currentTask.type === '150-word' ? 'bg-indigo-600 text-white shadow-lg' : ''}`}>150 Word Task</div>
           <div className="w-8 flex justify-center opacity-20">→</div>
           <div className={`flex-1 text-center py-2 rounded-xl transition-all ${currentTask.type === 'translation' ? 'bg-indigo-600 text-white shadow-lg' : ''}`}>Translation</div>
        </div>
      </div>

      {/* EXAM PAPER CONTAINER */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 min-h-0">
        
        {/* TASK NAVIGATION (Mobile friendly sidebar) */}
        <div className="md:w-64 flex flex-col gap-2 shrink-0">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-4">Questions</p>
          {paperTasks.map((task, idx) => (
            <button
              key={task.id}
              onClick={() => setCurrentTaskIndex(idx)}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                currentTaskIndex === idx 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-black text-xs opacity-50">0{idx + 1}</span>
                <span className="font-black text-sm uppercase tracking-tight">{task.type}</span>
              </div>
              {(answers[task.id]?.length || 0) > 0 && <CheckCircle2 className="w-4 h-4" />}
            </button>
          ))}

          <div className="mt-auto p-6 bg-slate-900/5 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700">
             <div className="flex items-center gap-2 mb-2 text-slate-500">
                <History className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Auto-save Active</span>
             </div>
             <p className="text-[9px] font-bold text-slate-400 italic">Drafts are saved locally on this device.</p>
          </div>
        </div>

        {/* ACTIVE TASK EDITOR */}
        <div className="flex-1 flex flex-col">
          <motion.div 
            key={currentTask.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl flex-1 flex flex-col min-h-0"
          >
             <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                     Task 0{currentTaskIndex + 1}
                   </div>
                   <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                     {currentTask.marks} Marks
                   </div>
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">{currentTask.theme}</h3>
               </div>

               <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Word Count</p>
                    <p className={`text-xl font-black ${
                      currentTask.type === '90-word' && getWordCount(answers[currentTask.id] || '') < 80 ? 'text-amber-500' : 
                      currentTask.type === '150-word' && getWordCount(answers[currentTask.id] || '') < 140 ? 'text-amber-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {getWordCount(answers[currentTask.id] || '')}
                    </p>
                  </div>
               </div>
             </div>

             <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-4 italic">
                  {currentTask.prompt}
                </p>
                {currentTask.bullets && (
                  <div className="space-y-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                      {getMentionLabel()}
                    </p>
                    <ul className={`grid sm:grid-cols-2 gap-3 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {currentTask.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3 text-sm font-medium text-slate-500">
                          <span className={`w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0 ${isRTL ? 'order-last' : ''}`} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {currentTask.type !== 'translation' && (
                      <p className="text-xs font-bold text-slate-400 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        {getWordCountGuidance()}
                      </p>
                    )}
                  </div>
                )}
                {currentTask.englishVersion && (
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-medium italic">
                    {currentTask.englishVersion}
                  </div>
                )}
             </div>

             <div className="flex-1 min-h-[300px] relative" dir={isRTL ? 'rtl' : 'ltr'}>
               <textarea
                 value={answers[currentTask.id] || ''}
                 onChange={(e) => handleTaskChange(e.target.value)}
                 placeholder={getPlaceholderText()}
                 className={`w-full h-full p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-all resize-none font-medium leading-relaxed dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 ${isRTL ? 'font-serif' : ''}`}
               />
               <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2 text-slate-400`}>
                 <PenTool className="w-5 h-5 opacity-20" />
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
