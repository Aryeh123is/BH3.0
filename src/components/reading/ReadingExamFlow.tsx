import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ReadingPaper, 
  ReadingAttempt, 
  ReadingAnswer 
} from '../../types/reading';
import { READING_PAPERS } from '../../data/reading/readingPapers';
import { ReadingPaperEngine } from '../../core/reading/readingPaperEngine';
import { ReadingQuestionRenderer } from './ReadingQuestionRenderer';
import { ReadingResults } from './ReadingResults';
import { EXAM_RULES, getEstimatedGrade } from '../../core/examRules';
import { aiExaminer } from '../../services/aiExaminer';
import { CalibrationService } from '../../services/calibrationService';
import { SessionPersistence } from '../../services/sessionPersistence';
import { AnalyticsService } from '../../services/analyticsService';
import { MissionService } from '../../services/user/missionService';
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  BookOpen,
  Eye,
  Timer,
  ArrowRight
} from 'lucide-react';
import { ExamEnvironment } from '../../types';
import { getStandardLanguageName } from '../../lib/utils';

interface ReadingExamFlowProps {
  language: string;
  tier: 'foundation' | 'higher';
  environment: ExamEnvironment;
  onExit: () => void;
}

export const ReadingExamFlow: React.FC<ReadingExamFlowProps> = ({
  language,
  tier,
  environment,
  onExit
}) => {
  const [paper, setPaper] = useState<ReadingPaper | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [step, setStep] = useState<'instructions' | 'exam' | 'marking' | 'result'>('instructions');
  const [attempt, setAttempt] = useState<ReadingAttempt | null>(null);
  const [examStartTimestamp] = useState(() => Date.now());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isBH = language.toLowerCase().includes('biblical');

  // Paper selection
  useEffect(() => {
    const standardName = getStandardLanguageName(language);
    let validPapers = READING_PAPERS.filter(p => 
      p.language.toLowerCase() === standardName.toLowerCase() && 
      p.tier === tier
    );
    
    if (validPapers.length === 0) {
      // Fallback to any tier of the same language to prevent multi-language pollution
      validPapers = READING_PAPERS.filter(p => 
        p.language.toLowerCase() === standardName.toLowerCase()
      );
    }
    
    // v3.8.9: Apply weighted selection and decay control
    const calibratedPapers = CalibrationService.getWeightedSelection(validPapers);
    const selected = calibratedPapers[0] || READING_PAPERS.find(p => p.language.toLowerCase() === standardName.toLowerCase()) || READING_PAPERS[0];
    
    setPaper(selected);
    setTimeLeft(selected.estimatedTime * 60);
  }, [language, tier]);

  // Timer logic (v3.9.6 Delta Tracking)
  useEffect(() => {
    if (step === 'exam' && paper) {
      const tick = () => {
        const totalMs = paper.estimatedTime * 60 * 1000;
        const elapsedMs = Date.now() - examStartTimestamp;
        const remaining = Math.max(0, Math.floor((totalMs - elapsedMs) / 1000));
        
        setTimeLeft(remaining);
        if (remaining <= 0) handleFinish();
      };

      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, paper, examStartTimestamp]);

  // Session Recovery
  useEffect(() => {
    if (environment !== 'EXAM' || !paper) return;
    const saved = SessionPersistence.getSession('reading');
    if (saved && saved.examId === paper.id) {
       setAnswers(saved.userAnswers);
       setStep('exam');
    }
  }, [paper?.id, environment]);

  useEffect(() => {
    if (environment !== 'EXAM' || step !== 'exam' || !paper) return;
    SessionPersistence.saveSession({
      examId: paper.id,
      type: 'reading',
      startTimestamp: examStartTimestamp,
      totalDurationSeconds: paper.estimatedTime * 60,
      userAnswers: answers
    });
  }, [answers, step, examStartTimestamp, paper, environment]);

  const handleFinish = async () => {
    if (!paper) return;
    setStep('marking');

    const finalResults: ReadingAnswer[] = [];
    let totalScore = 0;

    for (const section of paper.sections) {
      for (const question of section.questions) {
        if (question.subQuestions && question.subQuestions.length > 0) {
          for (const subQ of question.subQuestions) {
            const userAnswer = answers[subQ.id] || '';
            const isCorrect = subQ.acceptedAnswers?.some(
              acc => userAnswer.toLowerCase().trim() === acc.toLowerCase().trim()
            );
            const score = isCorrect ? subQ.marks : 0;
            totalScore += score;
            finalResults.push({
              questionId: subQ.id,
              sectionId: section.id,
              answer: userAnswer,
              marksAwarded: score,
              isCorrect
            });
          }
        } else {
          const userAnswer = answers[question.id] || '';
          if (question.type === 'translation_passage') {
            try {
              const aiReport = await aiExaminer.generateFeedback({
                examType: 'reading',
                language: paper.language,
                tier: paper.tier,
                responses: [{
                  questionId: question.id,
                  questionText: section.passage || question.prompt,
                  userResponse: userAnswer,
                  marksAvailable: question.marks
                }]
              });
              const taskResult = aiReport.sectionBreakdown?.[0];
              const score = taskResult?.score || 0;
              totalScore += score;
              finalResults.push({
                questionId: question.id,
                sectionId: section.id,
                answer: userAnswer,
                marksAwarded: score,
                feedback: taskResult?.feedback
              });
            } catch (err) {
              finalResults.push({
                questionId: question.id,
                sectionId: section.id,
                answer: userAnswer,
                marksAwarded: 0,
                feedback: 'AI Moderation failed. Please review against suggested answers.'
              });
            }
          } else {
            const isCorrect = question.acceptedAnswers?.some(
              acc => userAnswer.toLowerCase().trim() === acc.toLowerCase().trim()
            );
            const score = isCorrect ? question.marks : 0;
            totalScore += score;
            finalResults.push({
              questionId: question.id,
              sectionId: section.id,
              answer: userAnswer,
              marksAwarded: score,
              isCorrect
            });
          }
        }
      }
    }

    const percentage = (totalScore / paper.totalMarks) * 100;
    const grade = getEstimatedGrade(percentage);

    // v3.8.9: Track usage for long-term calibration
    CalibrationService.trackUsage(paper.id, paper.theme || 'IDENTITY');

    // Record Exam Analytics & History
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - examStartTimestamp) / 1000));
    const avgTimePerQuestion = Math.round(totalTimeSeconds / (finalResults.length || 1));
    AnalyticsService.saveExamResult({
      language: paper.language,
      type: 'Reading',
      score: totalScore,
      total: paper.totalMarks,
      avgTime: avgTimePerQuestion,
      topics: [paper.theme || 'GENERAL']
    });
    AnalyticsService.recordResult(paper.theme || 'GENERAL', percentage >= 50, totalTimeSeconds);

    // Complete Daily Mock Exam Mission
    MissionService.completeMission('m1');

    setAttempt({
      paperId: paper.id,
      language: paper.language,
      tier: paper.tier,
      answers,
      results: finalResults,
      totalScore,
      percentage,
      grade,
      startTime: examStartTimestamp,
      endTime: Date.now(),
      environment: environment as any
    });

    setStep('result');
    SessionPersistence.clearSession();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!paper) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Examination Paper...</div>;

  const renderStep = () => {
    switch (step) {
      case 'instructions':
        return (
          <motion.div 
            key="instructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto py-12 px-6"
          >
            {/* Back button to exit before starting */}
            <button 
              onClick={onExit}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 font-black uppercase tracking-widest text-xs cursor-pointer group transition-colors"
            >
              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Exit Exam Prep</span>
            </button>

            <div className="border-[12px] border-slate-900 dark:border-white p-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-start mb-24">
                  <div className="space-y-2">
                     <p className="text-sm font-black tracking-widest text-slate-400 uppercase">{isBH ? 'Board Standard Mock' : 'AQA / Edexcel Style Mock'}</p>
                     <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-widest uppercase italic">{paper.language}</h1>
                     <p className="text-2xl font-black text-slate-900/50 dark:text-white/50 uppercase tracking-tighter">{isBH ? 'Unseen Practice' : 'Paper 3: Reading'} - {paper.tier} Tier</p>
                  </div>
                  <div className="w-32 h-32 border-4 border-slate-900 dark:border-white flex items-center justify-center text-5xl font-black italic text-slate-900 dark:text-white">
                    {paper.tier.charAt(0).toUpperCase()}
                  </div>
               </div>

               <div className="space-y-12 mb-24 max-w-full">
                  <div className="grid grid-cols-2 gap-12">
                     <div className="border-t-2 border-slate-900 dark:border-white pt-4">
                        <p className="text-[10px] font-black uppercase mb-1 text-slate-500 dark:text-slate-400">Time Allowed</p>
                        <p className="text-2xl font-black italic text-slate-900 dark:text-white">{paper.estimatedTime} minutes</p>
                     </div>
                     <div className="border-t-2 border-slate-900 dark:border-white pt-4">
                        <p className="text-[10px] font-black uppercase mb-1 text-slate-500 dark:text-slate-400">Paper Reference</p>
                        <p className="text-2xl font-black italic text-slate-900 dark:text-white">{paper.paperCode}</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-900 dark:border-white space-y-6">
                  <h3 className="font-black uppercase tracking-[0.2em] text-sm text-center text-slate-900 dark:text-white">Instructions to Candidates</h3>
                  <div className="space-y-4 text-xs font-bold font-mono uppercase leading-relaxed text-slate-700 dark:text-slate-300">
                    <p>• Use English for all answers in this examination.</p>
                    <p>• Answer all questions in both Section A and Section B.</p>
                    <p>• Answer questions in the spaces provided.</p>
                    <p>• Do NOT use a dictionary during the exam.</p>
                    <p>• Total marks for this paper is {paper.totalMarks}.</p>
                  </div>
               </div>

               <div className="mt-16 flex flex-col items-center gap-8">
                  <button
                    onClick={() => setStep('exam')}
                    className="group px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-2xl uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-4 cursor-pointer"
                  >
                    Open Paper
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-[10px] font-black text-slate-400 tracking-[0.5em] uppercase">DO NOT OPEN UNTIL TOLD TO DO SO</p>
               </div>

               {/* BACKGROUND TEXT */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-[0.03] pointer-events-none select-none">
                  <p className="text-[20rem] font-black italic whitespace-nowrap uppercase">EXAM</p>
               </div>
            </div>
          </motion.div>
        );

      case 'exam':
        return (
          <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-white">
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-4 border-slate-900 dark:border-white px-10 py-4 flex justify-between items-center shadow-xl">
               <div className="flex bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 font-black italic text-sm tracking-widest gap-4 items-center relative overflow-hidden group">
                  <Timer className="w-5 h-5 z-10" />
                  <span className="tabular-nums z-10">{formatTime(timeLeft)}</span>
                  {/* PROGRESS BAR BACKGROUND */}
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / (paper.estimatedTime * 60)) * 100}%` }}
                    className={`absolute bottom-0 left-0 h-1 z-0 ${
                      timeLeft / (paper.estimatedTime * 60) < 0.2 ? 'bg-rose-500' : 
                      timeLeft / (paper.estimatedTime * 60) < 0.5 ? 'bg-amber-500' : 
                      'bg-emerald-500'
                    }`}
                  />
               </div>
               <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest">{paper.language} {isBH ? 'UNSEEN' : 'READING'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{paper.tier} Tier • {isBH ? 'Practice Paper' : 'Paper 3'}</p>
               </div>
               <button
                 onClick={handleFinish}
                 className="px-6 py-2 bg-rose-600 text-white font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-colors"
               >
                 Close & Hand In
               </button>

               {/* GLOBAL PACING BAR */}
               <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / (paper.estimatedTime * 60)) * 100}%` }}
                    className={`h-full transition-colors duration-1000 ${
                       (timeLeft / (paper.estimatedTime * 60)) < EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight ? 'bg-rose-600 animate-pulse' :
                       (timeLeft / (paper.estimatedTime * 60)) < (EXAM_RULES.DIFFICULTY_MODEL.STAGES.FINAL.weight + EXAM_RULES.DIFFICULTY_MODEL.STAGES.MID.weight) ? 'bg-amber-500' :
                       'bg-slate-900 dark:bg-white'
                    }`}
                  />
               </div>
            </header>

            <main className="max-w-5xl mx-auto w-full py-12 px-6 pb-40 space-y-24">
               {paper.sections.map((section, sIdx) => {
                 const isSectionA = section.id.includes('sec-a');
                 const timingGuidance = isSectionA ? 'Target: 45–50 minutes' : 'Target: 10–12 minutes';
                 
                 return (
                   <motion.section 
                     key={section.id}
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     viewport={{ once: true }}
                     className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl relative mb-24"
                   >
                     <div className="p-12 border-b-4 border-slate-900 dark:border-white">
                        <div className="flex justify-between items-end mb-6">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest italic">{timingGuidance}</p>
                              <h2 className="text-3xl font-black italic tracking-tighter uppercase">{section.title}</h2>
                           </div>
                           <div className="text-right text-[10px] font-black uppercase text-slate-400">
                               Page {sIdx + 1}
                           </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-x-2 border-slate-200 dark:border-slate-700 font-bold italic text-slate-600 dark:text-slate-400">
                           {section.instructions}
                        </div>
                     </div>

                     {section.passage && (
                       <div className="p-12 bg-slate-50/30 dark:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800">
                          <div className="max-w-3xl mx-auto font-serif text-xl leading-relaxed text-slate-800 dark:text-slate-200 italic">
                            {section.passage}
                          </div>
                       </div>
                     )}

                     <div className="divide-y divide-slate-100 dark:divide-slate-800">
                       {section.questions.map((q) => (
                         <ReadingQuestionRenderer
                           key={q.id}
                           question={q}
                           answers={answers}
                           onChange={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))}
                           disabled={false}
                         />
                       ))}
                     </div>

                     {/* TURN OVER MARKER */}
                     {sIdx < paper.sections.length - 1 && (
                       <div className="p-4 flex justify-end gap-3 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse group">
                          (Turn over for more)
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                       </div>
                     )}
                   </motion.section>
                 );
               })}

               <div className="text-center py-24 space-y-4">
                  <p className="text-[10px] font-black italic uppercase tracking-[1em] text-slate-400">End of Examination</p>
                  <button 
                    onClick={handleFinish} 
                    className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-sm tracking-widest"
                  >
                    Hand In Paper
                  </button>
               </div>
            </main>
          </div>
        );

      case 'marking':
        return (
          <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex items-center justify-center p-12">
            <div className="text-center space-y-8 max-w-md">
              <div className="w-32 h-32 border-[16px] border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Board Moderation...</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing Paper {paper.paperCode}</p>
            </div>
          </div>
        );

      case 'result':
        return attempt ? (
          <ReadingResults 
            attempt={attempt} 
            paper={paper} 
            onRetry={() => { setStep('instructions'); setAnswers({}); }}
            onExit={onExit}
          />
        ) : null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
};