import React from 'react';
import { Sparkles, CheckCircle2, Lock, ArrowRight, Zap, Target, BookOpen, Mic, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

interface RoadmapViewProps {
  onSuggestFeature?: () => void;
}

export function RoadmapView({ onSuggestFeature }: RoadmapViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <Sparkles className="w-4 h-4" />
          The Future of Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Premium Roadmap 2026
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          We are building the ultimate AI-powered GCSE revision suite. Explore our upcoming milestone features and what we've already delivered.
        </p>
      </motion.div>

      <div className="relative">
        {/* Continuous track line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-slate-200 dark:to-slate-800 -translate-y-1/2 rounded-full hidden lg:block opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Phase 1: Released */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-500/5 relative group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Released</h3>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Spring Foundation</p>
              </div>
            </div>
            
            <ul className="space-y-4">
              {[
                { icon: Zap, text: 'Smart SRS Vocabulary Engine' },
                { icon: BookOpen, text: 'Past Papers PDF Archive' },
                { icon: Target, text: 'Interactive Reading Exams' },
                { icon: PenTool, text: 'Active Recall Test Mode' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-bold">
                  <item.icon className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Phase 2: Summer 2026 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-500/5 relative group hover:-translate-y-2 transition-transform duration-300 lg:-mt-8"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Released</h3>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Summer 2026</p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                { icon: Mic, text: 'AI Speaking Simulator & Voice Scoring' },
                { icon: Target, text: 'Automated Predicted Grades & Goals' },
                { icon: BookOpen, text: 'Grammar Mastery Workflows' },
                { icon: PenTool, text: 'Writing Examiner AI Line Feedback' },
                { icon: Target, text: 'Interactive Listening Simulations' },
                { icon: Target, text: 'Whole GCSE Exam Roleplay Suite' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-bold">
                  <item.icon className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Phase 3: Autumn 2026 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-amber-200 dark:border-amber-900/40 relative group hover:-translate-y-2 transition-transform duration-300 shadow-lg shadow-amber-500/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Autumn 2026</h3>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">In Development</p>
              </div>
            </div>

            <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
              <li className="flex items-start gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <Lock className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80 text-amber-500 animate-pulse" />
                <span>Custom Vocabulary Decks & Import</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <Lock className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80 text-amber-500 animate-pulse" />
                <span>Interactive Listening Transcripts</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <Lock className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80 text-amber-500 animate-pulse" />
                <span>Deep Literature Set Text Prep</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <Lock className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80 text-amber-500 animate-pulse" />
                <span>Global Multi-Platform App Release</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <Lock className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80 text-amber-500 animate-pulse" />
                <span>Native Pronunciations on All Cards</span>
              </li>
              <li className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-xs font-bold text-amber-500 dark:text-amber-400 italic">
                And loads more including Offline Mode, Student Revision Shop rewards, Expanded Verb Master Playgrounds, and Teacher Analytics!
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {onSuggestFeature && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button 
            onClick={onSuggestFeature}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Suggest a Feature
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
