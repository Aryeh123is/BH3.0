import React, { useState, Suspense, lazy, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Clock, 
  RotateCw, 
  Layout, 
  Target, 
  History as HistoryIcon,
  Zap,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Mic,
  PenTool,
  Headphones,
  AlertCircle,
  Activity,
  Star,
  ShieldCheck,
  Lock
} from 'lucide-react';

import { User } from 'firebase/auth';
import { AnalyticsService } from '../services/analyticsService';
import { SubscriptionService } from '../services/monetization/subscriptionService';
import { ExamEnvironment, UserPreferences } from '../types';

const ExamDashboard = lazy(() => import('./ExamDashboard').then(m => ({ default: m.ExamDashboard })));
const RetentionDashboard = lazy(() => import('./dashboard/Dashboard').then(m => ({ default: m.Dashboard })));

interface ExamSimulatorProps {
  language: string;
  user: User | null;
  devMode?: boolean;
  onBack: () => void;
  onSelectMode: (mode: string, examMode?: 'practice' | 'test' | 'full', topic?: string, environment?: ExamEnvironment) => void;
  preferences?: UserPreferences;
  userProfile?: any;
  onOpenSettings?: () => void;
  onUpgrade?: () => void;
  onBlockPremiumFeature?: (featureName: string, description: string) => void;
}

