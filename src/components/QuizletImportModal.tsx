import { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Word } from '../types';

interface QuizletImportModalProps {
  onClose: () => void;
  user: User;
}

export function QuizletImportModal({ onClose, user }: QuizletImportModalProps) {
  const [title, setTitle] = useState('');
  const [importText, setImportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Please provide a deck title.');
      return;
    }
    
    if (!importText.trim()) {
      setError('Please paste your Quizlet export text.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse Quizlet text
      const lines = importText.split('\n').filter(line => line.trim() !== '');
      const words: Word[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Quizlet usually uses tabs to separate term and definition
        const parts = line.split('\t');
        
        if (parts.length >= 2) {
          words.push({
            id: `word-${Date.now()}-${i}`,
            hebrew: parts[0].trim(), // Target language (term)
            english: parts[1].trim(), // Native language (definition)
            category: 'imported'
          });
        } else {
          // Fallback: try splitting by " - " if they used a custom separator
          const customParts = line.split(' - ');
          if (customParts.length >= 2) {
            words.push({
              id: `word-${Date.now()}-${i}`,
              hebrew: customParts[0].trim(),
              english: customParts[1].trim(),
              category: 'imported'
            });
          }
        }
      }

      if (words.length === 0) {
        setError('Could not parse any flashcards. Make sure you copy the text directly from Quizlet export (using Tab as separator).');
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, 'users', user.uid, 'decks'), {
        title: title.trim(),
        description: `Imported from Quizlet (${words.length} cards)`,
        words: words,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      onClose();
    } catch (error) {
      console.error("Error importing deck:", error);
      setError("Failed to import deck. Please try again.");
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Deck Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spanish 101 - Midterm"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="importText" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Paste Quizlet Export Text
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                In Quizlet, go to your set, click the three dots (...), select "Export", copy the text (keep Tab and Newline as separators), and paste it below.
              </p>
              <textarea
                id="importText"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Term 1    Definition 1&#10;Term 2    Definition 2"
                rows={8}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-mono text-sm whitespace-pre"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !importText.trim()}
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </div>
        </form>
      </motion.div>
    </div>
  );
}
