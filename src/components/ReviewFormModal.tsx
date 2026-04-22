import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, Star, Send } from 'lucide-react';
import type { Review } from './ReviewSection';

interface ReviewFormModalProps {
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

export function ReviewFormModal({ onClose, onSubmit }: ReviewFormModalProps) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    onSubmit(newReview);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full border border-slate-100 dark:border-slate-800 relative shadow-2xl"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          Write a Review
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
          Share your experience to help other students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700 fill-transparent'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samuel O."
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              placeholder="What do you think of the app?"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={!name.trim() || !comment.trim()}
            className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Review
          </button>
        </form>
      </motion.div>
    </div>
  );
}
