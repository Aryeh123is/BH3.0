import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
}

export function ProgressBar({ current, total, color = 'bg-blue-500' }: ProgressBarProps) {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
