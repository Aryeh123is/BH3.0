import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Lock, CreditCard, Apple, 
  Globe, Check, Smartphone, ChevronRight,
  ArrowLeft, GraduationCap, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, getDoc, setDoc, db } from '../firebase';
import { SubscriptionService } from '../services/monetization/subscriptionService';

export const PaymentGateway: React.FC = () => {
  const [params, setParams] = useState<any>(null);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [studentName, setStudentName] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const uid = searchParams.get('u');
    const plan = searchParams.get('p');
    const amt = searchParams.get('amt');
    
    setParams({ uid, plan, amt });

    if (uid && uid !== 'anon') {
      getDoc(doc(db, 'users', uid)).then(snap => {
        if (snap.exists()) {
          setStudentName(snap.data().displayName || 'Student');
        }
      });
    }
  }, []);

  const handlePay = async () => {
    setStep('processing');
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const studentUid = searchParams.get('u');
      const planParam = searchParams.get('p') || '';
      const selectedPlan = planParam.includes('year') ? 'yearly' : 'monthly';

      if (!studentUid || studentUid === 'anon') {
        throw new Error("Target student identifier is required to purchase Premium. Please make sure you used the complete parent link.");
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: selectedPlan,
          overrideStudentUid: studentUid
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to establish secure payment session.');
      }

      window.location.href = data.url;

    } catch (e: any) {
      console.warn("Dynamic Parent Checkout failed. Re-routing safely to direct Stripe payment fallback link:", e);
      // Construct Stripe direct payment link based on plan with student ID pass-through via Stripe client reference
      const searchParams = new URLSearchParams(window.location.search);
      const studentUid = searchParams.get('u') || '';
      const planParam = searchParams.get('p') || '';
      const isYearly = planParam.includes('year');
      const fallbackUrl = isYearly 
        ? 'https://buy.stripe.com/7sY6oIbj563t4fwdvN3cc00'
        : 'https://buy.stripe.com/4gM8wQ72P8bBeUadvN3cc01';
      
      const params = new URLSearchParams();
      if (studentUid) {
        params.append('client_reference_id', studentUid);
      }
      const queryStr = params.toString();
      window.location.href = queryStr ? `${fallbackUrl}?${queryStr}` : fallbackUrl;
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase italic italic tracking-tight">Payment Successful</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Transaction ID: vcx_{Math.random().toString(36).substring(7)}</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
              Premium Access has been granted to <strong>{studentName || 'the student account'}</strong>. They can now log in to access all AI Exam Simulations and advanced tracking.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all"
          >
            Return to Vocariox
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12">
        {/* Left: Branding & Summary */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic">Vocariox <span className="text-indigo-600">Secure</span></span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black leading-tight uppercase italic text-slate-900 dark:text-white">Secure The Pathway to <span className="text-indigo-600">Grade 9</span></h2>
            <p className="text-slate-500 font-bold text-lg leading-relaxed">
              You are purchasing <strong>Premium Academic Access</strong> for {studentName ? <span className="text-slate-900 dark:text-white font-black">{studentName}</span> : 'a student'}.
            </p>
          </div>

          <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 space-y-6 border border-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Plan Selection</p>
                <h3 className="text-2xl font-black uppercase">Premium Access</h3>
              </div>
              <Zap className="w-8 h-8 text-amber-400 fill-current" />
            </div>
            
            <div className="space-y-3">
              {[
                "Unlimited AI Exam Mocks",
                "Official Edexcel/AQA Boundaries",
                "Deep Speak Evaluation",
                "Priority Gemini 2.5 Access"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Check className="w-4 h-4 text-indigo-400" strokeWidth={3} />
                  {f}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-black text-sm uppercase opacity-60">Total Due</span>
              <span className="text-4xl font-black italic">£{params?.amt || '2.49'}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 pt-4">
             <div className="flex items-center gap-6 opacity-40 grayscale justify-center">
                <Smartphone className="w-6 h-6" />
                <Globe className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">All data handled by Stripe • NO card info stored internally</p>
          </div>
        </div>

        {/* Right: Payment Input */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 space-y-8 relative overflow-hidden">
          {step === 'processing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-6 border-slate-100 dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-6 border-indigo-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Authorizing Securely</h4>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] font-mono">Syncing with Stripe Infrastructure...</p>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Secure Checkout
              </p>
              <div className="flex gap-1.5 mt-1">
                 {[1,2,3,4].map(i => <div key={i} className="w-5 h-1.5 bg-indigo-500/20 rounded-full" />)}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-7 px-3 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[9px] font-black uppercase tracking-tighter">visa</span>
              </div>
              <div className="h-7 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">mastercard</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Alternative Methods Header */}
            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Quick Pay Options</label>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={handlePay} className="py-4 bg-black text-white rounded-2xl flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all shadow-xl group">
                     <svg className="h-5 w-auto mb-0.5 group-hover:scale-110 transition-transform" viewBox="0 0 384 512" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                     </svg>
                     <span className="font-bold text-lg tracking-tighter">Pay</span>
                  </button>
                  <button onClick={handlePay} className="py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl group">
                     <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                     <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">Pay</span>
                  </button>
               </div>
            </div>

            <div className="relative py-2 flex items-center justify-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-50 dark:border-slate-800" /></div>
               <span className="relative bg-white dark:bg-slate-900 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">or traditional card</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-[1.5rem]">
                <button onClick={handlePay} className="w-full py-4 bg-[#0070ba] text-white rounded-2xl flex flex-col items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl group">
                  <div className="flex items-baseline gap-1 group-hover:scale-105 transition-transform">
                    <span className="font-extrabold text-2xl italic tracking-tighter">Pay</span>
                    <span className="font-extrabold text-2xl italic tracking-tighter text-sky-200">Pal</span>
                  </div>
                </button>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black text-slate-900 dark:text-indigo-400 uppercase tracking-widest ml-5">Cardholder Full Name</label>
                <input 
                  type="text" 
                  placeholder="name as it appears on your card"
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white outline-none rounded-[2rem] font-bold transition-all text-sm uppercase placeholder:opacity-30"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black text-slate-900 dark:text-indigo-400 uppercase tracking-widest ml-5">Standard Card Details</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="card number"
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white outline-none rounded-t-[2rem] font-bold transition-all text-sm font-mono tracking-widest"
                    value={formData.card}
                    onChange={e => setFormData({...formData, card: e.target.value})}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 grayscale brightness-0 opacity-20">
                     <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <input 
                    type="text" 
                    placeholder="MM / YY"
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-t-0 border-slate-100 dark:border-slate-700/50 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white outline-none rounded-bl-[2rem] font-bold transition-all text-sm text-center"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="CVC"
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-t-0 border-l-0 border-slate-100 dark:border-slate-700/50 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white outline-none rounded-br-[2rem] font-bold transition-all text-sm font-mono text-center"
                    value={formData.cvc}
                    onChange={e => setFormData({...formData, cvc: e.target.value})}
                  />
                </div>
              </div>

              {/* Discount Code */}
              <div className="relative pt-2">
                 <input 
                    type="text" 
                    placeholder="voucher / discount code"
                    className="w-full px-6 py-3 bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-2xl font-black text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest placeholder:text-indigo-300 outline-none pr-24"
                 />
                 <button className="absolute right-2 top-[1.15rem] px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-lg hover:bg-indigo-500 uppercase tracking-widest">Apply</button>
              </div>
            </div>

            <div className="py-4 space-y-6">
              <div className="flex items-start gap-4 text-left p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="mt-1 w-5 h-5 rounded-lg border-2 border-indigo-600 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900">
                  <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={5} />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-800 dark:text-white font-black uppercase tracking-tight">Trust Agreement</p>
                   <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     By proceeding, you verify that you are the cardholder and understand that access is granted immediately to the student account mentioned.
                   </p>
                </div>
              </div>

              <button 
                onClick={handlePay}
                disabled={!formData.card || step === 'processing'}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-indigo-500/40 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">Activate Success Pathway</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
                   <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-6">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">PCI DSS Level 1</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">No data stored internally</span>
                   </div>
                </div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Verified Academic Transaction Environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
