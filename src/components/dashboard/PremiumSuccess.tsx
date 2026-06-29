import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, CheckCircle2, ChevronRight, Sparkles, Star, 
  Crown, ArrowRight, Check, HeartHandshake, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PremiumSuccessProps {
  onGoToDashboard: () => void;
}

export const PremiumSuccess: React.FC<PremiumSuccessProps> = ({ onGoToDashboard }) => {
  useEffect(() => {
    // Elegant Multi-Stage Confetti Celebration
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#4f46e5', '#fbbf24', '#10b981', '#3b82f6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#4f46e5', '#fbbf24', '#10b981', '#3b82f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Gradient Rings */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 p-10 md:p-14 text-center relative z-10"
      >
        {/* Elite Icon with Floating Graphic Aura */}
        <div className="relative w-32 h-32 mx-auto mb-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-amber-400 rounded-[2.5rem] rotate-12 opacity-20 blur-xl animate-pulse" />
          <motion.div 
            animate={{ 
              rotate: [12, 15, 9, 12],
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 border-4 border-white dark:border-slate-900"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          <div className="absolute -bottom-2 right-4 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-white dark:border-slate-900 shadow-lg">
            <Check className="w-5 h-5" strokeWidth={4} />
          </div>
        </div>

        {/* Dynamic Launch Text */}
        <div className="space-y-4 mb-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Payment Processed Successfully</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">Vocariox Premium</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-md font-medium max-w-md mx-auto leading-relaxed">
            Your Success Pathway is now fully authenticated. All premium tools, speaking analyzers, and simulated exams have been initialized.
          </p>
        </div>

        {/* Feature Unlocked Breakdown Display */}
        <div className="text-left space-y-6 py-8 px-8 md:px-10 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Crown className="w-24 h-24 text-indigo-500 rotate-12" />
          </div>
          
          <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Unlocked Student Entitlements
          </h3>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              "Unlimited AI mock GCSE exams",
              "Real-time Gemini Speaking evaluation",
              "Officially curated Edexcel & AQA boundaries",
              "Unlimited streak freezes & custom planners",
              "High-priority server request resources",
              "Full premium study documents shop downloads"
            ].map((f, idx) => (
              <div key={idx} className="flex items-start gap-3.5 text-xs font-black text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" strokeWidth={3} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proceed Action Trigger Row */}
        <div className="space-y-6">
          <button 
            onClick={onGoToDashboard}
            className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-3 group active:scale-95 duration-150"
          >
            <span>Activate Revision Engine</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 font-medium">
             <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Guaranteed Upgrade Verification</span>
             </div>
             <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Support Priority SLA</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
