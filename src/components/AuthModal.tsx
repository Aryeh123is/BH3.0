import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, AlertCircle, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, updateDoc, sendPasswordResetEmail, sendEmailVerification } from '../firebase';
import { updateProfile } from 'firebase/auth';

interface AuthModalProps {
  onClose: () => void;
  onVerified?: () => void;
}

export function AuthModal({ onClose, onVerified }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Custom states for the new email verification flow
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('A password reset link has been successfully sent to your email address. Please check your inbox.');
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onVerified?.();
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create initial profile
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: name,
          email: email,
          createdAt: Date.now(),
          language: 'biblical',
          streak: 0,
          totalLearningTime: 0
        });

        // Trigger verification email immediately
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verErr: any) {
          console.error("Failed to trigger automatic verification email:", verErr);
        }

        setIsVerificationSent(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (isForgotPassword) {
        if (err.code === 'auth/user-not-found') {
          setError('No account matches this email address.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else {
          setError(err.message || 'Failed to send secure password reset link.');
        }
      } else {
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('Invalid email or password.');
        } else if (err.code === 'auth/email-already-in-use') {
          setError('An account with this email already exists.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else {
          setError(err.message || 'An error occurred during authentication.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {isVerificationSent ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A verification link has been sent to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Once you've clicked that link, select the button below.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/20 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1.5">
              <p className="font-bold uppercase tracking-wider text-[10px]">⚠️ Important: Check Spam/Junk</p>
              <p>
                Verification emails can occasionally land in your <strong className="font-semibold underline">Spam or Junk</strong> folder. If it is in spam, please move it to your inbox or mark it as <strong className="font-semibold">"Not Spam"</strong> to receive subsequent updates securely.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {resendStatus && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm">
                <p>{resendStatus}</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={checkLoading}
                onClick={async () => {
                  setError(null);
                  setResendStatus(null);
                  setCheckLoading(true);
                  try {
                    if (auth.currentUser) {
                      await auth.currentUser.reload();
                      if (auth.currentUser.emailVerified) {
                        onVerified?.();
                        onClose();
                      } else {
                        setError("We still couldn't confirm your verification. Please check your inbox and click the activation link first.");
                      }
                    } else {
                      setError("No active user session detected. Please sign in again.");
                    }
                  } catch (reloadErr: any) {
                    setError("Failed to verify status. Please try again: " + reloadErr.message);
                  } finally {
                    setCheckLoading(false);
                  }
                }}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {checkLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "I've Verified My Email"
                )}
              </button>

              <div className="flex gap-4 justify-between pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setError(null);
                    setResendStatus(null);
                    try {
                      if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        setResendStatus("📩 New link sent! Please check your main inbox and Spam/Junk folder again.");
                      } else {
                        setError("Active connection lost. Please reload the page.");
                      }
                    } catch (resendErr: any) {
                      setError("Failed to resend email: " + resendErr.message);
                    }
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Resend Activation Email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onVerified?.();
                    onClose();
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 hover:underline"
                >
                  Verify later
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isForgotPassword 
                  ? 'Reset Password' 
                  : isLogin ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isForgotPassword
                  ? 'Enter your email to receive a secure password reset link.'
                  : isLogin 
                    ? 'Enter your details to sign in.' 
                    : 'Sign up to sync your language progress across all your devices.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-lg space-y-2 text-sm">
                <div className="flex items-start gap-3 text-emerald-600 dark:text-emerald-400">
                  <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold font-sans">✓</div>
                  <p className="font-semibold">{successMessage}</p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-slate-900/40 rounded-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-emerald-100 dark:border-emerald-950">
                  <p className="font-medium">💡 <strong className="text-slate-700 dark:text-slate-300">Important tip:</strong> If the email doesn't appear in a few minutes, check your <strong className="text-slate-700 dark:text-slate-300">Spam or Junk</strong> folder. Be sure to mark it as <strong className="text-emerald-600 dark:text-emerald-400">"Not Spam"</strong> to receive future messages in your inbox.</p>
                </div>
              </div>
            )}
          </>
        )}

        {!isVerificationSent && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isLogin && !isForgotPassword && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin && !isForgotPassword}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-xs font-semibold text-primary hover:underline transition-all"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!isForgotPassword}
                      minLength={6}
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {isForgotPassword ? (
                <>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsLogin(true);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
