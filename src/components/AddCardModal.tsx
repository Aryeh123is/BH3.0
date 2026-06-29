import React, { useState } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { CustomDeck } from '../types';
import { generateId } from '../lib/utils';

interface AddCardModalProps {
  onClose: () => void;
  user: User;
  deck: CustomDeck;
}

export function AddCardModal({ onClose, user, deck }: AddCardModalProps) {
  const [foreign, setForeign] = useState('');
  const [english, setEnglish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foreign.trim() || !english.trim()) return;

    setIsSubmitting(true);
    try {
      const newWord = {
        id: generateId('word'),
        hebrew: foreign.trim(),
        english: english.trim(),
        category: 'custom'
      };

      await updateDoc(doc(db, 'users', user.uid, 'decks', deck.id), {
        words: arrayUnion(newWord),
        updatedAt: Date.now()
      });
      
      setForeign('');
      setEnglish('');
      // We don't close here to allow adding multiple cards quickly
    } catch (error) {
      console.error("Error adding card:", error);
      alert("Failed to add card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    setIsSubmitting(true);
    try {
      const words = [];
      const lines = bulkText.split('\n').filter(l => l.trim());
      lines.forEach(line => {
        let parts = line.split('\t');
        if (parts.length < 2) parts = line.split(' - ');
        if (parts.length < 2) parts = line.split(':');
        
        if (parts.length >= 2) {
          words.push({
            id: generateId('word'),
            hebrew: parts[0].trim(),
            english: parts[1].trim(),
            category: 'custom'
          });
        }
      });

      if (words.length > 0) {
        // Unfortunately arrayUnion only takes items, not an array of items for spreading easily in Firestore v9 without using fieldvalue
        // But for consistency we can just update the whole words array or use multiple updateDoc if small, 
        // but it's better to just push them to the current list
        const updatedWords = [...deck.words, ...words];
        await updateDoc(doc(db, 'users', user.uid, 'decks', deck.id), {
          words: updatedWords,
          updatedAt: Date.now()
        });
        onClose();
      } else {
        alert("Could not parse any cards. Use 'Word - Definition' format.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error bulk adding cards:", error);
      alert("Failed to add cards. Please try again.");
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
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Cards</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{deck.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'single' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500'}`}
            >
              One by One
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'bulk' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500'}`}
            >
              Bulk Add
            </button>
          </div>

          {mode === 'single' ? (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Foreign Word
                </label>
                <input
                  type="text"
                  value={foreign}
                  onChange={(e) => setForeign(e.target.value)}
                  placeholder="e.g., Bonjour"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white font-bold"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  English Definition
                </label>
                <input
                  type="text"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  placeholder="e.g., Hello"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !foreign.trim() || !english.trim()}
                className="w-full mt-4 px-4 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Card
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                Cards are saved instantly. Close the modal when done.
              </p>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  List of Cards
                </label>
                <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-tight">Format: Word - Definition (one per line)</p>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Hola - Hello&#10;Adiós - Goodbye"
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white font-mono text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !bulkText.trim()}
                className="w-full mt-4 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Bulk Save Cards
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
