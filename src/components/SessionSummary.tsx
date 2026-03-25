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
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-2">Session Complete!</h2>
        <p className="text-gray-500 mb-8">You've mastered {correct} out of {total} words in this session.</p>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Accuracy</p>
            <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Words</p>
            <p className="text-3xl font-bold text-gray-900">{correct}/{total}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCcw className="w-5 h-5" /> Start New Session
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-5 h-5" /> Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
