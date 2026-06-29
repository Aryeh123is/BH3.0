import { useState, useMemo, useEffect } from 'react';
import { Word, UserProgress, CustomDeck, SRSSettings } from '../types';
import { UserProgress as GlobalProgress } from '../types/retention';
import { ProgressService } from '../services/user/progressService';
import { UserPaperResult, GlobalAnalytics, SubjectAnalytics } from '../types/pastPapers';
import { Play, Book, Trophy, Search, RotateCw, CloudCheck, CloudOff, Calendar, Plus, Upload, Trash2, Settings2, Save, Snowflake, Share2, Flame, User as UserIcon, Sparkles, ShoppingCart, CheckCircle2, Brain, Headphones, PenTool, Mic, Lock, BookOpen, ExternalLink, GraduationCap, Zap, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressBar } from './ProgressBar';
import { ProgressChart } from './ProgressChart';
import { ProgressionService } from '../services/progressionService';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { CreateDeckModal } from './CreateDeckModal';
import { QuizletImportModal } from './QuizletImportModal';
import { AddCardModal } from './AddCardModal';
import { getForeignWord, hashDevString, getDuplicateKeyWarning } from '../lib/utils';
import { PREDEFINED_EXAMS, SavedCountdownSettings } from './ExamCountdown';

interface DashboardProps {
  vocabulary: Word[];
  progress: UserProgress[];
  onStartSession: () => void;
  onStartIncorrectSession: () => void;
  onStartFlashcards: (topic?: string | any) => void;
  onStartTest: () => void;
  onNavigate: (view: 'home' | 'dashboard' | 'test' | 'shop' | 'pastPapers' | 'grammarMastery' | 'speakingMode' | 'examSimulator' | 'verbMaster' | 'setTextStudy' | 'roadmap' | 'examCountdown') => void;
  onResetProgress: () => void;
  user: User | null;
  userProfile?: any;
  language?: string;
  onLanguageChange: (lang: string) => void;
  onShowPro: () => void;
  devMode?: boolean;
  isPremium?: boolean;
  customDecks: CustomDeck[];
  srsSettings: SRSSettings;
  onUpdateSrsSettings: (settings: SRSSettings) => void;
  reducedMotion?: boolean;
  onLeaveReview?: () => void;
  onShowSettings: () => void;
  shopUnlocked?: boolean;
  onUnlockShop?: () => void;
  onStartGrammarMastery?: () => void;
  onSelectExamMode?: (mode: string) => void;
  paperResults: UserPaperResult[];
  targetGrades: Record<string, string>;
  onUpdateTargetGrade: (subject: string, grade: string) => void;
  isMobile?: boolean;
  countdownSettings?: SavedCountdownSettings;
  onBlockPremiumFeature?: (featureName: string, description: string) => void;
}

