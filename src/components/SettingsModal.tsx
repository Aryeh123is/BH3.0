import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Clock, Zap, Trash2, Download, 
  Settings, ChevronRight, EyeOff, AlertTriangle,
  LogOut, Save, RotateCcw, Shield, Star, Sparkles,
  Moon, Sun
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserPreferences, SRSSettings } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  user: FirebaseUser | null;
  userProfile: any;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  srsSettings: SRSSettings;
  onUpdateSrsSettings: (settings: Partial<SRSSettings>) => void;
  onUpdateDisplayName: (name: string) => Promise<void>;
  onClearProgress: (lang: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onExportData: () => void;
  onLeaveReview: () => void;
  language: string;
  devMode?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function SettingsModal({
  onClose,
  user,
  userProfile,
  preferences,
  onUpdatePreferences,
  srsSettings,
  onUpdateSrsSettings,
  onUpdateDisplayName,
  onClearProgress,
  onDeleteAccount,
  onExportData,
  onLeaveReview,
  language,
  devMode = false,
  theme,
  onToggleTheme
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'data'>('account');
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const formatTime = (seconds: number = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const handleUpdateName = async () => {
    if (!displayName.trim() || displayName === (userProfile?.displayName || user?.displayName)) return;
    setIsSavingName(true);
    try {
      await onUpdateDisplayName(displayName.trim());
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] md:h-[600px] flex flex-col md:flex-row overflow-hidden lg:h-[700px]"
      >
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-slate-50/50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between md:justify-start md:gap-3 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="hidden md:block space-y-2 mt-auto md:mt-0">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'account' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <User className="w-5 h-5" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'appearance' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Zap className="w-5 h-5" />
              App Features
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'data' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Download className="w-5 h-5" />
              Data & Privacy
            </button>
          </nav>
          
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 pt-6 scrollbar-none -mx-2 px-2 mt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => setActiveTab('account')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Account</button>
            <button onClick={() => setActiveTab('appearance')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'appearance' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Features</button>
            <button onClick={() => setActiveTab('data')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'data' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Data</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
          <div className="hidden md:flex p-6 md:p-10 items-center justify-between border-b border-slate-100 dark:border-slate-800 gap-6 shrink-0">
            <div className="flex justify-between items-center w-full">
              <div>
                <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {activeTab === 'account' ? 'Personal Info' : activeTab === 'appearance' ? 'Preferences' : 'Management'}
                </h3>
                <p className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {activeTab === 'account' && (
              <div className="space-y-8">
                <section className="space-y-4">
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Display Name</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold"
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={isSavingName || displayName === (userProfile?.displayName || user?.displayName)}
                      className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </section>

                <section className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Learning Time</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatTime(userProfile?.totalLearningTime || 0)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-[2rem] border border-orange-100 dark:border-orange-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-xl font-bold">
                      🔥
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Current Streak</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {userProfile?.streak || 0} Days
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Switch between light and dark themes.</p>
                      </div>
                    </div>
                    <button
                      onClick={onToggleTheme}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      role="switch"
                      aria-checked={theme === 'dark'}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </section>

                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Study Animations</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Confetti and sparkles when you finish a session.</p>
                    </div>
                    <button
                      onClick={() => onUpdatePreferences({ animationsEnabled: !preferences.animationsEnabled })}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.animationsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      role="switch"
                      aria-checked={preferences.animationsEnabled}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.animationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </section>

                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Reduced Motion</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Disable "bouncing" interactions and intense transitions.</p>
                    </div>
                    <button
                      onClick={() => onUpdatePreferences({ reducedMotion: !preferences.reducedMotion })}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.reducedMotion ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      role="switch"
                      aria-checked={preferences.reducedMotion}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Progress Tools</h4>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <RotateCcw className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-slate-900 dark:text-white">Reset {language === 'biblical' ? 'Biblical Hebrew' : language === 'modern' ? 'Modern Hebrew' : language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : 'Current Deck'}</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Clear your mastery and starts fresh for this language.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={onLeaveReview}
                    className="w-full flex items-center justify-between p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6 fill-current" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-slate-900 dark:text-white">Leave a Review</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Share your feedback to help us improve.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </section>

                <section className="space-y-4 pt-6">
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Export & Safety</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={onExportData}
                      className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Export My Data
                    </button>
                    {!devMode && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/50 font-bold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </button>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Overlays for confirmation */}
        <AnimatePresence>
          {showResetConfirm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border lg:p-10"
              >
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">Reset Progress?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                  This will permanently clear all your mastery and statistics for <strong>{language}</strong>. This action cannot be undone.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      await onClearProgress(language);
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="w-full py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
                  >
                    Yes, Reset Progress
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border lg:p-10"
              >
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">Delete Account?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                  We'll miss you! This will permanently delete your profile, study history, and all account data.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      await onDeleteAccount();
                      setShowDeleteConfirm(false);
                      onClose();
                    }}
                    className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    Delete Everything
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Keep My Account
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
