import React from 'react';
import { motion } from 'motion/react';
import { 
  ReadingPaper, 
  ReadingAttempt 
} from '../../types/reading';
import { 
  Award, 
  Target, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  LogOut,
  BarChart3,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface ReadingResultsProps {
  attempt: ReadingAttempt;
  paper: ReadingPaper;
  onRetry: () => void;
  onExit: () => void;
}

export const ReadingResults: React.FC<ReadingResultsProps> = ({
  attempt,
  paper,
  onRetry,
  onExit
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto py-12 px-6 space-y-12"
    >
      {/* FINAL RESULTS HEADER */}
      <div className="bg-slate-900 border-[6px] border-slate-900 p-12 text-center relative overflow-hidden rounded-lg">
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-slate-900" />
          </div>
          <p className="text-xs font-black tracking-[0.4em] text-slate-400 uppercase">Examination Statement of Results</p>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-2">GRADE {attempt.grade}</h1>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Moderated by Vocariox AI Examiners</span>
          </div>
        </div>

        {/* BRUTALIST GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border-2 border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Target className="w-5 h-5" />
            <p className="text-[10px] font-black uppercase tracking-widest">Raw Mark Score</p>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {attempt.totalScore} <span className="text-lg text-slate-400">/ {paper.totalMarks}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border-2 border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <BarChart3 className="w-5 h-5" />
            <p className="text-[10px] font-black uppercase tracking-widest">Total Percentage</p>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {Math.round(attempt.percentage)}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border-2 border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Award className="w-5 h-5" />
            <p className="text-[10px] font-black uppercase tracking-widest">Grade Bound</p>
          </div>
          <p className="text-4xl font-black text-indigo-600">
            {attempt.grade}
          </p>
        </div>
      </div>

      {/* ASSESSMENT BREAKDOWN */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-slate-900 dark:text-white" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Assessment Objective Breakdown</h2>
        </div>

        <div className="space-y-4">
          {paper.sections.map((section, sidx) => {
            const sectionResults = attempt.results.filter(r => r.sectionId === section.id);
            const sectionScore = sectionResults.reduce((acc, r) => acc + (r.marksAwarded || 0), 0);
            const sectionTotal = section.questions.reduce((acc, q) => acc + q.marks, 0);

            return (
              <div 
                key={section.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section {String.fromCharCode(65 + sidx)}</p>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{section.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white">{sectionScore} / {sectionTotal}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Marks Awarded</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {sectionResults.map((res, ridx) => {
                    // Helper to find question in section (handles subQuestions)
                    const findQ = () => {
                      for (const mainQ of section.questions) {
                        if (mainQ.id === res.questionId) return mainQ;
                        if (mainQ.subQuestions) {
                          const found = mainQ.subQuestions.find(sq => sq.id === res.questionId);
                          if (found) return found;
                        }
                      }
                      return null;
                    };
                    
                    const q = findQ();
                    if (!q) return null;

                    const isMaxMarks = res.marksAwarded === q.marks;
                    const isPartial = res.marksAwarded! > 0 && res.marksAwarded! < q.marks;

                    return (
                      <div key={`${res.questionId}-${ridx}`} className="flex gap-6 items-start p-4 rounded-xl border border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <div className={`mt-1 shrink-0 ${isMaxMarks ? 'text-emerald-500' : isPartial ? 'text-amber-500' : 'text-rose-500'}`}>
                          {isMaxMarks ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-3">
                           <div className="flex justify-between items-start">
                             <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {q.id}</p>
                               <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{q.prompt}</p>
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{res.marksAwarded} / {q.marks}</span>
                           </div>
                           
                           <div className="space-y-2">
                             <div className="flex gap-2 text-[10px] uppercase font-black">
                               <p className="text-slate-400">Your Answer:</p>
                               <p className="text-slate-900 dark:text-white italic">{res.answer || '(No response supplied)'}</p>
                             </div>
                             {q.acceptedAnswers && q.acceptedAnswers.length > 0 && (
                               <div className="flex gap-2 text-[10px] uppercase font-black">
                                 <p className="text-slate-400">Correct Answer:</p>
                                 <p className="text-emerald-600 italic">{q.acceptedAnswers[0]}</p>
                               </div>
                             )}
                           </div>

                           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-xs font-bold text-slate-500 italic border-l-4 border-slate-200 dark:border-slate-700">
                             <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase mr-2 not-italic">Examiner Note:</span>
                             {res.feedback || (isMaxMarks ? "Deterministic match found. Maximum marks awarded." : "Response did not meet mark schemes requirements.")}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AO ANALYTICS */}
      <div className="bg-slate-900 rounded-lg p-10 text-white space-y-8">
        <div className="flex justify-between items-start">
           <h3 className="text-2xl font-black uppercase tracking-tight">Examiner Moderator Report</h3>
           <ShieldCheck className="w-8 h-8 opacity-50" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-70">
              <Info className="w-4 h-4" />
              Cognitive Performance
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              Candidate demonstrated strong comprehension in literal extraction tasks. Inferential reasoning was consistent across higher-tier extracts. Translation accuracy into English showed good grasp of syntactic nuance and cross-linguistic equivalence.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-70">
              <Zap className="w-4 h-4" />
              Suggested Improvement
            </div>
            <ul className="text-sm font-medium space-y-2 list-disc pl-4 opacity-90">
              <li>Refine idiomatic precision in Section C.</li>
              <li>Focus on identifying subtle negative connotations in Section B.</li>
              <li>Ensure complete sentences in English for short-answer responses.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap gap-4 pt-8 pb-12">
        <button
          onClick={onRetry}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-lg font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform"
        >
          <RotateCcw className="w-5 h-5" />
          Sit Another Paper
        </button>
        <button
          onClick={onExit}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-lg font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform"
        >
          <LogOut className="w-5 h-5" />
          Exit Exam Mode
        </button>
      </div>
    </motion.div>
  );
};
