import { useState, useMemo } from 'react';
import { Word, UserProgress, CustomDeck, SRSSettings } from '../types';
import { Play, Book, Trophy, Search, RotateCw, CloudCheck, CloudOff, Calendar, Plus, Upload, Trash2, Settings2, Save, Snowflake, Share2, Flame, User as UserIcon } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { ProgressChart } from './ProgressChart';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { CreateDeckModal } from './CreateDeckModal';
import { QuizletImportModal } from './QuizletImportModal';
import { getForeignWord } from '../lib/utils';

interface DashboardProps {
  vocabulary: Word[];
  progress: UserProgress[];
  onStartSession: () => void;
  onStartIncorrectSession: () => void;
  onStartFlashcards: (topic?: string | any) => void;
  onStartTest: () => void;
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
}

export function Dashboard({ vocabulary, progress, onStartSession, onStartIncorrectSession, onStartFlashcards, onStartTest, onResetProgress, user, userProfile, language = 'biblical', onLanguageChange, onShowPro, devMode = false, isPremium = false, customDecks, srsSettings, onUpdateSrsSettings, reducedMotion = false }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'decks' | 'srs'>('overview');
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showImportDeck, setShowImportDeck] = useState(false);
  const [sharingDeckId, setSharingDeckId] = useState<string | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);

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
    const mastered = progress.filter(p => p.mastery === 'mastered').length;
    const learning = progress.filter(p => p.mastery === 'learning').length;
    const total = vocabulary.length;
    
    const nowTime = Date.now();
    const due = progress.filter(p => p.nextReview <= nowTime).length + (vocabulary.length - progress.length);

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
    const todayRev = progress.filter(p => {
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
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pt-24 sm:pt-8 md:pt-12">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-16 sm:pt-0">
        <div className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'biblical' ? 'Biblical Hebrew' : language === 'modern' ? 'Modern Hebrew' : language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : 'Custom Deck'}
            </h1>
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                  <CloudCheck className="w-3 h-3" />
                  Synced
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  <CloudOff className="w-3 h-3" />
                  Local
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base">
            {user ? `Signed in as ${user.displayName || user.email}` : 'Sign in to sync your progress across devices.'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          {userProfile?.streak > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl shadow-lg shadow-orange-500/20 border border-white/10 flex items-center gap-2">
              <Flame className="w-5 h-5 fill-current" />
              <span className="font-black text-sm">{userProfile.streak} Day Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero / Quick Start Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 dark:from-indigo-600 dark:to-indigo-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className={`text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight uppercase italic ${!reducedMotion ? 'animate-bounce-subtle' : ''}`}>
              START LEARNING <br className="hidden md:block"/> NOW — IT'S FREE!
            </h2>
            <p className="text-indigo-100 font-bold text-base md:text-xl mb-8 max-w-lg opacity-90">
              Master your {language === 'biblical' ? 'Biblical Hebrew' : language === 'spanish' ? 'Spanish' : 'vocabulary'} effectively with spaced repetition.
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
          
          {/* Decorative Elements */}
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
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-soft hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 group transition-all"
          >
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-black text-slate-900 dark:text-white">Test Mode</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Challenge Yourself</span>
          </button>
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
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          Analytics {isPremium && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>}
        </button>
        <button 
          onClick={() => setActiveTab('decks')}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'decks' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          Custom Decks {isPremium && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>}
        </button>
        <button 
          onClick={() => setActiveTab('srs')}
          className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'srs' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
        >
          SRS Settings {isPremium && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] uppercase tracking-wider">Pro</span>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 px-4 md:px-0">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all hover:shadow-xl">
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
                    <span>Progress</span>
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

            <div className="flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Daily Goal</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-2">Review {srsSettings.dailyGoal || 20} words today to build your streak.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg w-fit">
                  <Snowflake className="w-3 h-3 text-blue-400" />
                  {isPremium ? (
                    <span>Premium: Earn 1 freeze every 3 days (Max 5)</span>
                  ) : (
                    <span>Free: Earn 1 freeze every 5 days (Max 3)</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{todayReviews} <span className="text-sm text-slate-400">/ {srsSettings.dailyGoal || 20}</span></div>
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

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Weekly Activity</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Your learning consistency.</p>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ProgressChart progress={progress} />
            </div>
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
              <div className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-black rounded-xl text-lg">
                {isPremium ? '2/2' : '1/1'}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-end mt-auto">
              <div className="flex gap-2 mb-4">
                <div className="h-3 flex-1 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                </div>
                {isPremium ? (
                  <div className="h-3 flex-1 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite_0.5s]" />
                  </div>
                ) : (
                  <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center justify-center relative group cursor-pointer" onClick={onShowPro}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/10">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-wider">UPGRADE</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                {isPremium ? (
                  <>You have <strong className="text-sky-500">max freezes</strong>! Your next freeze will generate automatically if you drop below 2.</>
                ) : (
                  <>You have <strong className="text-sky-500">1 freeze</strong>. <button onClick={onShowPro} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Go Premium</button> to hold up to 2 freezes simultaneously.</>
                )}
              </p>
            </div>
          </div>

          {isPremium ? (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] shadow-lg shadow-amber-500/20 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase tracking-widest">Premium Access</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Welcome to Pro</h3>
                <p className="text-amber-100 text-sm mb-6">
                  You have access to all premium features, including Grammar Modules, Exam Prep, Custom Decks, and Advanced Analytics!
                </p>
                <button 
                  onClick={onShowPro}
                  className="w-full py-3 bg-white text-amber-600 font-black rounded-xl hover:bg-amber-50 transition-colors"
                >
                  Premium Features Roadmap
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-widest shrink-0 animate-pulse">50% Off Release Price</span>
                </div>
                <h3 className="text-2xl font-black mb-1">Upgrade to Pro</h3>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-indigo-200 line-through mr-2">£9.99/yr</span>
                    <span className="text-2xl font-black text-white">£4.99/yr</span>
                  </div>
                  <div className="text-right flex flex-col justify-end">
                    <span className="text-xs text-indigo-200 font-medium">or <span className="line-through">£3.99</span></span>
                    <span className="text-[13px] font-black text-white">£1.99/mo</span>
                  </div>
                </div>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  Register your interest now to claim your <strong className="text-white">50% pioneer discount</strong>. Get Spanish & French Audio, Grammar Modules, Exam Prep, Streak Freezes, and unlimited flashcards!
                </p>
                <button 
                  onClick={onShowPro}
                  className="w-full py-3 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 hover:-translate-y-0.5"
                >
                  Claim My Discount
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
            </div>
          )}
        </div>
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
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
                    <th className="px-8 py-5">{language === 'spanish' || language === 'french' ? 'Target' : 'Hebrew'}</th>
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
                          <td className="px-8 py-6 text-3xl font-bold text-slate-900 dark:text-white" dir={language === 'spanish' || language === 'french' ? 'ltr' : 'rtl'}>
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
                    <div key={word.id} className="p-6 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white leading-tight" dir={language === 'spanish' || language === 'french' ? 'ltr' : 'rtl'}>
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
          <div className="mb-12">
            <button 
              onClick={() => setShowDatabase(true)}
              className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-slate-100 dark:border-slate-800 group transition-all hover:shadow-xl hover:-translate-y-1 text-left"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Vocabulary Database</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm">
                      Search through all {totalCount} words, filter by mastery status, or browse by category.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-auto px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 text-center uppercase tracking-tight">
                  Open Database
                </div>
              </div>
            </button>
          </div>
        )}
      </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
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
                      key={i} 
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
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Most Difficult Words</h3>
            {analytics.difficultWords.length > 0 ? (
              <div className="space-y-4">
                {analytics.difficultWords.map((item, i) => (
                  <div key={item.wordId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center font-bold text-sm">
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
              <p className="text-slate-500 dark:text-slate-400">Create or import your own vocabulary lists.</p>
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
                  className={`bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border transition-all ${language === deck.id ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLanguageChange(deck.id)}
                    >
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{deck.title}</h3>
                      {deck.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{deck.description}</p>
                      )}
                    </div>
                    <div className="flex items-center ml-4 shrink-0">
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
                  
                  <div 
                    className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                    onClick={() => onLanguageChange(deck.id)}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <Book className="w-4 h-4" />
                      {deck.words.length} cards
                    </div>
                    {language === deck.id ? (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                        Select Deck →
                      </span>
                    )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => onUpdateSrsSettings({ ...srsSettings, algorithm: 'leitner' })}
                  className={`p-4 rounded-2xl border text-left transition-all ${srsSettings.algorithm === 'leitner' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}
                >
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Standard (Leitner)</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Fixed intervals (1d, 3d, 7d, 14d...). Best for most users.</div>
                </button>
                <button
                  onClick={() => onUpdateSrsSettings({ ...srsSettings, algorithm: 'custom' })}
                  className={`p-4 rounded-2xl border text-left transition-all ${srsSettings.algorithm === 'custom' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}
                >
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Custom Intervals</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Define your own intervals for each mastery level.</div>
                </button>
              </div>
            </div>

            {srsSettings.algorithm === 'custom' && (
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
        />
      )}

    </div>
  );
}
