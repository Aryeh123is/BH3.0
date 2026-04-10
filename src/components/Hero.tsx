import { motion } from 'motion/react';
import { Sparkles, Layers, LogIn, Trophy } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeroProps {
  onStartSession: () => void;
  onViewDashboard: () => void;
  onStartFlashcards: () => void;
  onStartTest: () => void;
  language: 'biblical' | 'modern' | 'spanish';
  onLanguageChange: (lang: 'biblical' | 'modern' | 'spanish') => void;
  user: User | null;
  onSignIn: () => void;
  onShowPro: () => void;
  devMode?: boolean;
}

export function Hero({ onStartSession, onViewDashboard, onStartFlashcards, onStartTest, language, onLanguageChange, user, onSignIn, onShowPro, devMode = false }: HeroProps) {
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
            )}
            <button
              onClick={() => onLanguageChange('spanish')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                language === 'spanish' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Spanish
            </button>
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
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] shadow-soft border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              {user || devMode ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Ready to start studying?</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto font-medium">
                    Choose your preferred learning method and master your vocabulary today.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button 
                      onClick={onStartSession}
                      className="group p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex flex-col items-center text-center gap-4"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Learn Mode</div>
                        <div className="text-xs text-white/70 font-medium mt-1">Spaced repetition learning</div>
                      </div>
                    </button>

                    <button 
                      onClick={onStartFlashcards}
                      className="group p-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center gap-4 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center group-hover:-rotate-12 transition-transform">
                        <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Flashcards</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Quick review session</div>
                      </div>
                    </button>

                    <button 
                      onClick={onStartTest}
                      className="group p-6 bg-primary/10 text-primary border-2 border-primary/20 rounded-[2rem] hover:bg-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Test Mode</div>
                        <div className="text-xs text-primary/60 font-medium mt-1">Challenge your knowledge</div>
                      </div>
                    </button>

                    <button 
                      onClick={onViewDashboard}
                      className="group p-6 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-[2rem] hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center gap-4"
                    >
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center group-hover:translate-y-1 transition-transform">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-black text-lg">Dashboard</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Track your progress</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span>Want to learn even faster?</span>
                    </div>
                    <button 
                      onClick={onShowPro} 
                      className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                    >
                      Check out Pro Features
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full mb-8">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Early Access: Get 50% off Premium
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Supercharge your learning.
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                    Sign in to access your personalized dashboard, smart flashcards, and custom test modes. 
                    Join today to lock in a <span className="text-indigo-600 dark:text-indigo-400 font-bold">50% lifetime discount</span> on all upcoming Pro features.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={onSignIn}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 text-lg"
                    >
                      <LogIn className="w-6 h-6" />
                      Sign in
                    </button>
                    <button 
                      onClick={onShowPro}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-lg"
                    >
                      View Pro Features
                    </button>
                  </div>
                </div>
              )}
            </div>

            

          </div>
        </motion.div>
      </div>
    </section>
  );
}
