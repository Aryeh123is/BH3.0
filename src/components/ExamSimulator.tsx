import React from 'react';
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic, Brain, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { hashDevString } from '../lib/utils';

interface ExamSimulatorProps {
  language: string;
  user: User | null;
  devMode?: boolean;
  onBack: () => void;
  onSelectMode: (mode: 'listening' | 'reading' | 'writing' | 'speaking' | 'unseen') => void;
}

export function ExamSimulator({ language, user, devMode, onBack, onSelectMode }: ExamSimulatorProps) {
  const isAdmin = (user?.email && hashDevString(user.email.toLowerCase()) === '7aa66867') || devMode;

  const handleSelect = (mode: 'listening' | 'reading' | 'writing' | 'speaking' | 'unseen') => {
    // Currently only speaking is implemented, and now reading for Spanish
    if (mode === 'speaking') {
      onSelectMode(mode);
    } else if (mode === 'reading' && language === 'spanish') {
      onSelectMode(mode);
    } else {
      alert("This mode is currently in development and will be available soon!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 relative z-10 pt-6 px-4">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Dashboard</span>
      </button>

      <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2rem] p-8 md:p-12 shadow-2xl mb-8 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <Brain className="w-96 h-96 text-indigo-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 flex items-center gap-1.5">
              <Brain className="w-3 h-3" />
              AI Smart Technology
            </div>
            {!isAdmin && (
              <div className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Admin Mode
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Exam Simulator</span>
          </h1>
          
          <p className="text-slate-400 font-bold text-lg max-w-2xl">
            Choose a mock exam component below to practice. Our AI will grade your responses in real-time according to official criteria.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {language === 'biblical' ? (
          <button 
            onClick={() => handleSelect('unseen')}
            className="text-left w-full p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl group"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Unseen Practice</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
              Tackle unseen texts with AI-guided hints and immediate detailed mark schemes.
            </p>
          </button>
        ) : (
          <>
            <button 
              onClick={() => handleSelect('listening')}
              className="text-left w-full p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                Listening
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                AI-generated native speaker audio with exam-style questions.
              </p>
            </button>

            <button 
              onClick={() => handleSelect('reading')}
              className={`text-left w-full p-6 transition-all hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden ${
                language === 'spanish' 
                  ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 border-purple-200 dark:border-purple-800/50 shadow-purple-500/10' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                Reading
                {language === 'spanish' && (
                  <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Available</span>
                )}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Complex texts mimicking real exam passages with automated marking.
              </p>
            </button>

            <button 
              onClick={() => handleSelect('writing')}
              className="text-left w-full p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Writing</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Submit your essays for instant line-by-line AI corrections.
              </p>
            </button>

            <button 
              onClick={() => handleSelect('speaking')}
              className="text-left w-full p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 transition-all hover:-translate-y-1 hover:shadow-xl shadow-emerald-500/10 group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="relative z-10 text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                Speaking
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Available</span>
              </h3>
              <p className="relative z-10 text-slate-500 dark:text-slate-400 font-bold text-sm">
                Real-time roleplay and photocard discussion with our AI examiner.
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