export function ExamSimulator({ language, user, onBack, onSelectMode, preferences, userProfile, onOpenSettings, onUpgrade, onBlockPremiumFeature, devMode }: ExamSimulatorProps) {
  if (language === 'arabic' || language === 'german') {
    const isArabic = language === 'arabic';
    const langName = isArabic ? 'Arabic' : 'German';
    const examBoard = isArabic ? 'Pearson Edexcel' : 'AQA';

    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glowing gradient path */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Work in progress Icon badge */}
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 rounded-3xl flex items-center justify-center mb-8 shadow-md">
              <Sparkles className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-pulse" />
            </div>

            {/* Custom Brand Tag */}
            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6">
              Development Phase
            </span>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase">
              Simulator <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-indigo-600">{langName} 2.0</span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl mb-8 leading-relaxed">
              The {langName} GCSE Exam Simulator is currently locked. 
              Our team is actively calibrating listening scripts and generating authentic mark schemes that align exactly with the {examBoard} standards.
            </p>

            {/* Realistic Roadmap/Teasers */}
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-6 text-left space-y-4 mb-10">
              <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Scheduled Releases</h4>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed GCSE Writing Prompts & Examiners</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                <p className="text-xs font-semibold text-slate-500">Full Listening Mock Audio Clips & Transcripts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                <p className="text-xs font-semibold text-slate-500">AI-Powered Roleplay Speech Calibration</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg active:translate-y-0.5 cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'selection' | 'dashboard' | 'retention'>('selection');
  const [environment, setEnvironment] = useState<ExamEnvironment>('TRAINING');
  
  const weakestTopics = useMemo(() => AnalyticsService.getWeakestTopics(1), []);
  const status = useMemo(() => SubscriptionService.getStatus(userProfile), [userProfile]);

  const modes = [
    {
      id: 'listening',
      name: 'Listening',
      icon: <Headphones className="w-6 h-6" />,
      color: 'bg-blue-500',
      desc: 'Comprehension drills focusing on key auditory triggers.'
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-indigo-500',
      desc: 'Authentic exam passages with automated mark schemes.'
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-purple-500',
      desc: 'Directed writing and translation tasks for all tiers.'
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-emerald-500',
      desc: 'Photo cards and roleplays with AI speech analysis.'
    }
  ];

  const isBH = language === 'biblical';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Overlay for Subscription */}
      <div className="flex justify-end mb-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all ${
          (status.tier === 'PREMIUM' || devMode) ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-amber-200/50' :
          'bg-slate-100 border-slate-300 text-slate-500'
        }`}>
          <Star className={`w-3 h-3 ${(status.isPremium || devMode) ? 'fill-current' : ''}`} />
          {devMode ? 'DEV (PREMIUM)' : status.tier} ACCESS {(status.isEarlyAdopter || devMode) && '• FOUNDER'}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-black text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Simulator <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">2.0</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-lg max-w-xl">
            {(status.tier === 'PREMIUM' || devMode) 
              ? 'Premium Grade Improvement System active. Deep examiner insights and unlimited-style practice enabled.' 
              : 'Revision Discovery mode active. Start your journey towards your target GCSE grade.'}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
          <button 
            onClick={() => setEnvironment('TRAINING')}
            className={`px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest ${environment === 'TRAINING' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Activity className="w-3 h-3" />
            Training
          </button>
          <button 
            onClick={() => setEnvironment('EXAM')}
            className={`px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest ${environment === 'EXAM' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShieldCheck className="w-3 h-3" />
            Exam
          </button>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
          <button 
            onClick={() => setActiveTab('selection')}
            className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all uppercase tracking-widest ${activeTab === 'selection' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Zap className="w-4 h-4" />
            Exams
          </button>
          <button 
            onClick={() => {
              if (status.tier === 'PREMIUM' || devMode) {
                setActiveTab('retention');
              } else {
                if (onBlockPremiumFeature) {
                  onBlockPremiumFeature(
                    "Daily Active Missions & Rewards",
                    "Connect your targets directly to active daily missions! Track XP multipliers, claim custom exam rewards, and unlock prioritized diagnostic review schedules."
                  );
                } else if (onUpgrade) {
                  onUpgrade();
                }
              }
            }}
            className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all uppercase tracking-widest ${activeTab === 'retention' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Activity className="w-4 h-4" />
            Missions
            {(status.tier !== 'PREMIUM' && !devMode) && <Lock className="w-3.5 h-3.5 text-amber-500 fill-amber-500/15" />}
          </button>
          <button 
            onClick={() => {
              if (status.tier === 'PREMIUM' || devMode) {
                setActiveTab('dashboard');
              } else {
                if (onBlockPremiumFeature) {
                  onBlockPremiumFeature(
                    "Full Predictive Simulator Analytics",
                    "Predictive GCSE Grade boundaries require premium processing to safely measure progress, monitor weakest topics, and calibrate real-time performance indicators."
                  );
                } else if (onUpgrade) {
                  onUpgrade();
                }
              }
            }}
            className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
            {(status.tier !== 'PREMIUM' && !devMode) && <Lock className="w-3.5 h-3.5 text-amber-500 fill-amber-500/15" />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'retention' ? (
          (status.tier !== 'PREMIUM' && !devMode) ? (
            <motion.div 
              key="retention_locked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-10 md:p-14 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-xl shadow-indigo-500/5 my-12"
            >
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/30 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">Daily Missions Locked</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-10 max-w-lg mx-auto leading-relaxed">
                Connect your targets directly to active daily missions! Track XP multipliers, claim custom exam rewards, and unlock prioritized diagnostic review schedules by upgrading to Premium.
              </p>
              <button 
                onClick={onUpgrade}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Unlock Premium Pathways
              </button>
            </motion.div>
          ) : (
            <Suspense fallback={<div className="flex items-center justify-center p-20"><RotateCw className="w-12 h-12 text-indigo-500 animate-spin" /></div>}>
              <RetentionDashboard 
                language={language} 
                onStartSession={onBack}
                onStartExam={(type, mode) => onSelectMode(type, mode, undefined, environment)}
                onNavigate={(view) => {
                  if (view === 'grammarMastery') {
                    onSelectMode('writing', 'practice', undefined, environment);
                  }
                }}
              />
            </Suspense>
          )
        ) : activeTab === 'selection' ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {/* Environmental & Disability Accommodation Info Board */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-205 dark:border-slate-800 space-y-4">
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      environment === 'TRAINING' ? 'bg-indigo-505 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'bg-rose-505 text-rose-600 dark:text-rose-400 bg-rose-500/10'
                    }`}>
                      {environment === 'TRAINING' ? 'Training Mode Active' : 'Exam Mode Active'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <h4 className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1">
                      {environment === 'TRAINING' ? 'Practice & Learn' : 'True Assessment'} Environment
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {environment === 'TRAINING' ? (
                      <span><strong>Training Mode:</strong> Optimized for active learning. Listening audio clips can be replayed infinitely. Immediate audio transcripts, vocab definitions, and step-by-step grammatical guides are fully visible to help you study.</span>
                    ) : (
                      <span><strong>Exam Mode:</strong> Simulates strict GCSE exam room conditions. Audio clips are strictly locked after 2 play counts. Help hints, text transcript files, and spelling helper loops are locked until you submit.</span>
                    )}
                  </p>
                </div>

                <div className="hidden lg:block h-12 w-px bg-slate-200 dark:bg-slate-700/60" />

                <div className="flex items-start gap-3 max-w-sm shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    preferences?.extraTime ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                      Exam Extra Time
                      {preferences?.extraTime && (
                        <span className="text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md">25% EXTRA</span>
                      )}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-bold">
                      {preferences?.extraTime ? (
                        <span className="text-amber-600 dark:text-amber-400">Your 25% Extra Time allowance is globally active for all simulation countdown timers.</span>
                      ) : (
                        <span>Need extra time? Go to <strong>User Settings</strong> (Flag menu &gt; Cog wheel &gt; Preferences) and check <strong>25% Extra Time</strong> to apply globally.</span>
                      )}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {!isBH && (
              <>
                {/* Quick Practice Mode Card - Featured */}
                <div className="md:col-span-2 lg:col-span-2 p-[1px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/10">
                  <div className="h-full bg-white dark:bg-slate-900 rounded-[1.45rem] p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-200">Recommended</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter leading-tight">Full Mock Simulation</h3>
                    <p className="text-slate-500 font-bold text-lg mb-12 italic leading-relaxed max-w-xl">
                      The complete AQA & Edexcel experience. Includes Roleplay, Photo Card, and General Conversation with precision tracking and academic feedback.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => onSelectMode('reading', 'practice', undefined, environment)}
                        className="flex-1 py-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-100 active:translate-y-0.5 transition-all text-[11px] uppercase tracking-widest border border-slate-200 dark:border-slate-700"
                      >
                        Targeted Drills
                      </button>
                      <button 
                        onClick={() => onSelectMode('reading', 'full', undefined, environment)}
                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:translate-y-0.5 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        Start Full Simulation
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weakness Drill Card */}
                {weakestTopics.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-1 lg:col-span-1 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex flex-col justify-between shadow-xl shadow-slate-200/40 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <AlertCircle className="w-20 h-20 text-rose-600" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-rose-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-10 shadow-sm border border-rose-100">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Focus Drill</h3>
                      <p className="text-xs font-bold text-slate-500 mb-6 italic">Master: {weakestTopics[0].topic}</p>
                    </div>
                    <button 
                      onClick={() => onSelectMode('reading', 'practice', weakestTopics[0].topic, environment)}
                      className="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-xs shadow-lg shadow-rose-200 hover:bg-rose-700 active:translate-y-0.5 transition-all uppercase tracking-widest relative z-10"
                    >
                      Start Drill
                    </button>
                  </motion.div>
                )}

                {/* Standard Component Selection */}
                {modes.map((mode, idx) => (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onSelectMode(mode.id, 'practice', undefined, environment)}
                    className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all text-left relative overflow-hidden"
                  >
                    <div className={`w-14 h-14 ${mode.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-${mode.color.split('-')[1]}-500/20`}>
                      {mode.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{mode.name}</h3>
                    <p className="text-sm text-slate-500 font-bold mb-10 italic leading-relaxed">{mode.desc}</p>
                    <div className="flex items-center text-indigo-600 font-extrabold text-[10px] gap-2 group-hover:gap-3 transition-all uppercase tracking-widest mt-auto">
                      Run Simulator
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))}

                {/* Neural Audio Promo Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`md:col-span-2 lg:col-span-2 p-8 rounded-3xl border-2 border-dashed flex flex-col justify-between transition-all ${
                    preferences?.useCloudVoices 
                      ? 'bg-indigo-500/5 border-indigo-500/30' 
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${preferences?.useCloudVoices ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      {preferences?.useCloudVoices && (
                        <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">Neural Active</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Pro Cloud AI Voices</h3>
                    <p className="text-sm text-slate-500 font-bold mb-6 italic leading-relaxed">
                      {preferences?.useCloudVoices 
                        ? "Currently utilizing high-fidelity server-side neural synthesis for examiner speech. Universal studio quality across all browsers."
                        : "Universal high-fidelity examiner audio via our Pro Cloud Neural Engine. Consistent studio quality on any device."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                      {userProfile?.isPremium ? "Ready for use" : "Requires Premium"}
                    </div>
                    <button 
                      onClick={() => {
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      Configure Audio
                    </button>
                  </div>
                </motion.div>
              </>
            )}

            {isBH && (
              <>
                {/* Unseen Practice Card */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectMode('reading', 'practice', undefined, environment)}
                   className="md:col-span-2 lg:col-span-2 group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all text-left relative overflow-hidden h-full flex flex-col justify-between"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-32 h-32 text-indigo-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-lg shadow-indigo-500/10">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">Unseen Practice</h3>
                    <p className="text-slate-500 font-bold text-lg mb-6 italic leading-relaxed max-w-xl">
                      Master authentic Tanakh passages and archaeological texts. Practice translation, analysis, and linguistic commentary.
                    </p>
                  </div>
                  <div className="flex items-center text-indigo-600 font-black text-[11px] gap-2 group-hover:gap-3 transition-all uppercase tracking-[0.2em]">
                    Start Translation Drill
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>

                {/* Set Text Practice Card */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => onSelectMode('setText', 'practice')}
                  className="md:col-span-2 lg:col-span-2 group p-8 bg-indigo-600 rounded-3xl border border-indigo-500 shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all text-left relative overflow-hidden h-full flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-32 h-32 text-white" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Set Text Practice</h3>
                    <p className="text-indigo-100 font-bold mb-6 italic leading-relaxed max-w-xl">
                      Comprehensive mastery of Genesis 41-43 and 2 Kings 4-7. Learn every word and commentary for the Tanakh Literature specification.
                    </p>
                  </div>

                  <div className="flex items-center text-white font-black text-[11px] gap-2 group-hover:gap-3 transition-all uppercase tracking-[0.2em] relative z-10">
                    Open Practice Suite
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          (status.tier !== 'PREMIUM' && !devMode) ? (
            <motion.div 
              key="analytics_locked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-10 md:p-14 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-xl shadow-indigo-500/5 my-12"
            >
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">Simulator Analytics Locked</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-10 max-w-lg mx-auto leading-relaxed">
                Predictive GCSE Grade boundaries require premium processing to safely measure progress, monitor weakest topics, and calibrate real-time performance indicators against national datasets.
              </p>
              <button 
                onClick={onUpgrade}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Access Premium Analytics
              </button>
            </motion.div>
          ) : (
            <Suspense fallback={<div className="flex items-center justify-center p-20"><RotateCw className="w-12 h-12 text-indigo-500 animate-spin" /></div>}>
              <ExamDashboard 
                onStartExam={(type, mode) => onSelectMode(type, mode, undefined, environment)} 
                onStartDrill={(topic) => {
                  onSelectMode('reading', 'practice', topic, environment);
                }}
              />
            </Suspense>
          )
        )}
      </AnimatePresence>

      {preferences?.extraTime && (
        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-black text-amber-900 dark:text-amber-400 mb-1 tracking-tight">Extra Time Enabled</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
              All simulations automatically apply your 25% extra time allowance as per your account preferences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
