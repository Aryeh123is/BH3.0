import React, { useState } from 'react';
import { X, Save, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

import { generateId } from '../lib/utils';

interface CreateDeckModalProps {
  onClose: () => void;
  user: User;
}

export function CreateDeckModal({ onClose, user }: CreateDeckModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'info' | 'bulk'>('info');
  const [bulkText, setBulkText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const words = [];
      if (bulkText.trim()) {
        const lines = bulkText.split('\n').filter(l => l.trim());
        lines.forEach(line => {
          let parts = line.split('\t');
          if (parts.length < 2) parts = line.split(' - ');
          if (parts.length < 2) parts = line.split(':');
          if (parts.length < 2) parts = line.split(',');

          if (parts.length >= 2) {
            words.push({
              id: generateId('word'),
              hebrew: parts[0].trim(),
              english: parts[1].trim(),
              category: 'custom'
            });
          }
        });
      }

      await addDoc(collection(db, 'users', user.uid, 'decks'), {
        title: title.trim(),
        description: description.trim(),
        words: words,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      onClose();
    } catch (error: any) {
      console.error("Error creating deck:", error);
      alert(`Failed to create deck: ${error?.message || "Please check your network and try again."}`);
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
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Create New Deck</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manual Entry</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setMode('info')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'info' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                1. Deck Info
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'bulk' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                2. Quick Add Cards
              </button>
            </div>

            {mode === 'info' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Deck Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Chapter 1 Vocabulary"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this deck about?"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white resize-none"
                  />
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                   <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 leading-relaxed">
                     Tip: You can add cards now in the next tab, or later from the dashboard.
                   </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label htmlFor="bulkText" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Quick Card List
                  </label>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">FORMAT: WORD - DEFINITION</p>
                  <textarea
                    id="bulkText"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="casa - house&#10;perro - dog&#10;gato - cat"
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {mode === 'info' ? (
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className="flex-1 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Add Cards Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMode('info')}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="flex-[2] px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create & Save Deck
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
