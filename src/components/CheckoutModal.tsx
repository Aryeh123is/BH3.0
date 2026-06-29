import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, ShieldCheck, Lock, ChevronRight, Check, CreditCard, Sparkles 
} from 'lucide-react';
import { auth } from '../firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
  period: string;
  devMode?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  planName,
  price,
  period,
  devMode = false
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Auto trigger checkout flow on modal open to keep interactions snappy
      handleStripeRedirect();
    }
  }, [isOpen]);

  const handleStripeRedirect = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to upgrade to Premium.");
      onClose();
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const selectedPlan = period === 'mo' ? 'monthly' : 'yearly';
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize payment checkout.');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.warn("Dynamic Stripe Checkout failed. Re-routing safely to direct Stripe payment fallback link:", error);
      const fallbackUrl = period === 'mo'
        ? 'https://buy.stripe.com/4gM8wQ72P8bBeUadvN3cc01'
        : 'https://buy.stripe.com/7sY6oIbj563t4fwdvN3cc00';
      const params = new URLSearchParams();
      if (auth.currentUser?.uid) {
        params.append('client_reference_id', auth.currentUser.uid);
      }
      if (auth.currentUser?.email) {
        params.append('prefilled_email', auth.currentUser.email);
      }
      const queryStr = params.toString();
      window.location.href = queryStr ? `${fallbackUrl}?${queryStr}` : fallbackUrl;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="my-6 space-y-6">
          <div className="w-20 h-20 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Connecting securely</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Redirecting you to Stripe Hosted Checkout
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
            <div className="flex justify-between items-baseline w-full pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Selected Plan</span>
              <span className="text-md font-black text-slate-900 dark:text-white uppercase">{planName}</span>
            </div>
            <div className="flex justify-between items-baseline w-full py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Trial Period</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">3 days free checkout</span>
            </div>
            <div className="flex justify-between items-baseline w-full pt-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">After Trial</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 italic">{price} <span className="text-xs uppercase font-extrabold text-slate-400">/{period === 'mo' ? 'mo' : 'yr'}</span></span>
            </div>
          </div>

          <div className="py-2 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 rounded-full border-t-transparent animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Syncing Billing Details...</span>
            </div>
          </div>

          <button
            onClick={handleStripeRedirect}
            disabled={loading}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Proceed via Stripe</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            PCI-DSS Compliant • No card details stored internally
          </p>
        </div>
      </motion.div>
    </div>
  );
};
