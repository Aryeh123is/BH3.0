import React, { useState } from 'react';
import { Sparkles, X, AlertCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { User } from 'firebase/auth';

// Initialize Stripe outside of component to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

interface ProModalProps {
  onClose: () => void;
  user: User | null;
  trialInfo: {
    isTrialActive: boolean;
    daysLeft: number;
    isExpired: boolean;
  };
  onRequireAuth: () => void;
}

export function ProModal({ onClose, user, trialInfo, onRequireAuth }: ProModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      onClose();
      onRequireAuth();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.id) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to load");
        
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.id
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8" />
        </div>

        {trialInfo.isTrialActive ? (
          <>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">You're on Premium!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You currently have <strong>{trialInfo.daysLeft} days left</strong> on your free trial. Enjoy Unlimited Flashcards, Streak Freezes, Advanced Analytics, Custom Decks, and more!
            </p>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-6">
              Want to keep it forever? Lock in lifetime access now for just £2.50.
            </p>
          </>
        ) : trialInfo.isExpired ? (
          <>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Trial Expired</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Your 7-day free trial has ended. To keep using Unlimited Flashcards, Streak Freezes, Advanced Analytics, and Custom Decks, upgrade to Premium for a one-time payment of just £2.50.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Upgrade to Premium</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Get Unlimited Flashcards, Streak Freezes, Advanced Analytics, Custom Decks, Spaced Repetition Algorithms, Offline Mode, AI Pronunciation, and more for just £2.50!
            </p>
          </>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleCheckout}>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Premium for £2.50'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
