import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, User as UserIcon, Moon, Sun, Sparkles, Flame, Snowflake, ChevronDown, Check, LayoutDashboard } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onNavigate: (view: 'home' | 'dashboard' | 'test') => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  user: User | null;
  userProfile?: any;
  onSignIn: () => void;
  onSignOut: () => void;
  onShowPro: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  devMode?: boolean;
  isPremium?: boolean;
  onShowSettings: () => void;
}

export function Navbar({ onNavigate, language, onLanguageChange, user, userProfile, onSignIn, onSignOut, onShowPro, theme, onToggleTheme, devMode = false, isPremium = false, onShowSettings }: NavbarProps) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { id: 'french', label: 'French (Edexcel)', icon: <img src="https://flagcdn.com/w40/fr.png" alt="FR" className="w-5 h-3.5 object-cover rounded-sm" referrerPolicy="no-referrer" /> },
    { id: 'spanish', label: 'Spanish (Edexcel)', icon: <img src="https://flagcdn.com/w40/es.png" alt="ES" className="w-5 h-3.5 object-cover rounded-sm" referrerPolicy="no-referrer" /> },
    { id: 'biblical', label: 'Biblical Hebrew', icon: '📜' },
    ...(devMode ? [{ id: 'modern', label: 'Modern Hebrew', icon: <img src="https://flagcdn.com/w40/il.png" alt="IL" className="w-5 h-3.5 object-cover rounded-sm" referrerPolicy="no-referrer" /> }] : []),
  ];

  if (language !== 'spanish' && language !== 'biblical' && language !== 'modern' && language !== 'french') {
    languages.push({ id: language, label: 'Custom Deck', icon: '📁' });
  }

  const currentLang = languages.find(l => l.id === language) || languages[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-4 shrink-0"
        >
          <span 
            className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight cursor-pointer shrink-0"
            onClick={() => onNavigate('home')}
          >
            {language === 'biblical' ? 'BH' : language === 'modern' ? 'MH' : language === 'spanish' ? 'ES' : language === 'french' ? 'FR' : 'Custom'} <span className="text-primary hidden xxs:inline">Keywords</span>
          </span>
          
            <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all text-sm font-bold border border-slate-200 dark:border-slate-700 active:scale-95 shadow-sm"
            >
              <span className="text-base sm:text-sm">{currentLang.icon}</span>
              {isLangMenuOpen ? (
                <>
                  <span className="max-w-[100px] truncate">{currentLang.label}</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{currentLang.label}</span>
                </>
              )}
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                >
                  <div className="p-2 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          onLanguageChange(lang.id);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                          language === lang.id 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.icon}</span>
                          <span>{lang.label}</span>
                        </div>
                        {language === lang.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0"
        >
          <button 
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5 shadow-sm" /> : <Sun className="w-5 h-5 shadow-sm" />}
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
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/20" title="Premium Active">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}

          {user || devMode ? (
            <button 
              onClick={() => onNavigate('test')}
              className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Test Mode
            </button>
          ) : null}
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 transition-all duration-300">
                {userProfile === null ? (
                  <>
                    <div className="flex items-center gap-1 text-orange-500/50 font-bold text-[10px] sm:text-xs">
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>-</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px] sm:text-xs" title="Current Streak">
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{userProfile.streak || 0}</span>
                    </div>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => onNavigate('dashboard')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-100 dark:border-slate-700 transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Dashboard
                </span>
              </button>
              
              <button 
                onClick={onShowSettings}
                className="flex items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full border border-slate-100 dark:border-slate-700 transition-colors"
                title="Account Settings"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              <button 
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={onSignIn}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
              <button 
                onClick={devMode ? () => onNavigate('dashboard') : onSignIn}
                className="px-3 sm:px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[11px] sm:text-sm font-black rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shrink-0 uppercase tracking-tight"
              >
                {devMode ? 'Dashboard' : 'Start'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
}
