import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { ReadingExamFlow } from './reading/ReadingExamFlow';
import { ExamEnvironment } from '../types';

interface ReadingExamModeProps {
  language: string;
  onBack: () => void;
  environment?: ExamEnvironment;
}

export function ReadingExamMode({ language, onBack, environment = 'TRAINING' }: ReadingExamModeProps) {
  const [tier, setTier] = useState<'higher' | 'foundation' | null>(null);

  const isBH = language.toLowerCase().includes('biblical');

  if (tier) {
    return (
      <ReadingExamFlow 
        language={language}
        tier={tier}
        environment={environment}
        onExit={() => setTier(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-16 px-6">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100 font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 dark:shadow-none">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight italic">
          {language} <span className="text-emerald-600">{isBH ? 'Unseen' : 'Reading'}</span>
        </h1>
        <div className="flex justify-center items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
          <ShieldCheck className="w-4 h-4" />
          Deterministic Exam Engine v3.8.0
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <button 
          onClick={() => setTier('foundation')}
          className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:scale-[1.02] transition-all text-left shadow-sm group"
        >
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">Tier A</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Foundation</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            Standard GCSE passages focusing on core vocabulary and direct comprehension. Ideal for building exam confidence.
          </p>
        </button>

        <button 
          onClick={() => setTier('higher')}
          className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:scale-[1.02] transition-all text-left shadow-sm group"
        >
          <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">Tier B</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Higher</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            Advanced inferential passages with complex grammatical structures and extended translation tasks for higher grades.
          </p>
        </button>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex gap-6 items-center border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-400 leading-relaxed">
          <span className="text-white">Professional Integrity:</span> In EXAM MODE, papers are selected deterministically from our board-verified dataset. All responses are marked against authentic mark schemes.
        </p>
      </div>
    </div>
  );
}
