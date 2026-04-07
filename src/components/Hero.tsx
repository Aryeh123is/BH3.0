import { motion } from 'motion/react';
import { Sparkles, Layers, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeroProps {
  onStartSession: () => void;
  onViewDashboard: () => void;
  onStartFlashcards: () => void;
  language: 'biblical' | 'modern' | 'spanish';
  onLanguageChange: (lang: 'biblical' | 'modern' | 'spanish') => void;
  user: User | null;
  onSignIn: () => void;
  devMode?: boolean;
}

export function Hero({ onStartSession, onViewDashboard, onStartFlashcards, language, onLanguageChange, user, onSignIn, devMode = false }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800 flex-wrap justify-center">
            <button
              onClick={() => onLanguageChange('biblical')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                language === 'biblical' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Biblical Hebrew
            </button>
            {devMode && (
              <>
                <button
                  onClick={() => onLanguageChange('modern')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                    language === 'modern' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Modern Hebrew
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-yellow-400 text-slate-900 text-[8px] font-black rounded-md uppercase tracking-tighter shadow-sm">
                    WIP
                  </span>
                </button>
                <button
                  onClick={() => onLanguageChange('spanish')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                    language === 'spanish' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Spanish
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-yellow-400 text-slate-900 text-[8px] font-black rounded-md uppercase tracking-tighter shadow-sm">
                    WIP
                  </span>
                </button>
              </>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            Find the Best <span className="text-primary">Keywords</span> <br /> for Your Essays
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Master {language === 'biblical' ? 'Biblical Hebrew (Edexcel)' : language === 'modern' ? 'Modern Hebrew (AQA)' : 'Spanish (Edexcel)'} vocabulary with our intelligent learning tools. 
            Perfect for students looking to elevate their writing and achieve top grades.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Ready to start studying?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStartSession}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Learn Mode
              </button>
              <button 
                onClick={onViewDashboard}
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                View Dashboard
              </button>
              <button 
                onClick={onStartFlashcards}
                className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none"
              >
                <Layers className="w-5 h-5" />
                Flashcards
              </button>
            </div>
            
            {!user && (
              <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-4">Want to sync your progress across devices?</p>
                <button 
                  onClick={onSignIn}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
