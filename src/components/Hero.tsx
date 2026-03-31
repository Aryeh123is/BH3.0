import { motion } from 'motion/react';
import { Sparkles, Layers } from 'lucide-react';

interface HeroProps {
  onStartSession: () => void;
  onViewDashboard: () => void;
  onStartFlashcards: () => void;
  language: 'biblical' | 'modern';
  onLanguageChange: (lang: 'biblical' | 'modern') => void;
}

export function Hero({ onStartSession, onViewDashboard, onStartFlashcards, language, onLanguageChange }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => onLanguageChange('biblical')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                language === 'biblical' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Biblical Hebrew
            </button>
            <button
              onClick={() => onLanguageChange('modern')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                language === 'modern' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Modern Hebrew
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-yellow-400 text-slate-900 text-[8px] font-black rounded-md uppercase tracking-tighter shadow-sm">
                WIP
              </span>
            </button>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Find the Best <span className="text-primary">Keywords</span> <br /> for Your Essays
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
            Master {language === 'biblical' ? 'Biblical' : 'Modern'} Hebrew vocabulary with our intelligent learning tools. 
            Perfect for students looking to elevate their writing and achieve top grades.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-soft border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">Ready to start studying?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStartSession}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Learn Mode
              </button>
              <button 
                onClick={onViewDashboard}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                View Dashboard
              </button>
              <button 
                onClick={onStartFlashcards}
                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                <Layers className="w-5 h-5" />
                Flashcards
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
