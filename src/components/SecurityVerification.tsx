import React from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface SecurityVerificationProps {
  reason: string;
  onConfirm?: () => void;
  onSignOut: () => void;
}

export function SecurityVerification({ reason, onConfirm, onSignOut }: SecurityVerificationProps) {
  const isLimit = reason === 'new_device_limit';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 bg-grid-slate-200/[0.05] bg-[bottom_left_-20px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-48 h-48 -rotate-12" />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mb-8">
            <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Security Verification
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8">
            We’re verifying this device to keep your account secure. 
            Confirm it’s you to continue to Vocariox.
          </p>

          <div className="w-full space-y-4 mb-8">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">Check your email</p>
                <p className="text-xs font-bold text-slate-500">We've sent a verification link.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">Identity Confirmation</p>
                <p className="text-xs font-bold text-slate-500">Manual verification may be required.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onConfirm || (() => window.location.reload())}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 mb-4"
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button 
            onClick={onSignOut}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
