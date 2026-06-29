import React, { useState } from 'react';
import { X, Upload, AlertCircle, ArrowRight, Link, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Word } from '../types';
import { generateId } from '../lib/utils';

interface QuizletImportModalProps {
  onClose: () => void;
  user: User;
  language?: string;
}

export function QuizletImportModal({ onClose, user, language }: QuizletImportModalProps) {
  const [title, setTitle] = useState('');
  const [importText, setImportText] = useState('');
  const [quizletUrl, setQuizletUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewWords, setPreviewWords] = useState<Word[]>([]);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  const mapWord = (foreignText: string, englishText: string): Word => {
    const wordObj: Word = {
      id: generateId('word'),
      hebrew: foreignText, // fallback
      english: englishText,
      category: 'imported'
    };
    if (language) {
      if (language === 'spanish') wordObj.spanish = foreignText;
      else if (language === 'french') wordObj.french = foreignText;
      else if (language === 'german') wordObj.german = foreignText;
      else if (language === 'arabic') wordObj.arabic = foreignText;
      else if (language === 'modern' || language === 'biblical') wordObj.hebrew = foreignText;
    }
    return wordObj;
  };

  const handleFetchUrl = async () => {
    if (!quizletUrl.trim()) return;
    setIsFetching(true);
    setError('');

    try {
      const response = await fetch('/api/quizlet-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: quizletUrl.trim() })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Quizlet set. Please use the 'Paste Text' method below instead.");
      }

      const data = await response.json();
      if (data.terms && data.terms.length > 0) {
        setTitle(data.title || '');
        const words: Word[] = data.terms.map((t: any) => mapWord(t.term, t.definition));
        setPreviewWords(words);
        setStep('preview');
      } else {
        throw new Error("No terms found in this Quizlet set.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleParse = () => {
    setError('');
    if (!title.trim()) {
      setError('Please provide a deck title.');
      return;
    }
    if (!importText.trim()) {
      setError('Please paste your Quizlet export text.');
      return;
    }

    const lines = importText.split('\n').filter(line => line.trim() !== '');
    const words: Word[] = [];
    
    lines.forEach(line => {
      // Try multiple separators
      let parts = line.split('\t'); // Tab
      if (parts.length < 2) parts = line.split(' - '); // Hyphen
      if (parts.length < 2) parts = line.split(' – '); // En dash
      if (parts.length < 2) parts = line.split(' — '); // Em dash
      if (parts.length < 2) parts = line.split(':'); // Colon
      
      if (parts.length >= 2) {
        words.push(mapWord(parts[0].trim(), parts[1].trim()));
      }
    });

    if (words.length === 0) {
      setError('Could not parse any cards. Try using a hyphen ( - ) or tab between terms and definitions.');
      return;
    }

    setPreviewWords(words);
    setStep('preview');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'decks'), {
        title: title.trim(),
        description: `Imported (${previewWords.length} cards)`,
        words: previewWords,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      onClose();
    } catch (error: any) {
      console.error("Error importing deck:", error);
      setError(`Failed to import deck: ${error?.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Import from Quizlet
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {step === 'input' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50">
                <label htmlFor="quizletUrl" className="block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  1. Automatic Import (Easiest)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      id="quizletUrl"
                      value={quizletUrl}
                      onChange={(e) => setQuizletUrl(e.target.value)}
                      placeholder="Paste Quizlet link here..."
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleFetchUrl}
                    disabled={isFetching || !quizletUrl.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    {isFetching ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isFetching ? 'Fetching...' : 'Quick Import'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-4 text-center opacity-60">
                  OR USE THE MANUAL METHOD BELOW
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
                  2. Manual Import (Paste Text)
                </label>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Deck Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Spanish 101 - Midterm"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="importText" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                      Paste Quizlet Export Text
                    </label>
                    <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase leading-tight italic">
                      In Quizlet: Click ... (More) → Export → Copy Text.
                    </p>
                    <textarea
                      id="importText"
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Term 1    Definition 1&#10;Term 2    Definition 2"
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono text-xs whitespace-pre"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white capitalize">Preview ({previewWords.length} cards)</h3>
                <button 
                  onClick={() => setStep('input')}
                  className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Edit Text
                </button>
              </div>
              <div className="space-y-2 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {previewWords.slice(0, 50).map((word, i) => (
                  <div key={i} className="flex p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-1/2 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 pr-3">{word.hebrew}</div>
                    <div className="w-1/2 pl-3 text-slate-600 dark:text-slate-400">{word.english}</div>
                  </div>
                ))}
                {previewWords.length > 50 && (
                  <div className="p-3 text-center text-xs text-slate-400 font-bold uppercase italic">
                    + {previewWords.length - 50} more cards...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          {step === 'input' ? (
            <button
              type="button"
              onClick={handleParse}
              disabled={!title.trim() || !importText.trim()}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Preview Cards
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Import Deck
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
