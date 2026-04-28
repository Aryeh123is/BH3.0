import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, MessageSquareHeart, X, LayoutGrid, Trash2 } from 'lucide-react';

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  onLeaveReview?: () => void;
  userReviews?: Review[];
  devMode?: boolean;
  onDeleteReview?: (id: string) => void;
}

const PUBLIC_REVIEWS: Review[] = [
  { id: 'public-1', name: 'Zahra B.', rating: 5, comment: 'This is exactly what I needed for my GCSE Spanish! The spaced repetition really makes words stick.', date: 'April 12, 2026' },
  { id: 'public-2', name: 'Jonathan K.', rating: 5, comment: 'Biblical Hebrew has never been easier to study. The UI is clean and the AI algorithm is spot on.', date: 'March 28, 2026' },
  { id: 'public-3', name: 'Amelie L.', rating: 4, comment: 'Great app! Really helped me catch up on my French vocabulary before mocks.', date: 'April 5, 2026' },
  { id: 'public-4', name: 'Samuel O.', rating: 5, comment: 'The custom decks feature is a game changer. I can import my own lists from school.', date: 'April 15, 2026' }
];

export function ReviewSection({ onLeaveReview, userReviews = [], devMode = false, onDeleteReview }: ReviewSectionProps) {
  const allReviews = [...userReviews, ...PUBLIC_REVIEWS];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    if (showAllModal) return; // Don't cycle if modal is open

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [allReviews.length, showAllModal]);

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">User Reviews</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Join thousands of students who are mastering languages faster with our AI-powered platform.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative min-h-[300px] mb-12 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${allReviews[currentIndex]?.id}-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute w-full"
            >
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center shadow-xl shadow-slate-200/20 dark:shadow-none min-h-[300px]">
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={`star-${currentIndex}-${i}`} 
                      className={`w-5 h-5 ${i < allReviews[currentIndex].rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 text-lg md:text-xl italic leading-relaxed">
                  "{allReviews[currentIndex].comment}"
                </p>
                <div className="flex items-center justify-center gap-3 mt-auto">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 dark:text-white">{allReviews[currentIndex].name}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{allReviews[currentIndex].date}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setShowAllModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-lg active:scale-95"
          >
            <LayoutGrid className="w-5 h-5" />
            See All Reviews
          </button>
          
          {onLeaveReview && (
            <button 
              onClick={onLeaveReview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg"
            >
              <MessageSquareHeart className="w-5 h-5" />
              Leave a Review
            </button>
          )}
        </div>
      </div>

      {showAllModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 max-w-5xl w-full border border-slate-100 dark:border-slate-800 relative shadow-2xl max-h-[90vh] flex flex-col"
          >
            <button 
              onClick={() => setShowAllModal(false)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 shrink-0"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight shrink-0">All Reviews</h2>

            <div className="overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allReviews.map((review, i) => (
                <div
                  key={`review-${review.id}-${i}`}
                  className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col h-full"
                >
                  <div className="flex items-center gap-1 mb-4 relative">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={`modal-star-${review.id}-${i}`} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                      />
                    ))}
                    {devMode && !review.id.startsWith('public-') && onDeleteReview && (
                      <button
                        onClick={() => onDeleteReview(review.id)}
                        className="absolute right-0 top-0 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Review (Dev Mode)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-6 flex-1 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
