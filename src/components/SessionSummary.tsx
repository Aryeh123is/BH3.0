import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, RefreshCcw, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionSummaryProps {
  correct: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
  animationsEnabled?: boolean;
}

export function SessionSummary({ correct, total, onRestart, onHome, animationsEnabled = true }: SessionSummaryProps) {
  const percentage = Math.round((correct / total) * 100);

  useEffect(() => {
    if (animationsEnabled && percentage >= 70) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [animationsEnabled, percentage]);

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 p-12 md:p-16"
      >
        <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mx-auto mb-10">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Session Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium">You've mastered {correct} out of {total} words in this session.</p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-[0.2em]">Accuracy</p>
            <p className="text-4xl font-extrabold text-primary">{percentage}%</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-[0.2em]">Words</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{correct}/{total}</p>
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
            className="w-full py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-5 h-5" /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
