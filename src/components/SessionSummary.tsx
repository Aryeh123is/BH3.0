import { motion } from 'motion/react';
import { CheckCircle, RefreshCcw, BookOpen } from 'lucide-react';

interface SessionSummaryProps {
  correct: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

export function SessionSummary({ correct, total, onRestart, onHome }: SessionSummaryProps) {
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-soft border border-slate-100 p-12 md:p-16"
      >
        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-10">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Session Complete!</h2>
        <p className="text-slate-500 mb-12 font-medium">You've mastered {correct} out of {total} words in this session.</p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-[0.2em]">Accuracy</p>
            <p className="text-4xl font-extrabold text-primary">{percentage}%</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-[0.2em]">Words</p>
            <p className="text-4xl font-extrabold text-slate-900">{correct}/{total}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onRestart}
            className="w-full py-5 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCcw className="w-5 h-5" /> Start New Session
          </button>
          <button
            onClick={onHome}
            className="w-full py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-5 h-5" /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
