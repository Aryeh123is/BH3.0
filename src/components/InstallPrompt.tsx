import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, PlusSquare, X } from 'lucide-react';

export function InstallPrompt({ isSignedIn, totalLearned }: { isSignedIn: boolean, totalLearned: number }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS and Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    // Detect if the app is already installed/running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    // Check if the user has already dismissed the prompt recently
    const hasDismissed = localStorage.getItem('bh-install-dismissed');
    const promptShownCount = parseInt(localStorage.getItem('bh-install-prompt-count') || '0', 10);

    // Only show on iOS Safari, if not standalone, and if not recently dismissed
    if (isIOS && isSafari && !isStandalone && !hasDismissed && promptShownCount < 3 && isSignedIn && totalLearned >= 100 && !showPrompt) {
      // Delay showing the prompt to not interrupt the initial experience
      const timer = setTimeout(() => {
        setShowPrompt(true);
        localStorage.setItem('bh-install-prompt-count', (promptShownCount + 1).toString());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, totalLearned, showPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember that the user dismissed it for 30 days
    localStorage.setItem('bh-install-dismissed', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-4 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 md:max-w-sm md:left-auto"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-indigo-600 text-white rounded-xl shadow-md flex items-center justify-center font-black text-xl">
              BH
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1">
                Install BH Vocab
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Add this app to your Home Screen for full-screen access and a better experience.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                1. Tap <Share className="w-4 h-4 text-indigo-600 mx-1" />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                2. Tap <span className="flex items-center border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 mx-1 bg-slate-50 dark:bg-slate-800">Add to Home Screen <PlusSquare className="w-3 h-3 ml-1"/></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
