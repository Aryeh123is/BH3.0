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
  const masteredCount = progress.filter(p => p.mastery === 'mastered').length;
  const learningCount = progress.filter(p => p.mastery === 'learning').length;
  const totalCount = vocabulary.length;

  const filteredVocabulary = vocabulary.filter(word => 
    word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.hebrew.includes(searchQuery) ||
    word.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center relative">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Hebrew GCSE Master</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Master the Biblical Hebrew Edexcel GCSE vocabulary with our Quizlet-inspired Learn Mode.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all your progress?')) {
              onResetProgress();
            }
          }}
          className="absolute top-0 right-0 text-xs text-gray-300 hover:text-red-400 transition-colors"
        >
          Reset Progress
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Words</p>
          <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Learning</p>
          <p className="text-3xl font-bold text-gray-900">{learningCount}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mastered</p>
          <p className="text-3xl font-bold text-gray-900">{masteredCount}</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl p-10 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to study?</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Start a new learning session. We'll focus on the words you're still learning.
          </p>
          <div className="mb-8">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-gray-400 uppercase tracking-widest">Overall Mastery</span>
              <span>{Math.round((masteredCount / totalCount) * 100)}%</span>
            </div>
            <ProgressBar current={masteredCount} total={totalCount} color="bg-blue-500" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartSession}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <Play className="w-5 h-5 fill-current" /> Start Learn Mode
            </button>
            <button
              onClick={onStartFlashcards}
              className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-5 h-5" /> Start Flashcards
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-bottom border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Vocabulary List</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all w-48 md:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-8 py-4">Hebrew</th>
                <th className="px-8 py-4">English</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVocabulary.length > 0 ? (
                filteredVocabulary.map((word) => {
                  const wordProgress = progress.find(p => p.wordId === word.id);
                  const status = wordProgress?.mastery || 'new';

                  return (
                    <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 text-2xl font-serif font-bold text-gray-900" dir="rtl">
                        {word.hebrew}
                      </td>
                      <td className="px-8 py-6 text-gray-600 font-medium">
                        {word.english}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold whitespace-nowrap">
                          {word.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          status === 'mastered' ? 'bg-green-100 text-green-700' :
                          status === 'learning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium italic">
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
