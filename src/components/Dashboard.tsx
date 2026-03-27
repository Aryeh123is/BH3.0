import { useState } from 'react';
import { Word, UserProgress } from '../types';
import { Play, Book, Trophy, Search, RotateCw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface DashboardProps {
  vocabulary: Word[];
  progress: UserProgress[];
  onStartSession: () => void;
  onStartFlashcards: () => void;
  onResetProgress: () => void;
}

export function Dashboard({ vocabulary, progress, onStartSession, onStartFlashcards, onResetProgress }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const masteredCount = progress.filter(p => p.mastery === 'mastered').length;
  const learningCount = progress.filter(p => p.mastery === 'learning').length;
  const totalCount = vocabulary.length;

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
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Progress</h1>
          <p className="text-slate-500 font-medium">
            Track your mastery of the Hebrew GCSE vocabulary.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all your progress?')) {
              onResetProgress();
            }
          }}
          className="text-xs font-bold text-slate-300 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          Reset All Progress
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Words</p>
          <p className="text-4xl font-extrabold text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
            <Play className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Learning</p>
          <p className="text-4xl font-extrabold text-slate-900">{learningCount}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mastered</p>
          <p className="text-4xl font-extrabold text-slate-900">{masteredCount}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl mb-16 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold mb-4">Mastery Overview</h2>
            <p className="text-slate-400 mb-8 font-medium">
              You've mastered {Math.round((masteredCount / totalCount) * 100)}% of the vocabulary. 
              Keep going to reach 100%!
            </p>
            <div className="mb-10">
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="text-slate-400 uppercase tracking-widest">Progress</span>
                <span>{Math.round((masteredCount / totalCount) * 100)}%</span>
              </div>
              <ProgressBar current={masteredCount} total={totalCount} color="bg-primary" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartSession}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Play className="w-5 h-5 fill-current" /> Continue Learning
              </button>
              <button
                onClick={onStartFlashcards}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCw className="w-5 h-5" /> Flashcards
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-extrabold text-slate-900">Vocabulary Database</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
              />
            </div>
            
            <div className="flex gap-4 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="learning">Learning</option>
                <option value="mastered">Mastered</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
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
            <thead className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-5">Hebrew</th>
                <th className="px-8 py-5">English</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVocabulary.length > 0 ? (
                filteredVocabulary.map((word) => {
                  const wordProgress = progress.find(p => p.wordId === word.id);
                  const status = wordProgress?.mastery || 'new';

                  return (
                    <tr key={word.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-3xl font-bold text-slate-900" dir="rtl">
                        {word.hebrew}
                      </td>
                      <td className="px-8 py-6 text-slate-600 font-semibold">
                        {word.english}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {word.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          status === 'mastered' ? 'bg-green-100 text-green-700' :
                          status === 'learning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">
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
