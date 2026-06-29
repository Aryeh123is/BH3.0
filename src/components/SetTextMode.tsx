import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, BookOpen, Search, Info, MessageSquare, List, Bookmark } from 'lucide-react';
import { SetText, SetTextChapter, SetTextVerse, SetTextWord } from '../types';

interface SetTextModeProps {
  setTexts: SetText[];
  onBack: () => void;
}

export const SetTextMode: React.FC<SetTextModeProps> = ({ setTexts, onBack }) => {
  const [selectedText, setSelectedText] = useState<SetText | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<SetTextChapter | null>(null);
  const [selectedWord, setSelectedWord] = useState<SetTextWord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTextSelect = (text: SetText) => {
    setSelectedText(text);
    if (text.chapters.length === 1) {
      setSelectedChapter(text.chapters[0]);
    } else {
      setSelectedChapter(null);
    }
  };

  const handleWordClick = (word: SetTextWord) => {
    setSelectedWord(word);
  };

  const filteredTexts = setTexts.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={selectedChapter ? () => setSelectedChapter(null) : (selectedText ? () => setSelectedText(null) : onBack)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-500" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedChapter ? selectedChapter.title : (selectedText ? selectedText.title : 'Set Text Study (Tanakh)')}
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {selectedChapter ? selectedText?.title : 'Biblical Hebrew Edexcel Specification'}
              </p>
            </div>
          </div>
          <BookOpen className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!selectedText ? (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search set texts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-900 dark:text-white transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTexts.map((text) => (
                <motion.button
                  key={text.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTextSelect(text)}
                  className="flex flex-col text-left p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft hover:border-indigo-500 transition-all group"
                >
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{text.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {text.chapters.length} {text.chapters.length === 1 ? 'Chapter' : 'Chapters'} available
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : !selectedChapter ? (
          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-3">
              {selectedText.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter)}
                  className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black">
                      {chapter. verses.length}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{chapter.title}</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{chapter.verses.length} Verses</p>
                    </div>
                  </div>
                  <List className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <p className="text-xs text-indigo-800 dark:text-indigo-400 font-medium leading-relaxed">
                <Info className="inline-block w-4 h-4 mr-1 mb-0.5" />
                Tap on any Hebrew word to see its translation and commentary notes.
              </p>
            </div>

            {selectedChapter.verses.map((verse) => (
              <motion.div
                key={verse.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                    {verse.verseNumber}
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="space-y-6">
                  <div 
                    className="text-3xl md:text-4xl leading-relaxed text-right font-serif" 
                    dir="rtl"
                  >
                    {verse.words.map((word, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleWordClick(word)}
                        className={`inline-block mx-1.5 cursor-pointer transition-colors hover:text-indigo-500 ${selectedWord === word ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg px-1 underline underline-offset-8' : ''}`}
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 italic text-sm md:text-base leading-relaxed">
                      "{verse.englishTranslation}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Word Detail Modal/Sidebar */}
      <AnimatePresence>
        {selectedWord && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWord(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-serif text-slate-900 dark:text-white" dir="rtl">{selectedWord.text}</h2>
                  {selectedWord.lemma && (
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Root: {selectedWord.lemma}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
                  <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Translation</h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedWord.translation}</p>
                </div>

                {selectedWord.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MessageSquare className="w-3 h-3" />
                      Commentary & Notes
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                      {selectedWord.notes}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedWord(null)}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
