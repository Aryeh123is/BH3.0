import { motion } from 'motion/react';
import { LogIn, LogOut, User as UserIcon, Moon, Sun, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onNavigate: (view: 'home' | 'dashboard' | 'test') => void;
  language: string;
  user: User | null;
  userProfile?: any;
  onSignIn: () => void;
  onSignOut: () => void;
  onShowPro: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  devMode?: boolean;
  isPremium?: boolean;
}

export function Navbar({ onNavigate, language, user, userProfile, onSignIn, onSignOut, onShowPro, theme, onToggleTheme, devMode = false, isPremium = false }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'biblical' ? 'BH' : language === 'modern' ? 'MH' : language === 'spanish' ? 'ES' : 'Custom'} <span className="text-primary">Keywords</span>
          </span>
          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-widest">
            {language === 'biblical' ? 'Biblical' : language === 'modern' ? 'Modern' : language === 'spanish' ? 'Spanish' : 'Custom Deck'}
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-6"
        >
          {user && userProfile && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-bold text-sm" title={`${userProfile.streak || 1} Day Streak!`}>
              <span>🔥</span>
              <span>{userProfile.streak || 1}</span>
            </div>
          )}

          <button 
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {!isPremium && (
            <button 
              onClick={onShowPro}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro</span>
            </button>
          )}

          {isPremium && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro</span>
            </div>
          )}

          <button 
            onClick={() => onNavigate('home')}
            className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Home
          </button>

          {user || devMode ? (
            <button 
              onClick={() => onNavigate('test')}
              className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Test Mode
            </button>
          ) : null}
          
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">
                  Welcome {user.displayName ? user.displayName.split(' ')[0] : 'User'}
                </span>
              </div>
              <button 
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={onSignIn}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
              <button 
                onClick={devMode ? () => onNavigate('dashboard') : onSignIn}
                className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
              >
                {devMode ? 'Dashboard' : 'Get Started'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
}
