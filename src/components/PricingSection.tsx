import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Check, Star, Zap, Crown, ShieldCheck, Share2, 
  Link, Smartphone, Cpu, ExternalLink, Mail, Copy,
  ChevronDown, ChevronUp, Sparkles, Trophy, Brain
} from 'lucide-react';
import { SubscriptionService } from '../services/monetization/subscriptionService';
import { SubscriptionStatus } from '../types/retention';
import { auth, db } from '../firebase';
import { CheckoutModal } from './CheckoutModal';
import { ErrorBoundary } from './ErrorBoundary';

interface PricingSectionProps {
  currentStatus: SubscriptionStatus;
  onUpdate: () => void;
  isLandingPage?: boolean;
  onSignIn?: () => void;
  devMode?: boolean;
  onNavigate?: (view: any) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  currentStatus, 
  onUpdate,
  isLandingPage = false,
  onSignIn,
  devMode = false,
  onNavigate
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [viewFeatures, setViewFeatures] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'mo' | 'yr'>('mo');
  const [loading, setLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // States for verification modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [verifyCheckLoading, setVerifyCheckLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    // Set up real-time listener for current user values to support real-time trial state changes
    const setupListener = async () => {
      const user = auth.currentUser;
      if (!user) {
        setUserProfile(null);
        return;
      }
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const userRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        }, (err) => {
          console.warn("PricingSection userProfile listener error:", err);
        });
      } catch (err) {
        console.warn("PricingSection failed to initialize Firestore listeners:", err);
      }
    };

    setupListener();

    // Recheck on auth state change
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
      }
      if (user) {
        setupListener();
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const handleStartFreeTrial = async () => {
    if (!auth.currentUser) {
      if (onSignIn) {
        onSignIn();
      } else {
        alert("Please sign in to an active account before starting your 3-day Free Trial.");
      }
      return;
    }

    if (!auth.currentUser.emailVerified && !devMode) {
      setShowVerifyModal(true);
      return;
    }

    if (userProfile?.trial_used) {
      alert("You have already used your free trial.");
      return;
    }

    setTrialLoading(true);
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      const startedAt = new Date().toISOString();
      const endsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      // Store in users/{uid} document exactly as specified
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        trial_used: true,
        trial_started_at: startedAt,
        trial_ends_at: endsAt,
        premium_source: "trial",
        premium: true,
        isPremium: true,
        subscriptionTier: 'PREMIUM',
        updatedAt: new Date()
      }, { merge: true });

      // Grant instant native access in local runtime storage for zero-flicker UI updates
      SubscriptionService.activateTrialLocal(endsAt);

      // Trigger standard success celebration burst
      const duration = 4 * 1000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 },
          colors: ['#4f46e5', '#3b82f6', '#fbbf24']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 },
          colors: ['#4f46e5', '#3b82f6', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Trigger visual parent re-sync if the caller provided it
      if (onUpdate) {
        onUpdate();
      }

      alert("🎉 Your 3-day No-Card Free Trial is now active! Experience fully unlocked Premium GC revision modules.");

    } catch (err: any) {
      console.error("Error activating free trial on Firestore:", err);
      alert("Could not start trial. Firestore write failed: " + err.message);
    } finally {
      setTrialLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    SubscriptionService.activatePremium();
    
    // Immediate Celebration Burst
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: ['#4f46e5', '#818cf8', '#fbbf24']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: ['#4f46e5', '#818cf8', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setShowSuccessModal(true);
  };

  const handleUpgradeClick = async () => {
    if (!auth.currentUser) {
      if (onSignIn) {
        onSignIn();
      } else {
        alert("Please sign in to an active account before upgrading to Premium.");
      }
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const selectedPlan = billingCycle === 'mo' ? 'monthly' : 'yearly';
      
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

      // Redirect user to Stripe Hosted Checkout
      window.location.href = data.url;

    } catch (error: any) {
      console.warn("Dynamic Stripe checkout session creation failed. Re-routing safely to direct Stripe payment fallback link:", error);
      const fallbackUrl = billingCycle === 'mo'
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

  const parentLink = SubscriptionService.generateParentPaymentLink(auth.currentUser?.uid);

  const copyLink = () => {
    navigator.clipboard.writeText(parentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPremium = currentStatus.tier === 'PREMIUM';

  return (
    <section className={`py-24 px-6 ${isLandingPage ? 'bg-slate-900 text-white' : 'bg-transparent text-slate-900 dark:text-white'} overflow-hidden relative`}>
      {/* Dynamic Background elements for "moving things" */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-tight ${isLandingPage ? 'text-white' : 'text-slate-900 dark:text-white'}`}
          >
            Academic Support & <span className="text-indigo-500">Outcomes</span>
          </motion.h2>
          <p className={`text-xl ${isLandingPage ? 'text-slate-400' : 'text-slate-500'} max-w-2xl mx-auto italic font-medium leading-relaxed`}>
            Select the practice pathway that aligns with your target GCSE grade and revision intensity.
          </p>
          
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className={`inline-flex items-center gap-2 ${isLandingPage ? 'bg-white/5 border-white/10' : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50'} border px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-amber-500`}>
              <Zap className="w-4 h-4 fill-current" />
              Founding Member Special: 100 Spots Remaining
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 italic">
              Secure a <span className="text-indigo-400">50% Lifetime Discount</span> today.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mt-12 flex justify-center">
            <div className={`p-1.5 rounded-2xl border flex items-center gap-1 ${isLandingPage ? 'bg-white/5 border-white/10' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <button 
                onClick={() => setBillingCycle('mo')}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${billingCycle === 'mo' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yr')}
                className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative ${billingCycle === 'yr' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch mb-16 max-w-4xl mx-auto">
          {/* Discovery Plan */}
          <motion.div 
            onMouseEnter={() => setHoveredPlan('free')}
            onMouseLeave={() => setHoveredPlan(null)}
            whileHover={{ y: -8 }}
            className={`${isLandingPage ? 'bg-white/5 border-white/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'} backdrop-blur-md rounded-[3rem] border-2 p-10 flex flex-col items-start transition-all relative overflow-hidden group`}
          >
            {/* Hover visual effect */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Smartphone className="w-32 h-32 rotate-12" />
            </div>

            <div className={`p-4 ${isLandingPage ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-800'} rounded-2xl mb-8 group-hover:rotate-12 transition-transform`}>
              <Star className={`w-8 h-8 ${isLandingPage ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <h3 className="text-2xl font-black uppercase mb-1">FREE</h3>
            <p className={`text-slate-500 font-bold text-xs mb-6 uppercase tracking-widest italic`}>Discovery Pathway</p>
            
            {currentStatus.tier === 'FREE' && (
              <div className={`mb-4 px-3 py-1 ${isLandingPage ? 'bg-white/10 border-white/20 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'} rounded-lg border text-[9px] font-black uppercase tracking-widest`}>
                Current Access
              </div>
            )}
            
            <div className="mb-8">
              <span className="text-5xl font-black">£0</span>
              <span className="text-slate-400 font-bold ml-2">/forever</span>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                "2 AI exam practices per week",
                "Full Vocabulary Specification",
                "Unlimited Devices",
                "Standard Audio Pronunciation"
              ].map((feature, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm font-bold ${isLandingPage ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" strokeWidth={3} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-4 text-center border ${isLandingPage ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'} rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors`}
            >
              Start Practicing
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            onMouseEnter={() => setHoveredPlan('premium')}
            onMouseLeave={() => setHoveredPlan(null)}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative ${isLandingPage ? 'bg-white/15' : 'bg-slate-900'} border-[6px] border-indigo-500 rounded-[3rem] p-10 flex flex-col items-start shadow-2xl shadow-indigo-500/20 z-10 text-white overflow-hidden group`}
          >
            {/* Moving background elements on hover */}
            <motion.div 
              animate={{ 
                y: hoveredPlan === 'premium' ? [0, -100] : 0,
                x: hoveredPlan === 'premium' ? [0, 50, -50] : 0,
                opacity: hoveredPlan === 'premium' ? [0, 0.2, 0] : 0
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"
            />
            <motion.div 
              animate={{ 
                y: hoveredPlan === 'premium' ? [0, -150] : 0,
                x: hoveredPlan === 'premium' ? [0, -40, 40] : 0,
                opacity: hoveredPlan === 'premium' ? [0, 0.2, 0] : 0
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"
            />

            {/* Moving symbols on hover */}
            <motion.div 
              animate={{ 
                rotate: hoveredPlan === 'premium' ? [0, 5, -5, 0] : 0,
                scale: hoveredPlan === 'premium' ? 1.1 : 1
              }}
              className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
            >
              <Cpu className="w-40 h-40 rotate-[-15deg] text-indigo-400" />
            </motion.div>

            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
              Success Pathway
            </div>
            
            <div className="p-4 bg-indigo-500/20 rounded-2xl mb-8 group-hover:rotate-[-12deg] transition-transform">
              <Crown className="w-8 h-8 text-indigo-400 fill-indigo-400" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-1">Premium</h3>
            <p className="text-indigo-400 font-black text-xs mb-6 uppercase tracking-widest italic tracking-tight">Grade Improvement System</p>
            
            {isPremium && (
              <div className="mb-4 px-3 py-1 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Current System Active
              </div>
            )}
            
            <div className="mb-1">
              <span className="text-slate-500 line-through font-bold text-sm">
                {billingCycle === 'mo' ? '£4.99' : '£49.99'}
              </span>
              <span className="text-6xl font-black ml-2 text-white">
                {billingCycle === 'mo' ? '£2.49' : '£24.99'}
              </span>
              <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">
                /{billingCycle === 'mo' ? 'mo' : 'yr'}
              </span>
            </div>
            <div className="mb-8">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded inline-block">
                {billingCycle === 'mo' ? '3 Days Free Trial • Then founding member discount' : '3 Days Free Trial • Best value for long-term revision'}
              </p>
            </div>

            {/* 50% Off Coupon Code Display */}
            <div className="mb-8 w-full p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex flex-col gap-2 items-center text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                🏷️ Founding 50% Off Coupon Code
              </span>
              <div className="flex items-center gap-2 bg-slate-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-mono text-sm text-indigo-300 font-bold w-full justify-between">
                <span className="select-all">{billingCycle === 'mo' ? 'FOUNDER50MONTH' : 'FOUNDER50YEAR'}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(billingCycle === 'mo' ? 'FOUNDER50MONTH' : 'FOUNDER50YEAR')}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-indigo-400 hover:text-indigo-200 cursor-pointer"
                  title="Copy coupon code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 italic font-semibold leading-relaxed">
                {copiedCode ? '✓ Code copied!' : 'Copy and enter at checkout for 50% off!'}
              </p>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Unlimited AI Exam Simulations",
                "High-Priority Gemini 2.5 Flash marking",
                "Deep Speaking & Fluency Analysis",
                "Pro Neural AI Voices (Exclusive to Simulator)",
                "Predicted Grade Roadmap",
                "Unlimited Streak Freezes"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold text-white">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" strokeWidth={3} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 w-full animate-in fade-in duration-300">
              {/* Scenario 1: User has Premium */}
              {isPremium ? (
                <div className="space-y-3">
                  <div className="w-full py-4 px-4 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Academic Access Active</span>
                    </div>
                    {userProfile?.premium_source === 'trial' && userProfile?.trial_ends_at && (
                      <span className="text-[9px] lowercase text-emerald-500/80 font-bold italic">
                        free trial expires on {new Date(userProfile.trial_ends_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {userProfile?.premium_source === 'trial' && (
                    <button 
                      onClick={handleUpgradeClick}
                      disabled={loading}
                      className="w-full py-4 text-center flex items-center justify-center gap-2 rounded-2xl font-black text-white uppercase text-xs tracking-widest bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:translate-y-0.5 border border-indigo-500/50"
                    >
                      {loading ? 'Connecting...' : 'Convert to Paid Subscription'}
                      <Crown className="w-4 h-4 fill-indigo-300 text-indigo-300 stroke-2" />
                    </button>
                  )}
                </div>
              ) : (
                /* Scenario 2: Premium not active */
                <div className="space-y-4">
                  {/* Option A: Start Trial if never used before */}
                  {(!userProfile || !userProfile.trial_used) ? (
                    <div className="space-y-3">
                      {/* Premium Subscription Option (Top of pile, high prominence) */}
                      <button 
                        onClick={handleUpgradeClick}
                        disabled={loading}
                        className="w-full py-5 text-center flex items-center justify-center gap-3 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:translate-y-0.5 border border-indigo-500 hover:scale-[1.01] duration-150"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 text-white fill-current shrink-0" />
                            <span>Subscribe via Stripe • £{billingCycle === 'mo' ? '2.49/mo' : '24.99/yr'}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-2 py-1.5 opacity-60">
                        <span className="h-px bg-white/10 flex-1"></span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">OR TRY FIRST</span>
                        <span className="h-px bg-white/10 flex-1"></span>
                      </div>

                      {/* No-Card Free Trial Option (As robust secondary choice) */}
                      <button 
                        onClick={handleStartFreeTrial}
                        disabled={trialLoading}
                        className="w-full py-4 text-center flex items-center justify-center gap-2.5 rounded-2xl font-black text-slate-950 bg-amber-400 hover:bg-amber-300 uppercase text-xs tracking-widest transition-all shadow-lg active:translate-y-0.5 hover:scale-[1.01] duration-150"
                      >
                        {trialLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-950 rounded-full border-t-transparent animate-spin" />
                            Activating Trial...
                          </div>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-slate-950 fill-current shrink-0" />
                            <span>Start 3-Day Free Trial</span>
                          </>
                        )}
                      </button>
                      
                      <p className="text-[10px] font-black text-center text-amber-400 uppercase tracking-widest">
                        🎁 No credit card required • Instant Unlock
                      </p>
                    </div>
                  ) : (
                    /* Option B: Trial already used, subscribe via Stripe checkout */
                    <div className="space-y-3">
                      <button 
                        onClick={handleUpgradeClick}
                        disabled={loading}
                        className="w-full py-5 text-center flex items-center justify-center gap-3 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:translate-y-0.5"
                      >
                        {loading ? 'Connecting...' : `Subscribe via Stripe • £${billingCycle === 'mo' ? '2.49/mo' : '24.99/yr'}`}
                      </button>
                      
                      <div className="w-full py-4 px-4 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-extrabold text-[10px] uppercase tracking-widest">
                        ⚠️ You have already used your free trial.
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => {
                  if (!auth.currentUser) {
                    if (devMode) {
                      setShowShareModal(true);
                      return;
                    }
                    if (onSignIn) onSignIn();
                    else alert("Please sign in to an active account first.");
                    return;
                  }
                  setShowShareModal(true);
                }}
                className="w-full py-4 text-center rounded-2xl font-black text-indigo-300 bg-white/5 hover:bg-white/10 uppercase text-[10px] tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2 group mb-2"
              >
                <Share2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                Send Link to Parent
              </button>

              {onNavigate && (
                <button 
                  onClick={() => onNavigate('roadmap')}
                  className="w-full py-4 text-center rounded-2xl font-black text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 uppercase text-[10px] tracking-widest transition-all border border-amber-500/20 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:animate-pulse" />
                  View Development Roadmap
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Features Table Toggle (Moved here) */}
        <div className="flex flex-col items-center gap-6 mt-12 mb-8">
          <button 
            onClick={() => setViewFeatures(!viewFeatures)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border transition-all group ${isLandingPage ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {viewFeatures ? 'Hide Comparison' : 'View Full Pathway Comparison'}
            {viewFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> }
          </button>

          <AnimatePresence>
            {viewFeatures && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`w-full max-w-4xl overflow-hidden rounded-[2.5rem] border p-8 md:p-12 ${isLandingPage ? 'bg-white/5 border-white/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${isLandingPage ? 'border-white/10' : 'border-slate-100 dark:border-slate-800'}`}>
                      <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Revision Features</th>
                      <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Discovery (Free)</th>
                      <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-amber-400 text-center">Premium</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLandingPage ? 'divide-white/5' : 'divide-slate-50 dark:divide-slate-800'}`}>
                    {[
                      { name: 'Vocabulary Access', f: 'Full Spec List', pr: 'Full Spec & Smart Cards' },
                      { name: 'AI Exam Simulations', f: '2 per week', pr: 'Unlimited' },
                      { name: 'Simulator Daily Missions', f: 'None', pr: 'Daily Active Missions & Rewards' },
                      { name: 'Simulator Core Analytics', f: 'None / Simple Stats', pr: 'Full Predictive Diagnostic Engine' },
                      { name: 'Pronunciation Audio', f: 'Standard Synthesized', pr: 'Authentic Local Accents / Native Voices' },
                      { name: 'Deep Speaking Analysis', f: 'None', pr: 'Live AI Examiner' },
                      { name: 'Predicted Grade Roadmap', f: 'None', pr: 'Active Analytics & Predictions' },
                      { name: 'Verb Master Playground', f: '5 mins/day', pr: 'Unlimited Session Length' },
                      { name: 'AI Weak Topic Correction', f: 'Basic Lists', pr: 'Intelligent Targeted Remediation' },
                      { name: 'Past Papers Integration', f: 'Download Documents Only', pr: 'Score Entry, Grading & Full Analytics' },
                      { name: 'Spaced Repetition (SRS)', f: 'Standard Intervals', pr: 'Advanced AI Spaced Repetition Settings' },
                      { name: 'Custom Vocabulary Decks', f: 'Default Decks Only', pr: 'Unlimited Custom Decks & Filtering' },
                      { name: 'Streak Freezes', f: 'Earn 1 per 5 days', pr: 'Unlimited' },
                    ].map((row, i) => (
                      <tr key={i} className="group transition-colors hover:bg-white/5">
                        <td className={`py-4 text-sm font-bold ${isLandingPage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{row.name}</td>
                        <td className="py-4 text-sm font-medium text-slate-500 text-center">{row.f}</td>
                        <td className="py-4 text-sm font-black text-amber-400 text-center">{row.pr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Why Choose Premium Bento Grid */}
        <div className="mb-24 mt-16 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black uppercase tracking-tight">Why Choose Premium?</h3>
            <p className={`text-base mt-2 ${isLandingPage ? 'text-slate-400' : 'text-slate-500'} font-bold`}>
              Our complete, custom-engineered framework for serious GCSE top-tier candidates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Crown className="w-6 h-6 text-indigo-500" />,
                title: "100% EXAM SPECIFICATION ONLY",
                desc: "Uses exclusively active, syllabus-aligned vocabulary and topics directly sourced from AQA & Edexcel specifications. No out-of-bounds filler or generic distraction."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
                title: "SMART AI-ASSISTED MARKING",
                desc: "Get instant, personalized grading and actionable oral or written feedback on every answer from high-accuracy models trained for exact GCSE exam patterns."
              },
              {
                icon: <Brain className="w-6 h-6 text-amber-500" />,
                title: "SCIENCE-BASED MEMORY DECAY",
                desc: "Optimized cognitive Spaced Repetition engine tracks memory strength and schedules reviews to reinforce critical verbs and vocabulary right before they decay."
              },
              {
                icon: <Smartphone className="w-6 h-6 text-purple-500" />,
                title: "LOCAL SPELLING & ACCENTS",
                desc: "Autoregressive, cloud-native pronunciation engines configured to match real local speakers with localized dialects and accents for genuine listening practice."
              },
              {
                icon: <Trophy className="w-6 h-6 text-rose-500" />,
                title: "REAL HISTORICAL GRADE BOUNDARIES",
                desc: "We calibrate practice tests and Past Paper results against authentic, raw historical exam board score ranges for realistic performance predictions."
              },
              {
                icon: <Zap className="w-6 h-6 text-blue-500" />,
                title: "DIAGNOSTIC WEAK TOPIC REMEDIES",
                desc: "Our analytics dynamically isolate errors down to specific topics or grammatical rules and build custom-targeted revision worksheets to patch cracks instantly."
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.01] ${isLandingPage ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-indigo-500">
                  {item.title}
                </h4>
                <p className={`text-xs ${isLandingPage ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'} font-bold leading-relaxed`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Modal */}
        <ErrorBoundary componentName="CheckoutModal">
          <CheckoutModal 
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            onSuccess={handleCheckoutSuccess}
            planName="Premium Pathway"
            price={billingCycle === 'mo' ? '£2.49' : '£24.99'}
            period={billingCycle}
            devMode={devMode}
          />
        </ErrorBoundary>

        {/* Fair-Use AI Guidance Policy */}
        <div className="mt-8 flex flex-col items-center gap-4 text-slate-500 pb-12">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Fair-Use AI Guidance Policy</span>
          </div>
          <p className="text-[10px] font-bold text-center max-w-xl italic leading-relaxed opacity-60">
            Most students never reach usage guidance thresholds. Our fair-use system ensures high-quality AI marking for everyone by intelligently balancing peak academic demand sessions for the whole Vocariox community.
          </p>
        </div>
      </div>

      {/* Share to Parent Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-slate-900 dark:text-white">Send to Parent</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                  Parents can easily complete the upgrade from their own device.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={copyLink}
                  className="w-full p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:border-indigo-300 dark:hover:border-indigo-500 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Link className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">Copy Payment Link</p>
                      <p className="text-[10px] text-slate-400 font-bold">Fast & secure sharing</p>
                    </div>
                  </div>
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />}
                </button>

                <a 
                  href={`mailto:?subject=Help me achieve a Grade 9 in my GCSEs!&body=Hi! I'm using Vocariox to study for my GCSEs. Could you help me upgrade to Premium so I can use the AI Exam markers and advanced tools? Here is the secure link: ${parentLink}`}
                  className="w-full p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:border-indigo-300 dark:hover:border-indigo-500 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">Send via Email</p>
                      <p className="text-[10px] text-slate-400 font-bold">Direct to their inbox</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                </a>
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-4 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest transition-colors mt-4"
              >
                Go back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Celebration Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border-4 border-indigo-500"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter">Academic Elite</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs tracking-[0.3em]">Premium Access Unlocked</p>
                </div>

                <div className="text-left space-y-4 py-6 px-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                   <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Thank you for joining!</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Your account has been upgraded instantly. Here is what you can now access:
                   </p>
                   <ul className="space-y-3">
                     {[
                       "Unlimited AI Exam Simulations (Gemini 2.5)",
                       "HD Speaker Audio & Voice Analysis",
                       "Personalized GCSE Target Roadmap",
                       "High-Priority Support & Feedback",
                       "Unlimited Streak Freezes"
                     ].map((b, i) => (
                       <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                         <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                           <Check className="w-2.5 h-2.5 text-white" />
                         </div>
                         {b}
                       </li>
                     ))}
                   </ul>
                </div>

                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    onUpdate();
                  }}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                  Enter Elite Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verify Email Trial Guard Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerifyModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/10">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-slate-900 dark:text-white">Verify Your Email</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                  To activate your <span className="text-indigo-600 dark:text-indigo-400">3-Day Free Trial</span>, please verify the activation link sent to <strong className="text-slate-800 dark:text-slate-200">{auth.currentUser?.email}</strong>.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 leading-relaxed mb-6 space-y-1.5">
                <p className="font-extrabold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">⚠️ Spam or Junk Check</p>
                <p>
                  GCSE verification messages occasionally get flagged by mail clients. If you can't locate it:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Check your <strong className="font-bold underline">Spam or Junk Mail</strong> folder.</li>
                  <li>Mark the message as <strong className="font-bold">"Not Spam / Safe"</strong>.</li>
                  <li>Click the link to verify your email, and return here.</li>
                </ol>
              </div>

              {verifyError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl text-red-600 dark:text-red-400 text-xs text-center font-bold">
                  {verifyError}
                </div>
              )}

              {verifyStatus && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs text-center font-bold">
                  {verifyStatus}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    setVerifyError(null);
                    setVerifyStatus(null);
                    setVerifyCheckLoading(true);
                    try {
                      if (auth.currentUser) {
                        await auth.currentUser.reload();
                        if (auth.currentUser.emailVerified) {
                          setVerifyStatus("🎉 Successfully verified!");
                          setTimeout(() => {
                            setShowVerifyModal(false);
                            handleStartFreeTrial();
                          }, 1000);
                        } else {
                          setVerifyError("We couldn't confirm your verification. Please open the link in your email and click 'Verify' before proceeding.");
                        }
                      }
                    } catch (e: any) {
                      setVerifyError("Verification check failed: " + e.message);
                    } finally {
                      setVerifyCheckLoading(false);
                    }
                  }}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-indigo-500/20 animate-pulse"
                >
                  {verifyCheckLoading ? "Checking Status..." : "I have verified my email"}
                </button>

                <div className="flex gap-4 justify-between px-2 pt-2">
                  <button 
                    onClick={async () => {
                      if (resendCooldown) return;
                      setVerifyError(null);
                      setVerifyStatus(null);
                      try {
                        if (auth.currentUser) {
                          const { sendEmailVerification } = await import('firebase/auth');
                          await sendEmailVerification(auth.currentUser);
                          setVerifyStatus("📩 A fresh verification link has been sent to your inbox and spam folder!");
                          setResendCooldown(true);
                          setTimeout(() => setResendCooldown(false), 30000); // 30s cooldown
                        }
                      } catch (e: any) {
                        setVerifyError("Resend failed: " + e.message);
                      }
                    }}
                    disabled={resendCooldown}
                    className="text-xs font-black uppercase tracking-widest text-indigo-500 hover:underline disabled:opacity-50"
                  >
                    {resendCooldown ? "Wait 30s..." : "Resend Link"}
                  </button>

                  <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
