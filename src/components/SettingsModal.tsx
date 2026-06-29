import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Clock, Zap, Trash2, Download, 
  Settings, ChevronRight, AlertTriangle,
  LogOut, Save, RotateCcw, Shield, Star, Sparkles,
  Moon, Sun, Mic, MicOff, Info, Check, Smartphone, Cpu, RefreshCw,
  Volume2, VolumeX
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserPreferences, SRSSettings } from '../types';
import { CacheService } from '../services/cacheService';
import { TTSService } from '../services/ttsService';

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
  onUpgrade?: () => void;
  onShowOnboarding?: () => void;
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
  onToggleTheme,
  onUpgrade,
  onShowOnboarding
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'audio' | 'appearance' | 'srs' | 'data'>('account');
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'checking' | 'granted' | 'denied'>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['es', 'fr', 'de', 'ar', 'he']);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [preMuteVolume, setPreMuteVolume] = useState(() => {
    const vol = preferences.ttsVolume !== undefined ? preferences.ttsVolume : 1.0;
    return vol > 0 ? vol : 1.0;
  });

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getVoicesForLang = (langCode: string) => {
    return voices.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
  };

  const handleVoiceChange = (langCode: string, voiceName: string) => {
    const newPreferredVoices = { ... (preferences.preferredVoices || {}), [langCode]: voiceName };
    onUpdatePreferences({ preferredVoices: newPreferredVoices });
  };

  const testVoice = (langCode: string, voiceName: string) => {
    const voice = voices.find(v => v.name === voiceName);
    if (!voice) return;

    const testTexts: Record<string, string> = {
      es: 'Hola, esta es una prueba de voz en español.',
      fr: 'Bonjour, ceci est un test de voix en français.',
      de: 'Hallo, dies ist ein Sprachtest auf Deutsch.',
      ar: 'مرحباً، هذا اختبار صوتي باللغة العربية.',
      he: 'שלום, זוהי בדיקת קול בעברית.'
    };

    const utterance = new SpeechSynthesisUtterance(testTexts[langCode] || 'Test');
    utterance.voice = voice;
    utterance.lang = voice.lang;
    window.speechSynthesis.speak(utterance);
  };

  const testCloudVoice = async (voiceName: string) => {
    try {
      await TTSService.speak('Hello! This is a test of the Pro cloud neural voices.', 'english', {
        useCloud: true,
        cloudVoiceName: voiceName
      });
    } catch (err) {
      console.error(err);
      alert('Failed to test cloud voice. Ensure you have the Gemini API properly configured for TTS.');
    }
  };

  const testMicrophone = async () => {
    setMicStatus('checking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicStatus('granted');
    } catch (err) {
      console.error('Microphone access denied', err);
      setMicStatus('denied');
    }
  };

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
              onClick={() => setActiveTab('audio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'audio' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Mic className="w-5 h-5" />
              Audio & Speech
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
              Preferences & Theme
            </button>
            <button
              onClick={() => setActiveTab('srs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === 'srs' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Cpu className="w-5 h-5" />
              Spaced Repetition
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
            <button onClick={() => setActiveTab('audio')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'audio' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Audio & Speech</button>
            <button onClick={() => setActiveTab('appearance')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'appearance' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Preferences & Theme</button>
            <button onClick={() => setActiveTab('srs')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'srs' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>SRS</button>
            <button onClick={() => setActiveTab('data')} className={`px-4 py-2 shrink-0 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === 'data' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Data</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
          <div className="hidden md:flex p-6 md:p-10 items-center justify-between border-b border-slate-100 dark:border-slate-800 gap-6 shrink-0">
            <div className="flex justify-between items-center w-full">
              <div>
                <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {activeTab === 'account' ? 'Personal Info' : 
                   activeTab === 'audio' ? 'Voice & Speech' : 
                   activeTab === 'appearance' ? 'Preferences' : 
                   activeTab === 'srs' ? 'Learning Algorithm' : 'Management'}
                </h3>
                <p className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                  {activeTab === 'srs' ? 'Spaced Repetition' : 
                   activeTab === 'audio' ? 'Audio & Speech' : 
                   activeTab === 'appearance' ? 'Preferences & Theme' : activeTab}
                </p>
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

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar relative">
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
                      className="flex-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 dark:text-white"
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

                {user?.email && (
                  <section className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Security & Account</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Update Password</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Receive a secure verification link to safely change or update your account password.</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={async () => {
                          if (!user.email) return;
                          setIsResettingPassword(true);
                          setResetSuccess(null);
                          setResetError(null);
                          try {
                            const { sendPasswordResetEmail, auth } = await import('../firebase');
                            await sendPasswordResetEmail(auth, user.email);
                            setResetSuccess('Check your inbox! We have successfully sent a secure password reset link.');
                          } catch (err: any) {
                            console.error("Password reset error from settings modal:", err);
                            setResetError(err.message || 'Failed to send verification link.');
                          } finally {
                            setIsResettingPassword(false);
                          }
                        }}
                        disabled={isResettingPassword}
                        className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 inline-flex items-center justify-center min-w-[150px]"
                      >
                        {isResettingPassword ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Send Reset Link'}
                      </button>
                    </div>

                    {resetSuccess && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2 text-emerald-600 dark:text-emerald-400 text-xs">
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 font-bold">✓</div>
                          <p className="font-semibold">{resetSuccess}</p>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-slate-900/40 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-emerald-100 dark:border-emerald-950">
                          <p className="font-medium">💡 <strong className="text-slate-700 dark:text-slate-300">Tip:</strong> If the verification email goes to your <strong className="text-slate-700 dark:text-slate-300">Spam/Junk</strong> folder, mark it as <strong className="text-emerald-600 dark:text-emerald-400">"Not Spam"</strong> to guarantee all future reminders and access keys land directly in your primary inbox.</p>
                        </div>
                      </div>
                    )}

                    {resetError && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0 font-extrabold">!</div>
                        <p className="font-medium">{resetError}</p>
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 pb-20">
                 {/* Onboarding Tour Launcher */}
                 {onShowOnboarding && (
                   <section className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] border-2 border-indigo-500/20 space-y-4 relative overflow-hidden">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-650 dark:bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
                         <Sparkles className="w-6 h-6 animate-pulse" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Interactive Tour</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest leading-none mt-1">First-Time Setup Guide</p>
                       </div>
                     </div>
                     <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                       Replay our step-by-step interactive onboarding show. Walk through flashcard keyboard bindings, AI exam conditions, Custom Quizlet structures, and database synchronization.
                     </p>
                     <button
                       onClick={() => {
                         onClose();
                         onShowOnboarding();
                       }}
                       className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:translate-y-[-1px] transition-all shadow-md active:scale-95 cursor-pointer"
                     >
                       🚀 Run Interactive Walkthrough
                     </button>
                   </section>
                 )}
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6 pb-20">
                 {/* Microphone Calibration Section */}
                 <section className="p-8 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[2.5rem] border-2 border-indigo-500/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Mic className="w-32 h-32 rotate-12" />
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Microphone Mastery</h4>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        Persistent Access Protocol
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 italic">
                    To avoid repeated prompts, select <strong>"Always Allow"</strong> in your browser's settings for Vocariox.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 relative z-10 pt-2">
                    <button 
                      onClick={testMicrophone}
                      disabled={micStatus === 'checking'}
                      className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
                        micStatus === 'granted' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                        micStatus === 'denied' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                        'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'
                      }`}
                    >
                      {micStatus === 'checking' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Calibrating...
                        </>
                      ) : micStatus === 'granted' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Access Verified
                        </>
                      ) : micStatus === 'denied' ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          Access Denied
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Test Microphone
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => onUpdatePreferences({ microphoneAlwaysOn: !preferences.microphoneAlwaysOn })}
                      className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 border-2 ${
                        preferences.microphoneAlwaysOn 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      Persistence: {preferences.microphoneAlwaysOn ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex items-start gap-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 relative z-10">
                    <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide leading-relaxed">
                      Pro Tip: On iOS/Safari, add Vocariox to your <strong>Home Screen</strong> to grant native system-level persistent permissions.
                    </div>
                  </div>
                </section>

                {/* Speech Playback Volume Section */}
                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                      {(preferences.ttsVolume || 0) === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Speech Playback Volume</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Adjust the playback volume for all exam papers and flashcards.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          const currentVol = preferences.ttsVolume !== undefined ? preferences.ttsVolume : 1.0;
                          if (currentVol > 0) {
                            setPreMuteVolume(currentVol);
                            onUpdatePreferences({ ttsVolume: 0 });
                          } else {
                            onUpdatePreferences({ ttsVolume: preMuteVolume });
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                        title={(preferences.ttsVolume || 0) === 0 ? "Unmute" : "Mute"}
                      >
                        {(preferences.ttsVolume || 0) === 0 ? (
                          <VolumeX className="w-6 h-6 text-rose-500" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-indigo-600" />
                        )}
                      </button>

                      <div className="flex-1 relative flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={preferences.ttsVolume !== undefined ? preferences.ttsVolume : 1.0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onUpdatePreferences({ ttsVolume: val });
                            if (val > 0) {
                              setPreMuteVolume(val);
                            }
                          }}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      <span className="w-12 text-right text-xs font-black text-slate-700 dark:text-slate-300 font-mono">
                        {Math.round((preferences.ttsVolume !== undefined ? preferences.ttsVolume : 1.0) * 100)}%
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const testPhrase = 'Volume check! Sounds good.';
                          TTSService.speak(testPhrase, 'english', {
                            rate: 1.0,
                            useCloud: preferences.useCloudVoices,
                            cloudVoiceName: preferences.cloudVoices?.['es'] || 'Aoede'
                          });
                        }}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                      >
                        Test Volume
                      </button>
                    </div>
                  </div>
                </section>

                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Examiner Voice Profiles</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Personalise the AI voices for each language.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Pro Cloud Toggle */}
                    <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl border border-indigo-500/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Pro Cloud AI Voices</h5>
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-full">Premium</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-none">Universal Quality Across All Devices</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (userProfile?.isPremium || devMode) {
                              onUpdatePreferences({ useCloudVoices: !preferences.useCloudVoices });
                            } else {
                              onClose();
                              if (onUpgrade) onUpgrade();
                            }
                          }}
                          className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none ${preferences.useCloudVoices ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.useCloudVoices ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      
                      {(!userProfile?.isPremium && !devMode) ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold italic flex-1">Requires Premium. Cloud voices bypass browser limitations for studio-grade audio.</p>
                          {onUpgrade && (
                            <button 
                              onClick={() => {
                                onClose();
                                onUpgrade();
                              }}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] uppercase font-black tracking-widest whitespace-nowrap transition-colors shadow-sm"
                            >
                              Upgrade to Premium
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold italic">Enabled. Vocariox is now using server-side neural synthesis for examiner speech.</p>
                        </div>
                      )}
                    </div>

                    {[
                      { code: 'es', name: 'Spanish', testPhrase: 'Hola, ¿cómo estás?' },
                      { code: 'fr', name: 'French', testPhrase: 'Bonjour, comment allez-vous?' },
                      { code: 'de', name: 'German', testPhrase: 'Hallo, wie geht es dir?' },
                      { code: 'ar', name: 'Arabic', testPhrase: 'مرحبا، كيف حالك؟' },
                      { code: 'he', name: 'Hebrew', testPhrase: 'שלום, מה שלומך?' }
                    ].map(lang => {
                      const langVoices = getVoicesForLang(lang.code);
                      const currentVoiceName = preferences.preferredVoices?.[lang.code];
                      const currentCloudVoice = preferences.cloudVoices?.[lang.code] || 'Aoede';
                      
                      return (
                        <div key={lang.code} className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang.name} Examiner</label>
                          <div className="flex gap-3">
                            {preferences.useCloudVoices ? (
                              <>
                                <select
                                  value={currentCloudVoice}
                                  onChange={(e) => onUpdatePreferences({ 
                                    cloudVoices: { ...preferences.cloudVoices, [lang.code]: e.target.value }
                                  })}
                                  className="flex-1 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 font-bold text-xs text-indigo-900 dark:text-indigo-300 outline-none focus:border-indigo-500 transition-all"
                                >
                                  <option value="Aoede">Aoede (Warm & Harmonious)</option>
                                  <option value="Puck">Puck (Energetic & Dynamic)</option>
                                  <option value="Charon">Charon (Deep & Authoritative)</option>
                                  <option value="Kore">Kore (Calm & Neutral)</option>
                                  <option value="Fenrir">Fenrir (Strong & Clear)</option>
                                </select>
                                <button
                                  onClick={async () => {
                                    try {
                                      await TTSService.speak(lang.testPhrase, lang.code, {
                                        useCloud: true,
                                        cloudVoiceName: currentCloudVoice
                                      });
                                    } catch(err) {
                                      alert('Failed to play cloud voice.');
                                    }
                                  }}
                                  className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
                                  title="Test Cloud Voice"
                                >
                                  <Zap className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <select
                                  value={currentVoiceName || ''}
                                  onChange={(e) => handleVoiceChange(lang.code, e.target.value)}
                                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                                >
                                  <option value="">Default AI Voice</option>
                                  {langVoices.map((v, i) => (
                                    <option key={`${v.name}-${i}`} value={v.name}>
                                      {v.name} {v.localService ? '(Fastest)' : '(Cloud Quality)'}
                                    </option>
                                  ))}
                                </select>
                                {currentVoiceName && (
                                  <button
                                    onClick={() => testVoice(lang.code, currentVoiceName)}
                                    className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl hover:bg-indigo-500/20 transition-colors"
                                    title="Preview Voice"
                                  >
                                    <Zap className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 pb-20">
                <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">Extra Time Allowance</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">Enable 25% extra time for all timed mocks and simulators.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onUpdatePreferences({ extraTime: !preferences.extraTime })}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.extraTime ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      role="switch"
                      aria-checked={preferences.extraTime}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.extraTime ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </section>

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

            {activeTab === 'srs' && (
              <div className="space-y-6 pb-20">
                <section className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-500/20 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Memory Engine</h4>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full">Premium</span>
                      </div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        Science-Based Retention
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Unlock a premium, scientifically proven, cognitive science-based spaced-repetition algorithm using 4 active recall feedback levels (Forgot, Partial, Effort, Easy). Dynamically calculates optimal intervals from 1 minute to 14 days to maximize retention and guarantee long-term mastery.
                  </p>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900 dark:text-white">Advanced SRS Mode</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Use the 4-tier emoji rating system.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (userProfile?.isPremium || devMode) {
                          onUpdateSrsSettings({ advancedMode: !srsSettings.advancedMode });
                        } else {
                          onClose();
                          if (onUpgrade) onUpgrade();
                        }
                      }}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${srsSettings.advancedMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      role="switch"
                      aria-checked={srsSettings.advancedMode}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${srsSettings.advancedMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  {(!userProfile?.isPremium && !devMode) && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                      <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                        This feature requires a Premium subscription. Unlock the Advanced SRS engine to permanently master examination keywords.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6 pb-20">
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Local Site Data</h4>
                  
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Smartphone className="w-8 h-8" />
                      </div>
                      <div>
                        <h5 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Storage Protocol</h5>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {user ? 'Cloud & Local Hybrid' : 'Local-Only (Guest Mode)'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {user 
                        ? "Your progress is synced to the cloud. We also keep a local cache on this device for instant loading and offline exam access."
                        : "You are in Guest Mode. All progress is stored strictly on this device using Browser Site Data. No data is sent to our servers."}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={async () => {
                          const success = await CacheService.initialize();
                          if (success) {
                            alert("Vocariox Cache Protocol optimized. Critical exam datasets and past papers have been prioritized for offline resilience on this device.");
                          } else {
                            alert("Cache initialization failed. Please ensure your browser supports the Cache API.");
                          }
                        }}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Optimize Offline Cache
                      </button>
                      
                      {!user && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wide leading-relaxed">
                            Warning: Clearing your browser's "Site Data" or "Cookies" will permanently delete your Guest progress if you haven't exported it.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pt-6">Progress Tools</h4>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <RotateCcw className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-slate-900 dark:text-white">Reset {language === 'biblical' ? 'Biblical Hebrew (Edexcel)' : language === 'modern' ? 'Modern Hebrew (AQA)' : language === 'spanish' ? 'Spanish (Edexcel)' : language === 'french' ? 'French (Edexcel)' : language === 'german' ? 'German (AQA)' : 'Current Deck'}</h5>
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
