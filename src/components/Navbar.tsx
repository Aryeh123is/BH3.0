import { motion } from 'motion/react';
import { LogIn, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onNavigate: (view: 'home' | 'dashboard' | 'test') => void;
  language: 'biblical' | 'modern' | 'spanish';
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Navbar({ onNavigate, language, user, onSignIn, onSignOut, theme, onToggleTheme }: NavbarProps) {
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
            {language === 'biblical' ? 'BH' : language === 'modern' ? 'MH' : 'ES'} <span className="text-primary">Keywords</span>
          </span>
          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-widest">
            {language === 'biblical' ? 'Biblical' : language === 'modern' ? 'Modern' : 'Spanish'}
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-6"
        >
          <button 
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => onNavigate('home')}
            className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            Home
          </button>

          <button 
            onClick={() => onNavigate('test')}
            className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            Test Mode
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
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
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
}
