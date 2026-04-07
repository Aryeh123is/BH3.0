import { useState } from 'react';
import { Word, UserProgress } from '../types';
import { Play, Book, Trophy, Search, RotateCw, CloudCheck, CloudOff, Calendar } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { ProgressChart } from './ProgressChart';
import { User } from 'firebase/auth';

interface DashboardProps {
  vocabulary: Word[];
  progress: UserProgress[];
  onStartSession: () => void;
  onStartFlashcards: () => void;
  onStartTest: () => void;
  onResetProgress: () => void;
  user: User | null;
  language?: 'biblical' | 'modern' | 'spanish';
}

export function Dashboard({ vocabulary, progress, onStartSession, onStartFlashcards, onStartTest, onResetProgress, user, language = 'biblical' }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const masteredCount = progress.filter(p => p.mastery === 'mastered').length;
  const learningCount = progress.filter(p => p.mastery === 'learning').length;
  const totalCount = vocabulary.length;
  
  const now = Date.now();
  const dueCount = progress.filter(p => p.nextReview <= now).length + (vocabulary.length - progress.length);

  const categories = Array.from(new Set(vocabulary.map(w => w.category))).sort();

  const filteredVocabulary = vocabulary.filter(word => {
    const wordProgress = progress.find(p => p.wordId === word.id);
    const status = wordProgress?.mastery || 'new';

    const matchesSearch = word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.hebrew.includes(searchQuery) ||
      word.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Progress</h1>
            {user ? (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                <CloudCheck className="w-3 h-3" />
                Synced
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                <CloudOff className="w-3 h-3" />
                Local Only
              </div>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {user ? `Signed in as ${user.displayName || user.email}` : 'Sign in to sync your progress across devices.'}
          </p>
        </div>
        <div className="relative">
          {showResetConfirm ? (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-2 rounded-xl border border-red-100 dark:border-red-900/20">
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">Are you sure?</span>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-colors uppercase"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors uppercase"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs font-bold text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Reset All Progress
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
            <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Words</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center mb-6">
            <Play className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Learning</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{learningCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6">
            <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Mastered</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{masteredCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Due for Review</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{dueCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Mastery Overview</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  You've mastered {Math.round((masteredCount / totalCount) * 100)}% of the vocabulary. 
                  Keep going to reach 100%!
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] min-w-[140px]">
                <div className="text-4xl font-black text-primary">{Math.round((masteredCount / totalCount) * 100)}%</div>
                <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">Overall</div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                <span>Learning Progress</span>
                <span>{masteredCount} / {totalCount} Words</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20"
                  style={{ width: `${(masteredCount / totalCount) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={onStartSession}
                className="px-6 py-5 bg-primary text-white rounded-2xl font-black hover:bg-primary-hover transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Learn
              </button>
              <button
                onClick={onStartFlashcards}
                className="px-6 py-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-2xl font-black hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
              >
                <RotateCw className="w-5 h-5" /> Flashcards
              </button>
              <button
                onClick={onStartTest}
                className="px-6 py-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl font-black hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
              >
                <Trophy className="w-5 h-5" /> Test Mode
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Weekly Activity</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Your learning consistency.</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ProgressChart progress={progress} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-soft border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Vocabulary Database</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 dark:text-white"
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
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-5">{language === 'spanish' ? 'Spanish' : 'Hebrew'}</th>
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
                      <td className="px-8 py-6 text-3xl font-bold text-slate-900 dark:text-white" dir={language === 'spanish' ? 'ltr' : 'rtl'}>
                        {word.hebrew}
                      </td>
                      <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-semibold">
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
      </div>
    </div>
  );
}
