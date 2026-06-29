import { motion } from 'motion/react';
import { BookOpen, Zap, Trophy, Clock, ShieldCheck, Layers } from 'lucide-react';

interface HowItWorksProps {
  language: string;
  isModal?: boolean;
}

export function HowItWorks({ language, isModal = false }: HowItWorksProps) {
  const getLanguageDisplay = (lang: string) => {
    switch(lang) {
      case 'modern': return 'Modern Hebrew';
      case 'biblical': return 'Biblical Hebrew';
      case 'french': return 'French';
      case 'spanish': return 'Spanish';
      case 'german': return 'German';
      case 'arabic': return 'Arabic';
      default: return 'GCSE';
    }
  };
  const languageName = getLanguageDisplay(language);

  const steps = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Exam Board Verified",
      description: `Every word is pulled directly from the ${(language === 'biblical' || language === 'spanish' || language === 'french' || language === 'arabic') ? 'Edexcel' : (language === 'german' || language === 'modern') ? 'AQA' : 'Edexcel and AQA'} specifications—these words will 100% appear in your GCSE exams.`
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Grammar Powerhouse",
      description: "Compatible with all languages. Master complex verb conjugations, case systems (including the BH Vov-Consecutive), and active syntax with AI feedback."
    },
    {
      icon: <Trophy className="w-6 h-6 text-green-500" />,
      title: "Grade 9 Mastery",
      description: "Track your progress and ensure you've mastered every single word required for the highest possible grade."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      title: "Deterministic Marking",
      description: "Our marking engine uses strict exam board rule-centralization (1x90, 1x150, 1xTranslation) to ensure consistent, biased-free grading."
    }
  ];

  const centralizedRules = [
    { label: "Writing", rule: "Fixed 1x90, 1x150, 1xTranslation structure.", icon: <Zap className="w-4 h-4 text-indigo-400" /> },
    { label: "Speaking", rule: "Centralized Prep → Task → Follow-up sequence.", icon: <Zap className="w-4 h-4 text-indigo-400" /> },
    { label: "Reading", rule: "Deterministic paper-level simulation & marking engine.", icon: <Zap className="w-4 h-4 text-indigo-400" /> },
    { label: "Grading", rule: "Unified 40/50/60/70/80/90 percentage boundaries.", icon: <Zap className="w-4 h-4 text-indigo-400" /> },
    { label: "Moderation", rule: "Deterministic 1% borderline uplift logic.", icon: <Zap className="w-4 h-4 text-indigo-400" /> }
  ];

  return (
    <section className={`${isModal ? 'py-4' : 'py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900'} transition-colors duration-300`}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className={`text-center ${isModal ? 'mb-8' : 'mb-16'}`}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Guaranteed {languageName} Exam Success</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Designed specifically for the {languageName} exam boards. 
            Official specification vocabulary, mastered with AI.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${isModal ? 'gap-6 text-center' : 'gap-8'} mb-16`}>
          {steps.map((step, idx) => (
            <motion.div
              key={`how-step-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs font-bold uppercase tracking-tight">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Centralized Rules Subsection - REDESIGNED */}
        <div className="relative overflow-hidden bg-slate-900 dark:bg-black rounded-[2.5rem] p-1 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-rose-500/10 opacity-50" />
          <div className="relative bg-slate-900 dark:bg-black rounded-[2.4rem] p-8 md:p-10 border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Centralized Exam Architecture</h3>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Rule-Based Deterministic Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Guard</span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">Synced</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {centralizedRules.map((rule, idx) => (
                <div key={idx} className="group relative p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all active:scale-95 cursor-default flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {rule.icon}
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">{rule.label}</p>
                    </div>
                    <p className="text-white font-bold leading-snug text-sm">{rule.rule}</p>
                  </div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spaced Repetition Explanation */}
        <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-soft text-left relative overflow-hidden mt-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-[60px]" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Understanding Vocariox SRS</h3>
              <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Science-Backed Neural Pathways</p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
            Spaced Repetition scheduling is proven to dramatically decrease the rate at which you forget information. By timing reviews just as a memory is about to fade, your brain works harder to retrieve it, strengthening the neural pathways forever. Vocariox offers two world-class algorithms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-full text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wider">Default option</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white mt-3 mb-2">Standard (Leitner Container Scheduling)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase leading-relaxed">
                Divides vocabulary cards into five distinct progression boxes. Getting a card correct promotes it to the next box (longer interval), while failing drops it back to Box 1 for immediate practice. Good for standard, simple deck rotations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 relative">
              <span className="px-2.5 py-1 rounded-full text-[9px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider">Recommended choice</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white mt-3 mb-2">Advanced AI Super-Adaptive Queue</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase leading-relaxed">
                Features our custom 4-button review screen corresponding to exact recall effort level: <strong>Forgot, Partial, Effort, or Easy</strong>. It mathematically scales your next review delay dynamically (optimized from 1 minute up to 14 days) to maintain maximum retention efficiency.
              </p>
              <div className="mt-4 pt-3 border-t border-indigo-100/40 dark:border-indigo-900/40 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-[11px] font-extrabold uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5" /> Toggle this inside the settings modal at any time!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