export function Dashboard({ vocabulary, progress, onStartSession, onStartIncorrectSession, onStartFlashcards, onStartTest, onNavigate, onResetProgress, user, userProfile, language = 'biblical', onLanguageChange, onShowPro, devMode = false, isPremium = false, customDecks, srsSettings, onUpdateSrsSettings, reducedMotion = false, onLeaveReview, onShowSettings, shopUnlocked = false, onUnlockShop, onStartGrammarMastery, onSelectExamMode, paperResults, targetGrades, onUpdateTargetGrade, isMobile = false, countdownSettings, onBlockPremiumFeature }: DashboardProps) {
  const [globalProgress, setGlobalProgress] = useState<GlobalProgress>(ProgressService.getProgress());

  useEffect(() => {
    // Refresh global progress when component mounts
    setGlobalProgress(ProgressService.getProgress());
    
    // Audit for duplicate IDs in dev mode
    if (process.env.NODE_ENV === 'development') {
      const vocabDuplicates = getDuplicateKeyWarning(vocabulary, w => w.id);
      if (vocabDuplicates.length > 0) {
        console.warn('Dashboard: Detected duplicate vocabulary IDs:', vocabDuplicates);
      }
      
      const deckDuplicates = getDuplicateKeyWarning(customDecks, d => d.id);
      if (deckDuplicates.length > 0) {
        console.warn('Dashboard: Detected duplicate custom deck IDs:', deckDuplicates);
      }
    }
  }, [vocabulary, customDecks]);

  const safeProgress = Array.isArray(progress) ? progress : [];
  const safePaperResults = Array.isArray(paperResults) ? paperResults : [];
  const [showTargetSettings, setShowTargetSettings] = useState(false);

  const paperAnalytics = useMemo(() => ProgressionService.calculateAnalytics(safePaperResults, targetGrades), [safePaperResults, targetGrades]);

  const SPECIFICATION_LINKS: Record<string, string> = {
    'biblical': 'https://qualifications.pearson.com/content/dam/pdf/GCSE/biblical-hebrew/2018/Specification%20and%20Sample%20Assessment%20Material/specification-gcse-l1-l2-in-biblical-hebrew1.pdf',
    'modern': 'https://cdn.sanity.io/files/p28bar15/green/6edb3c7b91a790f679f11f35f2a63022c3c7bf2d.pdf?_gl=1*1d9oc2n*_gcl_au*MTAyNTAwNjc2OS4xNzc2NDI5MTk0',
    'spanish': 'https://cdn.sanity.io/files/p28bar15/green/6214ce31f0fb10cda99ccad8904bee9335ccff07.pdf?_gl=1*vm5i8q*_gcl_au*MTAyNTAwNjc2OS4xNzc2NDI5MTk0',
    'french': 'https://cdn.sanity.io/files/p28bar15/green/2ecb565e388d72deda93e71cd52d2a58e75d8727.pdf?_gl=1*gobmd9*_gcl_au*MTAyNTAwNjc2OS4xNzc2NDI5MTk0',
    'german': 'https://cdn.sanity.io/files/p28bar15/green/3dfd1f6a05293b67b950b4b2a6dcd35262c7d25d.pdf?_gl=1*gobmd9*_gcl_au*MTAyNTAwNjc2OS4xNzc2NDI5MTk0',
    'arabic': 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Arabic/2017/specification-and-sample-assessments/Specification-GCSE-L1-L2-in-Arabic.pdf'
  };

  const EXAM_DATES: Record<string, { date: string; name: string }[]> = {
    'biblical': [
      { date: '2026-06-15T09:00:00', name: 'Paper 1: Language' },
      { date: '2026-06-22T09:00:00', name: 'Paper 2: Literature' }
    ],
    'modern': [
      { date: '2026-06-10T09:00:00', name: 'Listening & Reading' },
      { date: '2026-06-17T09:00:00', name: 'Writing' }
    ],
    'spanish': [
      { date: '2026-05-20T09:00:00', name: 'Listening & Reading' },
      { date: '2026-06-05T09:00:00', name: 'Writing' }
    ],
    'french': [
      { date: '2026-05-22T09:00:00', name: 'Listening & Reading' },
      { date: '2026-06-08T09:00:00', name: 'Writing' }
    ],
    'german': [
      { date: '2026-05-25T09:00:00', name: 'Listening & Reading' },
      { date: '2026-06-12T09:00:00', name: 'Writing' }
    ],
    'arabic': [
      { date: '2026-05-27T09:00:00', name: 'Listening & Reading' },
      { date: '2026-06-16T09:00:00', name: 'Writing' }
    ]
  };

  /**
   * MAINTENANCE NOTE: To update for future years (e.g., 2027), simply update the EXAM_DATES 
   * object above with the new ISO strings. The countdown will automatically pick up 
   * the nearest future date.
   */

  const countdown = useMemo(() => {
    const now = Date.now();
    let nextExam: { date: string; name: string } | null = null;
    
    // Check if user has personalized countdown timers
    if (countdownSettings && (countdownSettings.selectedExamIds.length > 0 || countdownSettings.customExams.length > 0)) {
      // Build selected exams list
      const predefinedChosen = PREDEFINED_EXAMS.filter(exam => 
        countdownSettings.selectedExamIds.includes(exam.id)
      );
      const allChosen = [...predefinedChosen, ...countdownSettings.customExams];
      
      // Sort and get nearest upcoming
      const upcoming = allChosen
        .filter(exam => new Date(exam.date).getTime() > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
      if (upcoming.length > 0) {
        nextExam = {
          date: upcoming[0].date,
          name: `GCSE ${upcoming[0].subject} - ${upcoming[0].paperName}`
        };
      }
    }
    
    // Fallback to default language schedule
    if (!nextExam) {
      const dates = EXAM_DATES[language];
      if (!dates) return null;
      const nearestDefault = dates.find(d => new Date(d.date).getTime() > now);
      if (nearestDefault) {
        nextExam = {
          date: nearestDefault.date,
          name: nearestDefault.name
        };
      }
    }
    
    if (!nextExam) return null;
    
    const diff = new Date(nextExam.date).getTime() - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 365) return null; 

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { days, hours, name: nextExam.name };
  }, [language, countdownSettings]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'decks' | 'srs'>('overview');
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showImportDeck, setShowImportDeck] = useState(false);
  const [addingCardToDeck, setAddingCardToDeck] = useState<CustomDeck | null>(null);
  const [sharingDeckId, setSharingDeckId] = useState<string | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);
  const [shopClickCount, setShopClickCount] = useState(0);

  const handleShopClick = () => {
    if (shopUnlocked) {
      onNavigate?.('shop');
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger the button click
    const newCount = shopClickCount + 1;
    setShopClickCount(newCount);
    
    if (newCount >= 5) {
      onUnlockShop?.();
      setShopClickCount(0);
      onNavigate?.('shop');
    }
  };

  const handleShareDeck = async (deck: CustomDeck) => {
    if (!user) return;
    setSharingDeckId(deck.id);
    try {
      const sharedDeckRef = await addDoc(collection(db, 'sharedDecks'), {
        title: deck.title,
        description: deck.description || '',
        words: deck.words,
        createdAt: Date.now(),
        authorId: user.uid
      });
      
      const shareUrl = `${window.location.origin}?deck=${sharedDeckRef.id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard! Anyone with this link can view and import your deck.');
    } catch (error) {
      console.error("Error sharing deck:", error);
      alert("Failed to generate share link. Please try again.");
    } finally {
      setSharingDeckId(null);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'decks', deckId));
        if (language === deckId) {
          onLanguageChange('biblical'); // Fallback if deleting active deck
        }
      } catch (error) {
        console.error("Error deleting deck:", error);
        alert("Failed to delete deck. Please try again.");
      }
    }
  };

  const stats = useMemo(() => {
    const mastered = safeProgress.filter(p => p.mastery === 'mastered').length;
    const learning = safeProgress.filter(p => p.mastery === 'learning').length;
    const total = vocabulary.length;
    
    const nowTime = Date.now();
    const due = safeProgress.filter(p => p.nextReview <= nowTime).length + (vocabulary.length - safeProgress.length);

    const cats = Array.from(new Set(vocabulary.map(w => w.category))).sort();

    const filtered = vocabulary.filter(word => {
      const wordProgress = progress.find(p => p.wordId === word.id);
      const status = wordProgress?.mastery || 'new';

      const matchesSearch = word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getForeignWord(word, language).includes(searchQuery) ||
        word.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayRev = safeProgress.filter(p => {
      if (!p.lastStudied) return false;
      const studyDate = new Date(p.lastStudied);
      studyDate.setHours(0, 0, 0, 0);
      return studyDate.getTime() === now.getTime();
    }).length;

    return {
      masteredCount: mastered,
      learningCount: learning,
      totalCount: total,
      dueCount: due,
      categories: cats,
      filteredVocabulary: filtered,
      todayReviews: todayRev
    };
  }, [vocabulary, progress, searchQuery, statusFilter, categoryFilter, language]);

  const { masteredCount, learningCount, totalCount, dueCount, categories, filteredVocabulary, todayReviews } = stats;

  const analytics = useMemo(() => {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    
    const difficultWords = [...progress]
      .filter(p => p.incorrectCount > 0)
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, 5)
      .map(p => {
        const word = vocabulary.find(w => w.id === p.wordId);
        return { ...p, word };
      })
      .filter(p => p.word);

    progress.forEach(p => {
      totalCorrect += p.correctCount || 0;
      totalIncorrect += p.incorrectCount || 0;
    });

    const retentionRate = totalCorrect + totalIncorrect > 0 
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
      : 0;

    // Generate heatmap data (last 12 weeks = 84 days)
    const days = 84;
    const heatmapData = new Array(days).fill(0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    progress.forEach(p => {
      if (!p.lastStudied) return;
      const studyDate = new Date(p.lastStudied);
      studyDate.setHours(0, 0, 0, 0);
      const diffTime = now.getTime() - studyDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < days) {
        heatmapData[days - 1 - diffDays] += 1;
      }
    });

    return { retentionRate, difficultWords, totalReviews: totalCorrect + totalIncorrect, heatmapData };
  }, [progress, vocabulary]);

  return (
    <div className={isMobile ? "px-3 py-4 pt-16" : "max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 pt-24 sm:pt-8 md:pt-12"}>
      {countdown && (
        <div 
          onClick={() => onNavigate('examCountdown')}
          className={`mb-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 dark:from-red-500/20 dark:via-orange-500/20 dark:to-amber-500/20 border border-orange-200/50 dark:border-orange-500/30 flex flex-col md:flex-row items-center justify-between relative overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000 cursor-pointer hover:scale-[1.005] hover:shadow-md active:scale-95 transition-all ${
            isMobile ? 'p-3 rounded-2xl gap-3' : 'p-6 rounded-[2rem] gap-6'
          }`}
        >
          <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-6'} relative z-10`}>
            <div className={`bg-white/20 dark:bg-black/20 flex items-center justify-center border border-white/30 dark:border-white/10 shadow-xl group ${
              isMobile ? 'w-10 h-10 rounded-xl' : 'w-16 h-16 rounded-2xl'
            }`}>
              <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-8 h-8'} text-orange-600 dark:text-orange-400`} />
            </div>
            <div>
              <h3 className={`${isMobile ? 'text-sm font-bold' : 'text-xl font-black'} text-slate-900 dark:text-white tracking-tight`}>GCSE Countdown</h3>
              <p className={`${isMobile ? 'text-[9px]' : 'text-sm'} font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest`}>{countdown.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center gap-1 bg-white/50 dark:bg-black/30 px-2.5 py-1 rounded-xl border border-white/20">
              <span className={`font-black text-slate-900 dark:text-white ${isMobile ? 'text-lg' : 'text-4xl'}`}>{countdown.days}</span>
              <span className="text-[9px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">d</span>
            </div>
            <div className="text-xl font-black text-slate-300 dark:text-slate-700">:</div>
            <div className="flex items-center gap-1 bg-white/50 dark:bg-black/30 px-2.5 py-1 rounded-xl border border-white/20">
              <span className={`font-black text-slate-900 dark:text-white ${isMobile ? 'text-lg' : 'text-4xl'}`}>{countdown.hours}</span>
              <span className="text-[9px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">h</span>
            </div>
            {!isMobile && (
              <div className="ml-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-orange-950 shadow-soft font-black text-slate-900 dark:text-white text-sm">
                Until Your GCSE
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
      )}

      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 ${isMobile ? 'mb-4 pt-16 sm:pt-0' : 'mb-10 pt-16 sm:pt-0 gap-6'}`}>
        <div className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className={`${isMobile ? 'text-2xl font-black' : 'text-3xl md:text-5xl font-black'} text-slate-900 dark:text-white tracking-tight`}>
              {language === 'biblical' ? 'Biblical Hebrew' : language === 'modern' ? 'Modern Hebrew' : language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : language === 'german' ? 'German' : language === 'arabic' ? 'Arabic' : 'Custom Deck'}
            </h1>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-100/30">
                GCSE
              </div>
              {user && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100/30">
                  Synced
                </div>
              )}
            </div>
          </div>
          {!isMobile && (
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base">
              {user ? `Signed in as ${user.displayName || user.email}` : 'Sign in to sync your progress across devices.'}
            </p>
          )}
          {SPECIFICATION_LINKS[language] && !isMobile && (
            <a 
              href={SPECIFICATION_LINKS[language]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black transition-all border border-slate-200 dark:border-slate-700 w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Subject Specification
            </a>
          )}
        </div>
        {!isMobile && (
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={onShowSettings}
                className="p-3 bg-white dark:bg-slate-900 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft transition-all active:scale-95"
                title="User Settings"
              >
                <Settings2 className="w-6 h-6" />
              </button>
              {(userProfile?.streak > 0) ? (
                <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl shadow-lg shadow-orange-500/20 border border-white/10 flex items-center gap-2">
                  <Flame className="w-5 h-5 fill-current" />
                  <span className="font-black text-sm">{userProfile.streak} Day Streak!</span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Hero / Quick Start Section */}
      {isMobile ? (
        <div className="flex flex-col gap-3 mb-4">
          {/* Compact Mobile Hero */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 dark:from-indigo-600 dark:to-indigo-900 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Official GCSE Specification</span>
              </div>
              <h2 className="text-xl font-black text-white mb-3 tracking-tight">Ready to score GCSE Grade 9?</h2>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onStartSession}
                  className="h-11 bg-white text-indigo-700 rounded-xl font-black text-xs hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5 active:scale-95 uppercase tracking-wider shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Practice
                </button>
                <button
                  onClick={() => onStartFlashcards()}
                  className="h-11 bg-white/15 hover:bg-white/25 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-white/10"
                >
                  <Book className="w-3.5 h-3.5" /> Flashcards
                </button>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Compact Quick Actions Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={onStartIncorrectSession}
              className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-amber-200 group transition-all"
            >
              <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <RotateCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-bold text-[11px] text-slate-950 dark:text-white leading-tight">Weaknesses</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Errors</span>
            </button>
            
            <button 
              onClick={onStartTest}
              className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-indigo-200 group transition-all"
            >
              <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-bold text-[11px] text-slate-950 dark:text-white leading-tight">Test Mode</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Challenge</span>
            </button>

            <button 
              onClick={onStartGrammarMastery}
              className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-emerald-200 group transition-all"
            >
              <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Book className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-bold text-[11px] text-slate-950 dark:text-white leading-tight">Grammar</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Rules</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-8 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 dark:from-indigo-600 dark:to-indigo-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className={`text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight uppercase italic ${!reducedMotion ? 'animate-bounce-subtle' : ''}`}>
                START LEARNING <br className="hidden md:block"/> NOW — IT'S FREE!
              </h2>
              <p className="text-indigo-100 font-bold text-base md:text-xl mb-8 max-w-lg opacity-90">
                Master the official {(language === 'biblical' || language === 'spanish' || language === 'french' || language === 'arabic') ? 'Edexcel' : (language === 'german' || language === 'modern') ? 'AQA' : 'official'} specification vocabulary—guaranteed to appear in your exams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStartSession}
                  className={`flex-[2] min-h-[72px] px-8 bg-white text-indigo-700 rounded-2xl font-black text-xl md:text-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-2xl ${!reducedMotion ? 'hover:-translate-y-1 active:scale-95 animate-bounce-subtle' : ''} uppercase tracking-tight`}
                >
                  <Play className="w-7 h-7 fill-current" /> Start Learning Now
                </button>
                <button
                  onClick={() => onStartFlashcards()}
                  className="flex-1 min-h-[72px] px-8 bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 backdrop-blur-sm hover:-translate-y-1 active:scale-95"
                >
                  <Book className="w-6 h-6" /> Flashcards
                </button>
              </div>
              
              {!user && (
                <div className="mt-8 flex items-center gap-3 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/5 max-w-lg">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider mb-0.5">Guest Mode</p>
                    <p className="text-[11px] text-indigo-100/80 font-bold leading-tight">Create an account to save your progress, build streaks, and study across all your devices!</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/15 transition-all duration-1000" />
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-400/30 transition-all duration-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none mix-blend-overlay">
              <RotateCw className="w-full h-full rotate-45 text-white" />
            </div>
          </div>
          
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
            <button 
              onClick={onStartIncorrectSession}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-soft hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-900 group transition-all"
            >
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <RotateCw className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-black text-slate-900 dark:text-white">Review Errors</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Target Weaknesses</span>
            </button>
            
            <button 
              onClick={onStartTest}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-soft hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 group transition-all relative"
            >
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-black text-slate-900 dark:text-white">Test Mode</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Challenge Yourself</span>
            </button>

            <button 
              onClick={onStartGrammarMastery}
              className="col-span-2 lg:col-span-1 flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-[2rem] shadow-soft hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 group transition-all"
            >
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-800/40 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Book className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-black text-emerald-900 dark:text-emerald-100">Grammar Mastery</span>
              <span className="text-[10px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mt-1">
                {language === 'biblical' ? 'Binyanim & Rules' : 'Rules & Patterns'}
              </span>
            </button>

            {devMode && (
              <button 
                onClick={handleShopClick}
                className={`col-span-2 lg:col-span-1 flex flex-col items-center justify-center p-6 border rounded-[2rem] shadow-lg group transition-all hover:-translate-y-1 ${
                  shopUnlocked 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-400/50 shadow-pink-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-none grayscale opacity-80'
                }`}
              >
                <div 
                  onClick={handleIconClick}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer ${
                    shopUnlocked ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <ShoppingCart className={`w-7 h-7 ${shopUnlocked ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className={`font-black ${shopUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {shopUnlocked ? 'Student Shop' : 'Work in Progress'}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                  shopUnlocked ? 'text-pink-100' : 'text-slate-400'
                }`}>
                  {shopUnlocked ? 'Premium Cheat Sheets' : 'Coming Soon'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Exam Practice - Locked Promo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-black dark:from-black dark:to-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-12 group border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-1000">
          <Brain className="w-96 h-96 text-indigo-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 flex items-center gap-1.5">
                <Brain className="w-3 h-3" />
                AI Smart Technology
              </div>
            </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Exam Simulator</span>
              </h2>
              
              <p className="text-slate-400 font-bold text-base md:text-lg mb-6 max-w-2xl leading-relaxed">
                Experience the future of {language === 'biblical' ? 'Biblical Hebrew' : 'language'} revision. Our AI acts as your personal examiner, marking your answers instantly against official exam board criteria.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                {language === 'biblical' ? (
                  <>
                    <button 
                      onClick={() => onSelectExamMode?.('reading')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm active:scale-95 transition-all text-left group"
                    >
                      <BookOpen className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-black mb-1">Unseen Practice</h3>
                      <p className="text-sm text-slate-400 font-bold">Tackle unseen texts with AI-guided hints and immediate detailed mark schemes.</p>
                    </button>
                    <button 
                      onClick={() => onSelectExamMode?.('writing')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm active:scale-95 transition-all text-left group"
                    >
                      <PenTool className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-black mb-1">Writing Mastery</h3>
                      <p className="text-sm text-slate-400 font-bold">Master Biblical Hebrew composition with structured prompts and AI feedback.</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => onSelectExamMode?.('listening')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm text-left active:scale-95 transition-all group"
                    >
                      <Headphones className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-black mb-1">Listening</h3>
                      <p className="text-sm text-slate-400 font-bold">AI-generated native speaker audio with exam-style questions.</p>
                    </button>
                    <button 
                      onClick={() => onSelectExamMode?.('reading')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm text-left active:scale-95 transition-all group"
                    >
                      <BookOpen className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-black mb-1">Reading</h3>
                      <p className="text-sm text-slate-400 font-bold">Complex texts mimicking real exam passages with automated marking.</p>
                    </button>
                    <button 
                      onClick={() => onSelectExamMode?.('writing')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm text-left active:scale-95 transition-all group"
                    >
                      <PenTool className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-black mb-1">Writing</h3>
                      <p className="text-sm text-slate-400 font-bold">Submit your essays for instant line-by-line AI corrections.</p>
                    </button>
                    <button 
                      onClick={() => onSelectExamMode?.('speaking')}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group text-left active:scale-95 transition-all"
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <Mic className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-emerald-500/20">Live in Lobby</span>
                        </div>
                        <h3 className="text-white font-black mb-1 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          Speaking
                        </h3>
                        <p className="text-sm text-slate-400 font-bold group-hover:text-slate-300">Real-time roleplay and photocard discussion with our AI examiner.</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
              <button 
                onClick={() => {
                  onNavigate('examSimulator');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Go to Exam Simulator Dashboard
              </button>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <Book className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-4 mx-auto sm:mx-0" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total</p>
          <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <Play className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-4 mx-auto sm:mx-0" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Learning</p>
          <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{learningCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <Trophy className="w-6 h-6 text-green-600 dark:text-green-400 mb-4 mx-auto sm:mx-0" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Mastered</p>
          <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{masteredCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto sm:mx-0" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Due</p>
          <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{dueCount}</p>
        </div>
      </div>

      <div className="mb-8 flex overflow-x-auto custom-scrollbar pb-2 gap-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => {
            if (isPremium || devMode) {
              setActiveTab('analytics');
            } else {
              if (onBlockPremiumFeature) {
                onBlockPremiumFeature(
                  "Performance Intelligence Analytics",
                  "Unlock detailed insights, historical grade curves, and whole paper breakdown summaries metrics."
                );
              } else {
                onShowPro();
              }
            }
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          {paperResults.length > 0 ? 'Performance Intelligence' : 'General Analytics'} <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>
        </button>
        <button 
          onClick={() => {
            if (isPremium || devMode) {
              setActiveTab('decks');
            } else {
              if (onBlockPremiumFeature) {
                onBlockPremiumFeature(
                  "Custom Decks",
                  "Create, edit, and filter custom lexical flashcard decks customized to specific themes or components."
                );
              } else {
                onShowPro();
              }
            }
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'decks' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          Custom Decks <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>
        </button>
        <button 
          onClick={() => {
            if (isPremium || devMode) {
              setActiveTab('srs');
            } else {
              if (onBlockPremiumFeature) {
                onBlockPremiumFeature(
                  "Advanced AI Spaced Repetition Settings",
                  "Fine-tune cognitive retention factors, daily card limits, and active recall grading profiles."
                );
              } else {
                onShowPro();
              }
            }
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'srs' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          SRS Settings <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>
        </button>
        <button 
          onClick={() => onNavigate('verbMaster')}
          className="px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Zap className="w-4 h-4" />
          Verb Master
          <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] uppercase tracking-wider font-black">Playground</span>
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-8 mb-16 px-0 md:px-0`}>
            {/* Left Column (Spans 2/3) */}
            <div className={isMobile ? 'col-span-1 flex flex-col gap-8' : 'lg:col-span-2 flex flex-col gap-8'}>
              {/* Mastery Overview */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 xl:p-10 shadow-soft border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Mastery Overview</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        You've mastered {Math.round((masteredCount / totalCount) * 100)}% of the vocabulary. 
                        Keep going to reach 100%!
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] min-w-[140px] border border-primary/10">
                      <div className="text-4xl font-black text-primary tracking-tighter">{Math.round((masteredCount / totalCount) * 100)}%</div>
                      <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">Completion</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-2">
                         <span>Progress</span>
                         <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] text-primary">{Math.round((masteredCount / totalCount) * 100) > 80 ? 'Elite' : Math.round((masteredCount / totalCount) * 100) > 60 ? 'Mastering' : Math.round((masteredCount / totalCount) * 100) > 30 ? 'Progressing' : 'Struggling'}</span>
                      </div>
                      <span>{masteredCount} / {totalCount} Words</span>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50 dark:border-slate-700">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20"
                        style={{ width: `${(masteredCount / totalCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
              </div>

              {/* Weekly Activity */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col h-full min-h-[350px]">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Weekly Activity</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Your learning consistency.</p>
                </div>
                <div className="flex-1 min-h-[200px]">
                  <ProgressChart progress={progress} language={language} />
                </div>
              </div>
            </div>

            {/* Right Column (Spans 1/3) */}
            {!isMobile && (
              <div className="flex flex-col gap-8">
              {/* Daily Goal */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Daily Goal</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-3">Review {srsSettings.dailyGoal || 20} words today.</p>
                    <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl w-fit">
                      <div className="flex items-center gap-1.5"><Snowflake className="w-3 h-3 text-blue-400" /> {isPremium ? 'Premium rate: 1 freeze/3d' : 'Free rate: 1 freeze/5d'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{todayReviews} <span className="text-sm font-bold text-slate-400 tracking-normal">/ {srsSettings.dailyGoal || 20}</span></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/20"
                    style={{ width: `${Math.min((todayReviews / (srsSettings.dailyGoal || 20)) * 100, 100)}%` }}
                  />
                </div>
                {todayReviews >= (srsSettings.dailyGoal || 20) && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-bold w-fit">
                    <Trophy className="w-4 h-4" /> Daily Goal Reached!
                  </div>
                )}
              </div>

              {/* Streak Freezes Component */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Snowflake className="w-6 h-6 text-sky-500" />
                      Streak Freezes
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Protect your hard-earned streak.</p>
                  </div>
                  <div className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-black rounded-xl text-lg mt-1 md:mt-0">
                    {isPremium ? `${globalProgress.streak?.freezes || 0}` : `${globalProgress.streak?.freezes || 0}/3`}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-end mt-auto">
                  <div className="flex gap-2 mb-4">
                    {[...Array(isPremium ? 5 : 3)].map((_, i) => (
                      <div key={`freeze-slot-${i}`} className={`h-3 flex-1 rounded-full relative overflow-hidden ${i < (globalProgress.streak?.freezes || 0) ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {i < (globalProgress.streak?.freezes || 0) && (
                          <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    {isPremium ? (
                      <>You have <strong className="text-sky-500">{globalProgress.streak?.freezes || 0} freezes</strong>. Premium users get unlimited capacity.</>
                    ) : (
                      <>You have <strong className="text-sky-500">{globalProgress.streak?.freezes || 0}/3 freezes</strong>. Earn 1 freeze for every 5 days studying.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Premium Promo */}
              {isPremium ? (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-amber-400/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-200 border border-amber-400/20">Premium Active</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2 tracking-tighter">Welcome to Pro</h3>
                    <p className="text-slate-400 text-sm mb-6 font-medium italic">
                      Complete access to interactive modules, exams, and analytics active!
                    </p>
                    <button 
                      onClick={() => onNavigate('roadmap')}
                      className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20"
                    >
                      View Roadmap
                    </button>
                  </div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500" />
                </div>
              ) : (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-slate-800">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Founding Discount</span>
                    </div>
                    <h3 className="text-2xl font-black mb-1 tracking-tighter">Go Premium</h3>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 line-through mr-2">£49.99/yr</span>
                        <span className="text-xl font-black text-white">£24.99/yr</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium italic">
                      Unlock deep insights and mock-exam features. Secure <span className="text-amber-400">50% lifetime discount</span>.
                    </p>
                    <button 
                      onClick={onShowPro}
                      className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20"
                    >
                      View Growth Pathways
                    </button>
                  </div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
                </div>
              )}
            </div>
            )}
          </div>

      {showDatabase ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowDatabase(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-500 transition-colors"
                  title="Back to Overview"
                >
                  <RotateCw className="w-5 h-5 -rotate-90" />
                </button>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Vocabulary Database</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Browsing {totalCount} words</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="learning">Learning</option>
                    <option value="mastered">Mastered</option>
                  </select>
  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={`cat-${cat}`} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-8 py-5">{['spanish', 'french', 'german', 'arabic'].includes(language) ? 'Target' : 'Hebrew'}</th>
                    <th className="px-8 py-5">English</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredVocabulary.length > 0 ? (
                    filteredVocabulary.map((word) => {
                      const wordProgress = progress.find(p => p.wordId === word.id);
                      const status = wordProgress?.mastery || 'new';
  
                      return (
                        <tr key={word.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                          <td className="px-8 py-6 text-3xl font-bold text-slate-900 dark:text-white" dir={['spanish', 'french', 'german', 'arabic'].includes(language) && language !== 'arabic' ? 'ltr' : 'rtl'}>
                            {getForeignWord(word, language)}
                          </td>
                          <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-bold overflow-hidden text-ellipsis">
                            {word.english}
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              {word.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                              status === 'mastered' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                              status === 'learning' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            }`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">
                        No words found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVocabulary.length > 0 ? (
                filteredVocabulary.map((word) => {
                  const wordProgress = progress.find(p => p.wordId === word.id);
                  const status = wordProgress?.mastery || 'new';
  
                  return (
                    <div key={`mobile-${word.id}`} className="p-6 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white leading-tight" dir={['spanish', 'french', 'german', 'arabic'].includes(language) && language !== 'arabic' ? 'ltr' : 'rtl'}>
                          {getForeignWord(word, language)}
                        </div>
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                          status === 'mastered' ? 'bg-green-100 text-green-700' :
                          status === 'learning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 font-bold mb-3">{word.english}</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded">
                          {word.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium text-sm">
                  No results found.
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => {
                  setShowDatabase(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-white dark:bg-slate-900 font-black text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
              >
                Back to Overview
              </button>
            </div>
          </div>
        ) : (
          <div className={isMobile ? "mb-4" : "mb-12"}>
            <button 
              onClick={() => setShowDatabase(true)}
              className={`w-full bg-white dark:bg-slate-900 shadow-soft border border-slate-100 dark:border-slate-800 group transition-all text-left ${
                isMobile ? 'rounded-2xl p-4' : 'rounded-[2.5rem] p-8 md:p-12 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`flex justify-between items-center ${isMobile ? 'gap-3' : 'flex-col md:flex-row gap-8'}`}>
                <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-6'}`}>
                  <div className={`${isMobile ? 'w-10 h-10 rounded-xl' : 'w-20 h-20 rounded-3xl'} bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0`}>
                    <Search className={`${isMobile ? 'w-5 h-5' : 'w-10 h-10'} text-primary`} />
                  </div>
                  <div>
                    <h3 className={`${isMobile ? 'text-sm font-black' : 'text-2xl font-black'} text-slate-900 dark:text-white`}>Vocabulary Database</h3>
                    {!isMobile && (
                      <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mt-1">
                        Search through all {totalCount} words, filter by mastery status, or browse by category.
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${isMobile ? 'px-4 py-2 text-xs rounded-xl' : 'px-10 py-5 rounded-2xl'} bg-primary text-white font-black shadow-lg shadow-primary/20 text-center uppercase tracking-tight shrink-0`}>
                  {isMobile ? 'Open' : 'Open Database'}
                </div>
              </div>
            </button>
          </div>
        )}
      </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Intelligence Header & Countdown */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Performance Intelligence</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Version 4.0.5 • Semantic Analytics Active</p>
            </div>
            {paperAnalytics.examCountdown && (
              <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg flex items-center gap-4 group hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Exam Countdown</p>
                  <p className="text-xl font-black tracking-tight">{paperAnalytics.examCountdown.label}</p>
                </div>
                <div className="ml-4 pl-4 border-l border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Readiness</p>
                  <p className="text-xl font-black tracking-tight">{paperAnalytics.overallReadiness}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Next Best Action Card */}
          {paperAnalytics.nextBestAction && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-[2.5rem] border-2 shadow-xl relative overflow-hidden ${
                paperAnalytics.nextBestAction.priority === 'URGENT' 
                  ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900/30' 
                  : 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-900/30'
              }`}
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl shrink-0 ${
                    paperAnalytics.nextBestAction.priority === 'URGENT' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'
                  }`}>
                    {paperAnalytics.nextBestAction.priority === 'URGENT' ? <AlertCircle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        paperAnalytics.nextBestAction.priority === 'URGENT' ? 'bg-rose-200 text-rose-700' : 'bg-indigo-200 text-indigo-700'
                      }`}>
                        Priority Recommendation: {paperAnalytics.nextBestAction.priority}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{paperAnalytics.nextBestAction.action}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{paperAnalytics.nextBestAction.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('pastPapers')}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all w-full md:w-auto ${
                    paperAnalytics.nextBestAction.priority === 'URGENT' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'
                  }`}
                >
                  Execute Now
                </button>
              </div>
            </motion.div>
          )}

          {/* Progression Engine v2 - Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Target className="w-3 h-3" /> Average Grade
               </div>
               <div className="flex items-baseline gap-3">
                 <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
                   {paperAnalytics.averageGrade}
                 </div>
                 {paperAnalytics.latestResult && targetGrades[ProgressionService.extractSubjectFromId(paperAnalytics.latestResult.paperId)] && (
                   <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     Target: {targetGrades[ProgressionService.extractSubjectFromId(paperAnalytics.latestResult.paperId)]}
                   </div>
                 )}
               </div>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Based on all metadata results.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Sparkles className="w-3 h-3" /> Exam Readiness
               </div>
               <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                 {paperAnalytics.overallReadiness}%
               </div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                   style={{ width: `${paperAnalytics.overallReadiness}%` }}
                 />
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <RotateCw className="w-3 h-3" /> Latest Result
               </div>
               {paperAnalytics.latestResult ? (
                 <>
                   <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">
                     {paperAnalytics.latestResult.grade}
                   </div>
                   <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                     {new Date(paperAnalytics.latestResult.timestamp).toLocaleDateString()} • {paperAnalytics.latestResult.percentage}%
                   </p>
                 </>
               ) : (
                 <p className="text-sm font-bold text-slate-400 mt-4 italic">No past paper entries found yet.</p>
               )}
            </div>
          </div>

          {/* Subject Performance Grid */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Subject Intelligence</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Deterministic trends per metadata subject.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowTargetSettings(!showTargetSettings)}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                >
                  <Target className="w-4 h-4" /> Set Targets
                </button>
                <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Real-time Analysis
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showTargetSettings && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Target Grade Settings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(paperAnalytics.subjectBreakdown).map(subject => (
                        <div key={subject} className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subject}</label>
                          <select 
                            value={targetGrades[subject] || ''}
                            onChange={(e) => onUpdateTargetGrade(subject, e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold"
                          >
                            <option value="">Set Target...</option>
                            {['9', '8', '7', '6', '5', '4', '3', 'U'].map(g => (
                              <option key={g} value={g}>Grade {g}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(paperAnalytics.subjectBreakdown).map(([subject, data]) => (
                <div key={subject} className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{subject}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.totalAttempts} Attempts</span>
                        {data.targetGrade && (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            (data.gradeGap || 0) <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            Goal: {data.targetGrade}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl border ${
                      data.trend === 'improving' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' :
                      data.trend === 'declining' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50' :
                      'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {data.trend === 'improving' ? <TrendingUp className="w-5 h-5" /> : 
                       data.trend === 'declining' ? <TrendingDown className="w-5 h-5" /> : 
                       <RotateCw className="w-5 h-5" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Grade</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{data.averageGrade}</p>
                        {data.gradeGap !== undefined && data.gradeGap > 0 && (
                          <span className="text-[10px] font-black text-rose-500 uppercase">-{data.gradeGap} to Goal</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Readiness</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data.readinessScore}%</p>
                    </div>
                  </div>

                  {data.weakTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.weakTopics.map(topic => (
                        <span key={topic} className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-md text-[9px] font-black uppercase tracking-widest">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                     <Target className="w-24 h-24" />
                  </div>
                </div>
              ))}
              {Object.keys(paperAnalytics.subjectBreakdown).length === 0 && (
                <div className="col-span-full py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">Complete your first past paper to unlock Subject Intelligence.</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Performance Breakdown</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Detailed audit of all historical exam attempts.</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Series & Paper</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Score</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Grade</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Target</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Gap</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Next (+marks)</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {paperAnalytics.performanceBreakdown.map((row, index) => (
                    <tr key={`${row.paperId}-${index}`} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-sm uppercase">{row.subject} {row.year}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {row.examBoard} • Paper {row.paperNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 text-center">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{row.score}/{row.totalMarks}</span>
                      </td>
                      <td className="py-6 text-center">
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-black text-xs">
                          {row.calculatedGrade}
                        </span>
                      </td>
                      <td className="py-6 text-center">
                        <span className="text-sm font-bold text-slate-500">{row.targetGrade}</span>
                      </td>
                      <td className="py-6 text-center">
                        <span className={`text-sm font-black ${row.gradeGap > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {row.gradeGap > 0 ? `-${row.gradeGap}` : '✓'}
                        </span>
                      </td>
                      <td className="py-6 text-center text-xs font-bold text-slate-400">
                        {row.marksToNextGrade > 0 ? `+${row.marksToNextGrade} marks` : <span className="text-emerald-500">Max Grade</span>}
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-1 ${
                            row.priorityLevel === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                            row.priorityLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            {row.priorityLevel}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{row.recommendedAction}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paperAnalytics.performanceBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-bold italic">No examination history available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Redo Queue System */}
          <div className="bg-indigo-600 dark:bg-indigo-900/60 p-8 rounded-[2.5rem] shadow-xl border border-indigo-500/20 relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div>
                   <h3 className="text-2xl font-black text-white tracking-tight">Redo Queue</h3>
                   <p className="text-indigo-100 text-sm font-medium">Prioritised papers requiring immediate performance correction.</p>
                 </div>
                 <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest self-start md:self-auto">
                   {paperAnalytics.redoQueue.length} Critical Items
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {paperAnalytics.redoQueue.map((item, index) => (
                   <div key={`${item.paperId}-${index}`} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/20 transition-all group flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start mb-4">
                         <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] font-black uppercase tracking-widest">
                           Gap Weighting: {item.priorityScore}
                         </span>
                         <button 
                           onClick={() => window.open(item.externalUrl, '_blank')}
                           className="p-2 bg-indigo-500/50 rounded-xl text-white hover:bg-indigo-400 transition-colors"
                         >
                           <ExternalLink className="w-4 h-4" />
                         </button>
                       </div>
                       <h4 className="text-white font-black text-lg mb-1">{item.subject}</h4>
                       <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-4">Reference: {item.paperId.split('_').slice(-2).join(' ')}</p>
                       
                       <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase tracking-widest mb-6">
                         <AlertCircle className="w-4 h-4" />
                         {item.reason}
                       </div>
                     </div>

                     <button 
                       onClick={() => onNavigate('pastPapers')}
                       className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                     >
                       Load Intelligence
                     </button>
                   </div>
                 ))}
                 {paperAnalytics.redoQueue.length === 0 && (
                   <div className="col-span-full py-12 text-center text-indigo-100/60 font-bold border-2 border-dashed border-white/10 rounded-[2.5rem]">
                     Redo Queue Clear (All Targets Maintained)
                   </div>
                 )}
               </div>
             </div>
             <RotateCw className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 pointer-events-none animate-spin-slow opacity-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Retention Rate</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{analytics.retentionRate}%</div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Based on {analytics.totalReviews} total reviews</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 md:col-span-2">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Study Activity (Last 12 Weeks)</div>
              <div className="flex gap-1 overflow-x-auto pb-2">
                <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
                  {analytics.heatmapData.map((count, i) => (
                    <div 
                      key={`heatmap-${i}`} 
                      className={`w-4 h-4 rounded-sm transition-colors ${
                        count === 0 ? 'bg-slate-100 dark:bg-slate-800' : 
                        count < 5 ? 'bg-indigo-200 dark:bg-indigo-900/40' : 
                        count < 15 ? 'bg-indigo-400 dark:bg-indigo-600' : 
                        'bg-indigo-600 dark:bg-indigo-400'
                      }`} 
                      title={`${count} words studied`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-900/40" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-600" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-400" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Vocab Hot Zones</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Identifying your weak points by category.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                <Flame className="w-5 h-5 fill-current" />
                <span className="text-sm font-black uppercase tracking-widest leading-none">High Impact Zones</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                // Merge vocabulary with user custom deck cards to fully recognize all categories/custom collections
                const allWordsMap = new Map<string, any>();
                vocabulary.forEach(w => allWordsMap.set(w.id, w));
                if (Array.isArray(customDecks)) {
                  customDecks.forEach(deck => {
                    if (Array.isArray(deck.words)) {
                      deck.words.forEach(w => {
                        if (!allWordsMap.has(w.id)) {
                          allWordsMap.set(w.id, {
                            id: w.id,
                            category: deck.title || 'Custom Imported',
                            spanish: w.spanish || w.hebrew || w.german || w.french || '',
                            english: w.english || ''
                          });
                        }
                      });
                    }
                  });
                }

                const categoryMistakes: Record<string, number> = {};
                progress.forEach(p => {
                  const word = allWordsMap.get(p.wordId);
                  if (word) {
                    categoryMistakes[word.category] = (categoryMistakes[word.category] || 0) + (p.incorrectCount || 0);
                  }
                });

                const topHotZones = Object.entries(categoryMistakes)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6);

                if (topHotZones.length === 0) return <div className="col-span-full py-12 text-center text-slate-500 font-bold italic">Start studying to reveal your Hot Zones!</div>;

                return topHotZones.map(([category, count]) => {
                  const totalInCategory = Array.from(allWordsMap.values()).filter(w => w.category === category).length;
                  const masteredInCategory = safeProgress.filter(p => {
                    const word = allWordsMap.get(p.wordId);
                    return word?.category === category && p.mastery === 'mastered';
                  }).length;
                  const percentage = totalInCategory > 0 ? Math.round((masteredInCategory / totalInCategory) * 100) : 0;

                  return (
                    <div key={category} className="group p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-all hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                          <Zap className={`w-5 h-5 ${count > 10 ? 'text-red-500' : 'text-orange-500'}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{count}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mistakes</div>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 truncate">{category}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>{percentage > 80 ? 'Elite' : percentage > 60 ? 'Mastering' : percentage > 30 ? 'Progressing' : 'Struggling'}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              percentage > 70 ? 'bg-indigo-500' : percentage > 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(5, percentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Most Difficult Words</h3>
            {analytics.difficultWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.difficultWords.map((item, i) => (
                  <div key={`${item.wordId}-${i}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-900/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{getForeignWord(item.word, language)}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.word?.english}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{item.incorrectCount}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Mistakes</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">You're doing great!</h4>
                <p className="text-slate-500 dark:text-slate-400">You don't have any difficult words yet. Keep studying!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'decks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Custom Decks</h2>
              <p className="text-slate-500 dark:text-slate-400">Create or import your own vocabulary lists. Activated decks will be used when you start a study session.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowImportDeck(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import Quizlet
              </button>
              <button
                onClick={() => setShowCreateDeck(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Deck
              </button>
            </div>
          </div>

          {customDecks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No custom decks yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Create a new deck from scratch or import your existing flashcards from Quizlet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customDecks.map((deck) => (
                <div 
                  key={deck.id}
                  className={`group relative bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-soft border transition-all ${language === deck.id ? 'border-primary ring-[6px] ring-primary/10 shadow-xl' : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-lg'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLanguageChange(deck.id)}
                    >
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{deck.title}</h3>
                      {deck.description && (
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2">{deck.description}</p>
                      )}
                    </div>
                    <div className="flex items-center ml-4 shrink-0 gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingCardToDeck(deck);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                        title="Add cards"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareDeck(deck);
                        }}
                        disabled={sharingDeckId === deck.id}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors disabled:opacity-50"
                        title="Share deck"
                      >
                        {sharingDeckId === deck.id ? (
                          <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDeck(deck.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        title="Delete deck"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-2">
                         {[...Array(Math.min(3, deck.words.length))].map((_, i) => (
                           <div key={i} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-400">
                             {deck.words[i]?.hebrew?.charAt(0) || '?'}
                           </div>
                         ))}
                       </div>
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                         {deck.words.length} Cards
                       </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLanguageChange(deck.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          language === deck.id 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white'
                        }`}
                      >
                        {language === deck.id ? 'Ready to Study' : 'Activate'}
                      </button>
                      {language === deck.id && (
                        <button
                          onClick={onStartSession}
                          className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                          title="Start Studying Now"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'srs' && (
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Spaced Repetition Settings</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Fine-tune the algorithm to optimize your memory retention.</p>
            </div>
          </div>

          <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Daily Goal
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={srsSettings.dailyGoal || 20}
                  onChange={(e) => onUpdateSrsSettings({ ...srsSettings, dailyGoal: parseInt(e.target.value) || 20 })}
                  className="w-24 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">words per day</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Algorithm
              </label>
              
              <div className="p-6 mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex flex-col gap-4">
                <div className="flex items-start gap-4 justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-bold text-slate-900 dark:text-white">Advanced AI Spaced Repetition</h4>
                      {(!isPremium && !devMode) && (
                        <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Premium</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-snug">
                      A scientifically proven, cognitive science-based 4-button review system. It optimizes review intervals dynamically from 1 minute to 14 days, reinforcing long-term neural pathways up to 340% better than standard repetition.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (isPremium || devMode) {
                        onUpdateSrsSettings({ ...srsSettings, advancedMode: !srsSettings?.advancedMode });
                      } else {
                        if (onBlockPremiumFeature) {
                          onBlockPremiumFeature(
                            "Advanced AI Spaced Repetition",
                            "Unlock the native AI SRS scheduler to automatically calculate optimal review intervals based on memory decay."
                          );
                        } else {
                          onShowPro();
                        }
                      }
                    }}
                    className={`relative shrink-0 w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${srsSettings?.advancedMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                    role="switch"
                    aria-checked={!!srsSettings?.advancedMode}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${srsSettings?.advancedMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {!srsSettings.advancedMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => onUpdateSrsSettings({ ...srsSettings, algorithm: 'leitner' })}
                    className={`p-4 rounded-2xl border text-left transition-all ${srsSettings.algorithm === 'leitner' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white mb-1">Standard (Leitner)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Fixed intervals (1d, 3d, 7d, 14d...).</div>
                  </button>
                  <button
                    onClick={() => onUpdateSrsSettings({ ...srsSettings, algorithm: 'custom' })}
                    className={`p-4 rounded-2xl border text-left transition-all ${srsSettings.algorithm === 'custom' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white mb-1">Custom Intervals</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Define your own intervals depending on mastery level.</div>
                  </button>
                </div>
              )}
            </div>

            {!srsSettings.advancedMode && srsSettings.algorithm === 'custom' && (
              <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-primary" />
                  Custom Intervals (in hours)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                      New Words
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={srsSettings.newInterval}
                      onChange={(e) => onUpdateSrsSettings({ ...srsSettings, newInterval: parseInt(e.target.value) || 24 })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">Default: 24h (1 day)</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                      Learning Words
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={srsSettings.learningInterval}
                      onChange={(e) => onUpdateSrsSettings({ ...srsSettings, learningInterval: parseInt(e.target.value) || 72 })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">Default: 72h (3 days)</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                      Mastered Words
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={srsSettings.masteredInterval}
                      onChange={(e) => onUpdateSrsSettings({ ...srsSettings, masteredInterval: parseInt(e.target.value) || 168 })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">Default: 168h (7 days)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateDeck && user && (
        <CreateDeckModal
          onClose={() => setShowCreateDeck(false)}
          user={user}
        />
      )}

      {showImportDeck && user && (
        <QuizletImportModal
          onClose={() => setShowImportDeck(false)}
          user={user}
          language={language}
        />
      )}

      {addingCardToDeck && user && (
        <AddCardModal 
          onClose={() => setAddingCardToDeck(null)}
          user={user}
          deck={addingCardToDeck}
        />
      )}

    </div>
  );
}
