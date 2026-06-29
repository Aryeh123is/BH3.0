import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, SRSSettings, UserPreferences } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Volume2, Book, Trophy, RotateCcw, Layers, Settings, X, Frown, Meh, Smile, Star } from 'lucide-react';
import { safeLocalStorage } from '../lib/storage';
import { getForeignWord } from '../lib/utils';
import { User } from 'firebase/auth';
import { TTSService } from '../services/ttsService';

interface FlashcardModeProps {
  vocabulary: Word[];
  onExit: () => void;
  onSwitchToLearn: () => void;
  onWordProgress: (wordId: string, isCorrect: boolean, explicitIntervalDays?: number) => void;
  language: string;
  user?: User | null;
  onRequireAuth?: () => void;
  isPremium?: boolean;
  onShowPro?: () => void;
  selectedTopic?: string | null;
  devMode?: boolean;
  srsSettings?: SRSSettings;
  preferences?: UserPreferences;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
}

import { syncSRSBatch } from '../services/srsSync';
import { calculateSRS } from '../lib/srsLogic';

export function FlashcardMode({ 
  vocabulary, 
  onExit, 
  onSwitchToLearn, 
  onWordProgress, 
  language, 
  user, 
  onRequireAuth,
  isPremium,
  onShowPro,
  selectedTopic,
  devMode = false,
  srsSettings,
  preferences,
  onUpdatePreferences
}: FlashcardModeProps) {

  const SESSION_KEY = `bh-flashcard-session-${language}-${selectedTopic || 'full'}`;
  
  const [sessionState, setSessionState] = useState<{
    sessionCards: Word[];
    stillLearningPile: Word[];
    currentIndex: number;
    correctCount: number;
    incorrectCount: number;
    batchCounter: number;
    batchCorrectCount: number;
    batchIncorrectCount: number;
    batchCards: Word[];
    mainDeckQueue: Word[]; // Store remaining deck while doing a sub-review
    initialTotal: number;
    isFinished: boolean;
    showBatchSummary: boolean;
    isReviewingMissed?: boolean;
  }>(() => {
    const saved = safeLocalStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Cache invalidation: if vocabulary changed or empty state was cached
        if (vocabulary.length > 0) {
          const cachedTotal = parsed.initialTotal || 0;
          if (cachedTotal > 0 && cachedTotal !== vocabulary.length && !parsed.isReviewingMissed) {
            throw new Error("Vocabulary length changed");
          }
          if ((!parsed.sessionCards || parsed.sessionCards.length === 0) &&
              (!parsed.stillLearningPile || parsed.stillLearningPile.length === 0) &&
              (!parsed.mainDeckQueue || parsed.mainDeckQueue.length === 0) &&
              !parsed.isFinished) {
            throw new Error("Corrupted empty cache");
          }
        }

        return {
          sessionCards: parsed.sessionCards || [],
          stillLearningPile: parsed.stillLearningPile || [],
          currentIndex: parsed.currentIndex || 0,
          correctCount: parsed.correctCount || 0,
          incorrectCount: parsed.incorrectCount || 0,
          batchCounter: parsed.batchCounter || 0,
          batchCorrectCount: parsed.batchCorrectCount || 0,
          batchIncorrectCount: parsed.batchIncorrectCount || 0,
          batchCards: parsed.batchCards || [],
          mainDeckQueue: parsed.mainDeckQueue || [],
          initialTotal: parsed.initialTotal || vocabulary.length,
          isFinished: parsed.isFinished || false,
          showBatchSummary: parsed.showBatchSummary || false,
          isReviewingMissed: parsed.isReviewingMissed || false
        };
      } catch (e) {
        console.error("Error parsing session state", e);
      }
    }
    return {
      sessionCards: [...vocabulary].sort(() => Math.random() - 0.5),
      stillLearningPile: [],
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      batchCounter: 0,
      batchCorrectCount: 0,
      batchIncorrectCount: 0,
      batchCards: [],
      mainDeckQueue: [],
      initialTotal: vocabulary.length,
      isFinished: false,
      showBatchSummary: false,
      isReviewingMissed: false
    };
  });

  const { 
    sessionCards, 
    stillLearningPile, 
    currentIndex, 
    correctCount, 
    incorrectCount, 
    batchCounter, 
    batchCorrectCount, 
    batchIncorrectCount, 
    batchCards,
    mainDeckQueue,
    initialTotal, 
    isFinished, 
    showBatchSummary,
    isReviewingMissed = false
  } = sessionState;

  const [isFlipped, setIsFlipped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const isCurrentWordLong = useMemo(() => {
    const word = sessionCards[currentIndex];
    if (!word) return false;
    const foreignVal = getForeignWord(word, language);
    return (word.english?.length > 25 || (foreignVal && foreignVal.length > 20));
  }, [sessionCards, currentIndex, language]);

  const [frontSide, setFrontSideState] = useState<'hebrew' | 'english'>(() => {
    if (preferences?.flashcardFrontSide && preferences.flashcardFrontSide !== 'foreign') {
      return preferences.flashcardFrontSide as 'hebrew' | 'english';
    }
    const saved = safeLocalStorage.getItem(`bh-flashcard-front-${language}`);
    return (saved as 'hebrew' | 'english') || 'hebrew';
  });

  const setFrontSide = (side: 'hebrew' | 'english') => {
    setFrontSideState(side);
    if (onUpdatePreferences) {
      onUpdatePreferences({ flashcardFrontSide: side });
    }
  };

  const [batchSize, setBatchSizeState] = useState<number>(() => {
    if (preferences?.flashcardBatchSize) {
      return preferences.flashcardBatchSize;
    }
    const saved = safeLocalStorage.getItem(`bh-flashcard-batchsize-${language}`);
    return saved ? parseInt(saved, 10) : 25;
  });

  const setBatchSize = (size: number) => {
    setBatchSizeState(size);
    if (onUpdatePreferences) {
      onUpdatePreferences({ flashcardBatchSize: size });
    }
  };

  useEffect(() => {
    if (preferences?.flashcardFrontSide && preferences.flashcardFrontSide !== 'foreign') {
      setFrontSideState(preferences.flashcardFrontSide as 'hebrew' | 'english');
    }
    if (preferences?.flashcardBatchSize) {
      setBatchSizeState(preferences.flashcardBatchSize);
    }
  }, [preferences?.flashcardFrontSide, preferences?.flashcardBatchSize]);

  useEffect(() => {
    if (!devMode) {
      safeLocalStorage.setItem(`bh-flashcard-front-${language}`, frontSide);
      safeLocalStorage.setItem(`bh-flashcard-batchsize-${language}`, batchSize.toString());
    }
  }, [frontSide, batchSize, language, devMode]);

  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enableKeyboard, setEnableKeyboard] = useState(true);
  const [history, setHistory] = useState<any[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved).history || [];
    } catch (e) {
      console.error("Error parsing history from localStorage", e);
    }
    return [];
  });

  useEffect(() => {
    if (!devMode) {
      const stateToSave = {
        ...sessionState,
        history
      };
      safeLocalStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
    }
  }, [sessionState, history, SESSION_KEY, devMode]);

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const next = [...prev, { ...sessionState }];
      // Limit history to 5 entries to save memory
      if (next.length > 5) {
        return next.slice(next.length - 5);
      }
      return next;
    });
  }, [sessionState]);

  const handleBack = useCallback(() => {
    if (history.length === 0 || isTransitioning) return;
    
    const prevState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    setSessionState(prevState);
    setIsFlipped(false);
    setDirection(0);
  }, [history, isTransitioning]);

  const processCardTransition = useCallback((isCorrect: boolean, word: Word) => {
    setSessionState(prev => {
      const nextBatchCount = prev.batchCounter + 1;
      const nextBatchCards = [...prev.batchCards, word];
      const nextStillLearning = isCorrect ? prev.stillLearningPile : [...prev.stillLearningPile, word];
      const nextCards = prev.sessionCards.filter(c => c.id !== word.id);
      
      const isSessionEnd = nextCards.length === 0 && nextStillLearning.length === 0 && prev.mainDeckQueue.length === 0;
      const isBatchEnd = nextBatchCount >= batchSize;
      
      // Calculate next index carefully
      const nextIndex = nextCards.length > 0 
        ? (prev.currentIndex >= nextCards.length ? 0 : prev.currentIndex)
        : 0;

      // 1. Completely finished everything
      if (isSessionEnd) {
        return {
          ...prev,
          sessionCards: [],
          stillLearningPile: [],
          batchCards: nextBatchCards,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          isFinished: true,
          showBatchSummary: false,
          currentIndex: 0
        };
      } 
      
      // 2. Finished the CURRENT queue (could be entire deck OR a sub-review session)
      if (nextCards.length === 0) {
        // If we have a main deck waiting, return to it
        if (prev.mainDeckQueue.length > 0) {
          return {
            ...prev,
            sessionCards: prev.mainDeckQueue,
            mainDeckQueue: [],
            stillLearningPile: nextStillLearning,
            batchCards: nextBatchCards,
            currentIndex: 0,
            correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
            incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
            batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
            batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
            isFinished: false,
            showBatchSummary: false // We just transition back to main deck
          };
        }

        // Otherwise, we are truly finished with at least this pass of the deck
        return {
          ...prev,
          sessionCards: [],
          stillLearningPile: nextStillLearning,
          batchCards: nextBatchCards,
          currentIndex: 0,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
          batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
          isFinished: true,
          showBatchSummary: false
        };
      } 

      // 3. Finished a batch
      if (isBatchEnd) {
        return {
          ...prev,
          sessionCards: nextCards,
          stillLearningPile: nextStillLearning,
          batchCards: nextBatchCards,
          batchCounter: nextBatchCount,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
          batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
          showBatchSummary: true,
          currentIndex: nextIndex // Keep the calculated next index for when they continue
        };
      } 

      // 4. Normal progression
      return {
        ...prev,
        sessionCards: nextCards,
        stillLearningPile: nextStillLearning,
        batchCards: nextBatchCards,
        currentIndex: nextIndex,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
        batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
        batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
        batchCounter: nextBatchCount
      };
    });

    // Reset transition state after a short delay to allow animation to start
    setTimeout(() => {
      setIsTransitioning(false);
      setDirection(0);
    }, 250);
  }, [batchSize]);

  const handleMarkResult = useCallback((choice: 'instant' | 'quick' | 'partial' | 'forgot') => {
    if (isTransitioning || showBatchSummary || isFinished) return;
    if (!user && (correctCount + incorrectCount) >= 50) {
      onRequireAuth?.();
      return;
    }
    const currentWord = sessionCards[currentIndex];
    if (!currentWord) return;
    
    setIsTransitioning(true);
    setDirection(choice === 'forgot' ? -1 : 1);
    setIsFlipped(false);
    
    const srsData = calculateSRS(choice);
    
    if (user) {
      syncSRSBatch(user.uid, [{
        wordId: currentWord.id,
        ...srsData
      }]).catch(console.error);
    }
    
    saveToHistory();
    processCardTransition(choice !== 'forgot', currentWord);
  }, [isTransitioning, showBatchSummary, isFinished, sessionCards, currentIndex, saveToHistory, processCardTransition, user, correctCount, incorrectCount, onRequireAuth]);

  // Keep these for keyboard shortcuts mapping temporarily
  const handleMarkCorrect = () => handleMarkResult('quick');
  const handleMarkIncorrect = () => handleMarkResult('forgot');

  useEffect(() => {
    if (isFinished || showBatchSummary || !enableKeyboard) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keyboard shortcuts if the user is typing inside text inputs or textareas
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const keysToPrevent = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      if (keysToPrevent.includes(e.key) || keysToPrevent.includes(e.code)) {
         e.preventDefault();
      }

      const keyLower = e.key.toLowerCase();
      const code = e.code;

      if (
        code === 'Space' || 
        e.key === ' ' || 
        code === 'ArrowUp' || 
        e.key === 'ArrowUp' ||
        code === 'ArrowDown' ||
        e.key === 'ArrowDown' ||
        code === 'KeyW' ||
        keyLower === 'w' ||
        code === 'KeyS' ||
        keyLower === 's'
      ) {
        setIsFlipped(prev => !prev);
      } else if (code === 'ArrowRight' || e.key === 'ArrowRight' || code === 'KeyD' || keyLower === 'd') {
        handleMarkCorrect();
      } else if (code === 'ArrowLeft' || e.key === 'ArrowLeft' || code === 'KeyA' || keyLower === 'a') {
        handleMarkIncorrect();
      } else if (e.code === 'Backspace' || e.key === 'Backspace' || (e.metaKey && (e.code === 'ArrowLeft' || e.key === 'ArrowLeft'))) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, showBatchSummary, enableKeyboard, handleMarkCorrect, handleMarkIncorrect, handleBack]);

  const handleContinueNextBatch = useCallback(() => {
    saveToHistory();
    setSessionState(prev => ({
      ...prev,
      batchCounter: 0,
      batchCorrectCount: 0,
      batchIncorrectCount: 0,
      batchCards: [],
      showBatchSummary: false
    }));
    setIsFlipped(false);
    setDirection(0);
  }, [saveToHistory]);

  const handleReviewFullBatch = useCallback(() => {
    if (batchCards.length === 0) return;
    saveToHistory();
    setSessionState(prev => ({
      ...prev,
      mainDeckQueue: prev.sessionCards, // Save remaining deck
      sessionCards: [...prev.batchCards].sort(() => Math.random() - 0.5),
      batchCards: [],
      batchCounter: 0,
      batchCorrectCount: 0,
      batchIncorrectCount: 0,
      showBatchSummary: false,
      isFinished: false,
      currentIndex: 0
    }));
    setIsFlipped(false);
    setDirection(0);
  }, [batchCards, saveToHistory]);

  const handleShuffle = useCallback(() => {
    if (!devMode) {
      safeLocalStorage.removeItem(SESSION_KEY);
    }
    setHistory([]);
    setSessionState({
      sessionCards: [...vocabulary].sort(() => Math.random() - 0.5),
      stillLearningPile: [],
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      batchCounter: 0,
      batchCorrectCount: 0,
      batchIncorrectCount: 0,
      batchCards: [],
      mainDeckQueue: [],
      initialTotal: vocabulary.length,
      isFinished: false,
      showBatchSummary: false
    });
    setIsFlipped(false);
    setIsTransitioning(false);
    setDirection(0);
  }, [vocabulary, SESSION_KEY]);

  const handlePronounce = (text: string) => {
    if (!text) return;
    if (!isPremium && (language === 'spanish' || language === 'french' || language === 'german' || language === 'arabic')) {
      onShowPro?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = TTSService.getVolume();
    
    // Improved voice selection
    const voices = window.speechSynthesis.getVoices();
    if (language === 'spanish') {
      utterance.lang = 'es-ES';
      const esVoice = voices.find(v => v.lang.startsWith('es-') && (v.name.includes('Spain') || v.name.includes('Monica') || v.name.includes('Jorge')));
      if (esVoice) utterance.voice = esVoice;
    } else if (language === 'french') {
      utterance.lang = 'fr-FR';
      const frVoice = voices.find(v => v.lang.startsWith('fr-') && (v.name.includes('France') || v.name.includes('Thomas') || v.name.includes('Amelie')));
      if (frVoice) utterance.voice = frVoice;
    }
    
    utterance.rate = 0.9;
    utterance.onerror = (e: any) => {
      console.error('Flashcard local speech error:', e);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        window.dispatchEvent(new CustomEvent('app-toast-notification', {
          detail: {
            title: "Voice Audio Error",
            message: "Offline voice playback failed. Please make sure your system's text-to-speech option is enabled.",
            type: "warning"
          }
        }));
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  // Responsive font scaling for longer words/phrases (especially needed for French/Spanish)
  const getFontSize = (text: string, isHebrewSide: boolean) => {
    if (!text) return isHebrewSide ? 'text-4xl sm:text-6xl md:text-8xl' : 'text-3xl sm:text-5xl md:text-6xl';
    const len = text.length;
    if (len < 12) return isHebrewSide ? 'text-4xl sm:text-6xl md:text-8xl' : 'text-3xl sm:text-5xl md:text-6xl';
    if (len < 25) return isHebrewSide ? 'text-3xl sm:text-4xl md:text-6xl' : 'text-2xl sm:text-4xl md:text-5xl';
    if (len < 40) return isHebrewSide ? 'text-2xl sm:text-3xl md:text-5xl' : 'text-xl sm:text-3xl md:text-4xl';
    return isHebrewSide ? 'text-xl sm:text-2xl md:text-4xl' : 'text-lg sm:text-2xl md:text-3xl';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-300">
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Flashcard Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Front Side Choice */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Show on Front</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFrontSide('hebrew')}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        frontSide === 'hebrew'
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      {language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : language === 'german' ? 'German' : language === 'arabic' ? 'Arabic' : 'Hebrew'}
                    </button>
                    <button
                      onClick={() => setFrontSide('english')}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        frontSide === 'english'
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cards Per Batch</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[25, 50, 100].map(size => (
                      <button
                        key={size}
                        onClick={() => setBatchSize(size)}
                        className={`py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                          batchSize === size
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shuffle Button */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deck Management</label>
                  <button
                    onClick={() => {
                      handleShuffle();
                      setShowSettings(false);
                    }}
                    className="w-full py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <Shuffle className="w-5 h-5" />
                    Reshuffle Deck
                  </button>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Settings are saved automatically for your next session.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showBatchSummary ? (
          <motion.div 
            key="batch-summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Layers className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">You're learning fast 🚀</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                You've completed a batch of {batchSize} cards. Keep up the momentum!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{batchCorrectCount}</div>
                  <div className="text-[10px] font-bold text-green-600/60 dark:text-green-400/60 uppercase tracking-wider">Correct</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{batchIncorrectCount}</div>
                  <div className="text-[10px] font-bold text-red-600/60 dark:text-red-400/60 uppercase tracking-wider">Incorrect</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinueNextBatch}
                  className="w-full py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-xl active:scale-95"
                >
                  Continue to Next Batch
                </button>
              </div>
            </div>
          </motion.div>
        ) : isFinished ? (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {stillLearningPile.length > 0 ? "End of Deck!" : "Deck Mastered!"}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-12 text-lg">
              {stillLearningPile.length > 0 
                ? `You've seen all words. You have ${stillLearningPile.length} words left to master.`
                : `Congratulations! You've successfully reviewed all ${vocabulary.length} words.`}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {stillLearningPile.length > 0 && (
                <button
                  onClick={() => {
                    saveToHistory();
                    setSessionState(prev => {
                      const combined = [...prev.stillLearningPile].sort(() => Math.random() - 0.5);
                      return {
                        ...prev,
                        sessionCards: combined,
                        stillLearningPile: [],
                        batchCards: [],
                        currentIndex: 0,
                        isFinished: false,
                        batchCounter: 0,
                        batchCorrectCount: 0,
                        batchIncorrectCount: 0,
                        correctCount: 0,
                        incorrectCount: 0,
                        initialTotal: combined.length,
                        isReviewingMissed: true
                      };
                    });
                  }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl cursor-pointer"
                >
                  Review All Missed ({stillLearningPile.length})
                </button>
              )}
              {batchCards.length > 0 && batchCards.length < vocabulary.length && (
                <button
                  onClick={handleReviewFullBatch}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xl"
                >
                  Redo Last Batch ({batchCards.length})
                </button>
              )}
              <button
                onClick={handleShuffle}
                className="px-8 py-4 bg-gray-900 dark:bg-slate-700 text-white rounded-2xl font-bold hover:bg-black dark:hover:bg-slate-600 transition-all shadow-xl"
              >
                Restart Entire Deck
              </button>
              <button
                onClick={onExit}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (sessionCards.length > 0 && sessionCards[currentIndex]) ? (
          <motion.div 
            key="study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[1100px] mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col justify-between w-full h-[100dvh] overflow-hidden"
          >
            <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 sm:mb-8 shrink-0">
              <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
                <button
                  onClick={onExit}
                  className="flex items-center gap-1 p-1 sm:px-3 sm:py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors text-xs sm:text-sm"
                >
                  <ChevronLeft className="w-5 h-5 shrink-0" />
                  <span className="hidden xs:inline">Exit</span>
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 p-1 sm:px-3 sm:py-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-colors text-xs sm:text-sm shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                )}
                <button
                  onClick={onSwitchToLearn}
                  className="flex items-center gap-1 p-1 sm:px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all text-[11px] sm:text-sm whitespace-nowrap"
                >
                  <Book className="w-3.5 h-3.5" />
                  <span>Learn</span>
                </button>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold">
                  {isReviewingMissed ? (
                    <div className="flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-3 py-1 rounded-xl border border-amber-500/20 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest flex items-center">
                      <span className="text-amber-600 dark:text-amber-400">Retry Session:</span>
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-0.5 ml-1">
                        ✓ {correctCount}
                      </span>
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5 ml-1">
                        ✗ {incorrectCount}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 bg-red-50 dark:bg-red-900/25 px-1.5 py-0.5 rounded cursor-help" title="Total Still Learning">{incorrectCount}</span>
                      <span className="text-green-500 bg-green-50 dark:bg-green-900/25 px-1.5 py-0.5 rounded cursor-help" title="Total Known">{correctCount}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-0.5 text-slate-400" title="Until next batch">
                    <RotateCw className="w-3 h-3" />
                    <span>{batchSize - batchCounter}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-1 px-1.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500 rounded-lg transition-all"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {initialTotal - sessionCards.length + 1}/{initialTotal}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-16 my-auto w-full">
              <div className="relative w-full transition-all duration-300 ease-out max-w-[92%] xs:max-w-[340px] md:max-w-xl aspect-[11/14] md:aspect-[4/3] mx-auto select-none">
                <AnimatePresence mode="popLayout">
                  {sessionCards[currentIndex] && (
                    <motion.div
                      key={`${sessionCards[currentIndex].id}-${currentIndex}`}
                      initial={{ x: direction * 100, opacity: 0, scale: 0.9 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: -direction * 100, opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="w-full h-full perspective-1000"
                    >
                      <motion.div
                        className="w-full h-full relative preserve-3d cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        {/* Front */}
                        <div 
                          className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-6 sm:p-12 text-center"
                          style={{ zIndex: isFlipped ? 0 : 1 }}
                        >
                          <span className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[8px] sm:text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
                            {frontSide === 'hebrew' ? (language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : language === 'german' ? 'German' : language === 'arabic' ? 'Arabic' : 'Hebrew') : 'English'}
                          </span>
                          <h2 className={`font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 ${getFontSize(frontSide === 'hebrew' ? getForeignWord(sessionCards[currentIndex], language) : sessionCards[currentIndex].english, frontSide === 'hebrew')}`} dir={frontSide === 'hebrew' && !['spanish', 'french', 'german'].includes(language) ? 'rtl' : 'ltr'}>
                            {frontSide === 'hebrew' ? getForeignWord(sessionCards[currentIndex], language) : sessionCards[currentIndex].english}
                          </h2>
                          {user && (language === 'spanish' || language === 'french' || language === 'german' || language === 'arabic') && frontSide === 'hebrew' && (
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handlePronounce(getForeignWord(sessionCards[currentIndex], language));
                              }}
                              className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors mb-2 sm:mb-4 animate-bounce-subtle"
                              title="Listen to pronunciation"
                            >
                              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          )}
                          {frontSide === 'hebrew' && sessionCards[currentIndex].transliteration && (
                            <p className="text-slate-400 dark:text-slate-500 font-medium text-lg sm:text-xl italic">
                              {sessionCards[currentIndex].transliteration}
                            </p>
                          )}
                          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-slate-300 dark:text-slate-600 flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                            <span>Flip</span>
                            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        </div>

                        {/* Back */}
                        <div 
                          className="absolute inset-0 w-full h-full backface-hidden bg-indigo-600 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-6 sm:p-12 text-center text-white"
                          style={{ 
                            transform: 'rotateY(180deg)',
                            zIndex: isFlipped ? 1 : 0
                          }}
                        >
                          <span className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[8px] sm:text-[10px] font-bold text-indigo-100 uppercase tracking-[0.2em]">
                            {frontSide === 'hebrew' ? 'English' : (language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : language === 'german' ? 'German' : language === 'arabic' ? 'Arabic' : 'Hebrew')}
                          </span>
                          <h2 className={`font-black mb-4 sm:mb-6 drop-shadow-sm ${getFontSize(frontSide === 'hebrew' ? sessionCards[currentIndex].english : getForeignWord(sessionCards[currentIndex], language), frontSide === 'english')}`} dir={frontSide === 'english' && !['spanish', 'french', 'german'].includes(language) ? 'rtl' : 'ltr'}>
                            {frontSide === 'hebrew' ? sessionCards[currentIndex].english : getForeignWord(sessionCards[currentIndex], language)}
                          </h2>
                          {user && (language === 'spanish' || language === 'french' || language === 'german' || language === 'arabic') && frontSide === 'english' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePronounce(getForeignWord(sessionCards[currentIndex], language));
                              }}
                              className="p-2.5 sm:p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors mb-2 sm:mb-4"
                              title="Listen to pronunciation"
                            >
                              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          )}
                          <p className="text-indigo-100 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                            {sessionCards[currentIndex].category}
                          </p>
                          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-indigo-100 flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                            <span>Flip</span>
                            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none">
                {(isPremium || devMode) && srsSettings?.advancedMode && isFlipped ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full"
                  >
                    <button
                      onClick={() => handleMarkResult('forgot')}
                      disabled={isTransitioning}
                      className="group flex flex-col items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 leading-none transition-transform group-hover:scale-110">❌</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Forgot</span>
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 sm:mt-1">1 Min</span>
                    </button>
                    <button
                      onClick={() => handleMarkResult('partial')}
                      disabled={isTransitioning}
                      className="group flex flex-col items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 leading-none transition-transform group-hover:scale-110">🤔</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Partial</span>
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 sm:mt-1">5 Days</span>
                    </button>
                    <button
                      onClick={() => handleMarkResult('quick')}
                      disabled={isTransitioning}
                      className="group flex flex-col items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 leading-none transition-transform group-hover:scale-110">🙂</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Quick</span>
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 sm:mt-1">11 Days</span>
                    </button>
                    <button
                      onClick={() => handleMarkResult('instant')}
                      disabled={isTransitioning}
                      className="group flex flex-col items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 leading-none transition-transform group-hover:scale-110">⚡</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Instant</span>
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 sm:mt-1">14 Days</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-8 w-full max-w-md justify-between px-2 sm:px-4 shrink-0 transition-all">
                    {(!srsSettings?.advancedMode || (!isPremium && !devMode)) && (
                      <button
                        onClick={() => handleMarkIncorrect()}
                        disabled={isTransitioning}
                        className="group flex flex-col items-center gap-1.5 sm:gap-2 disabled:opacity-50 flex-1"
                      >
                        <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all relative mx-auto">
                          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                          <div className="absolute -top-1 -left-1 sm:-top-1.5 sm:-left-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center font-bold">
                            {batchIncorrectCount}
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center group-hover:text-red-500 whitespace-nowrap">Learn</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      disabled={isTransitioning}
                      className="px-5 sm:px-12 py-3.5 sm:py-5 bg-slate-900 dark:bg-slate-800 text-white font-black uppercase text-xs tracking-widest rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-95 text-center flex-1 max-w-[140px] sm:max-w-none hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                      Flip Card
                    </button>

                    {(!srsSettings?.advancedMode || (!isPremium && !devMode)) && (
                      <button
                        onClick={() => handleMarkCorrect()}
                        disabled={isTransitioning}
                        className="group flex flex-col items-center gap-1.5 sm:gap-2 disabled:opacity-50 flex-1"
                      >
                        <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-green-500 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 transition-all relative mx-auto">
                          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                          <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center font-bold">
                            {batchCorrectCount}
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center group-hover:text-green-500 whitespace-nowrap">Know</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-16 text-center text-slate-400 dark:text-slate-500 text-xs font-medium space-y-3 shrink-0">
              {enableKeyboard ? (
                <p className="hidden md:block">Tip: <span className="font-bold text-slate-600 dark:text-slate-300">Space</span> to flip • <span className="font-bold text-slate-600 dark:text-slate-300">←</span> Still Learning • <span className="font-bold text-slate-600 dark:text-slate-300">→</span> Know it</p>
              ) : (
                <p className="text-red-400 font-bold">Keyboard shortcuts disabled</p>
              )}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setEnableKeyboard(!enableKeyboard)}
                  className="text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                >
                  {enableKeyboard ? "Disable Keyboard Shortcuts" : "Enable Keyboard Shortcuts"}
                </button>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Vocariox</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-20 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className={`w-8 h-8 text-slate-400 ${isTransitioning ? 'animate-spin' : ''}`} />
            </div>
            <p className="text-slate-400 mb-8 font-medium">
              {isTransitioning ? "Loading next card..." : "No cards available in this session."}
            </p>
            {!isTransitioning && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleShuffle}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                >
                  Reset Deck
                </button>
                <button
                  onClick={onExit}
                  className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
