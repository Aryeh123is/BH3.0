import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Volume2, Book, Trophy, RotateCcw, Layers } from 'lucide-react';

interface FlashcardModeProps {
  vocabulary: Word[];
  onExit: () => void;
  onSwitchToLearn: () => void;
  onWordProgress: (wordId: string, isCorrect: boolean) => void;
  language: 'biblical' | 'modern';
}

export function FlashcardMode({ vocabulary, onExit, onSwitchToLearn, onWordProgress, language }: FlashcardModeProps) {
  const SESSION_KEY = `bh-flashcard-session-${language}`;

  const [sessionState, setSessionState] = useState<{
    sessionCards: Word[];
    stillLearningPile: Word[];
    currentIndex: number;
    correctCount: number;
    incorrectCount: number;
    batchCounter: number;
    batchCorrectCount: number;
    batchIncorrectCount: number;
    initialTotal: number;
    isFinished: boolean;
    showBatchSummary: boolean;
  }>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        sessionCards: parsed.sessionCards || [],
        stillLearningPile: parsed.stillLearningPile || [],
        currentIndex: parsed.currentIndex || 0,
        correctCount: parsed.correctCount || 0,
        incorrectCount: parsed.incorrectCount || 0,
        batchCounter: parsed.batchCounter || 0,
        batchCorrectCount: parsed.batchCorrectCount || 0,
        batchIncorrectCount: parsed.batchIncorrectCount || 0,
        initialTotal: parsed.initialTotal || vocabulary.length,
        isFinished: parsed.isFinished || false,
        showBatchSummary: parsed.showBatchSummary || false
      };
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
      initialTotal: vocabulary.length,
      isFinished: false,
      showBatchSummary: false
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
    initialTotal, 
    isFinished, 
    showBatchSummary 
  } = sessionState;

  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enableKeyboard, setEnableKeyboard] = useState(true);
  const [history, setHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved).history || [];
    } catch (e) {
      console.error("Error parsing history from localStorage", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      const stateToSave = {
        ...sessionState,
        history
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  }, [sessionState, history, SESSION_KEY]);

  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, { ...sessionState }]);
  }, [sessionState]);

  const handleBack = useCallback(() => {
    if (history.length === 0 || isTransitioning) return;
    
    const prevState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    setSessionState(prevState);
    setIsFlipped(false);
    setDirection(0);
  }, [history, isTransitioning]);

  const recycleStillLearning = useCallback(() => {
    saveToHistory();
    setSessionState(prev => {
      const combined = [...prev.sessionCards, ...prev.stillLearningPile].sort(() => Math.random() - 0.5);
      return {
        ...prev,
        sessionCards: combined,
        stillLearningPile: [],
        batchCounter: 0,
        currentIndex: 0,
        batchCorrectCount: 0,
        batchIncorrectCount: 0,
        showBatchSummary: false
      };
    });
    setIsFlipped(false);
    setDirection(0);
  }, [saveToHistory]);

  const processCardTransition = useCallback((isCorrect: boolean, word: Word) => {
    setSessionState(prev => {
      const nextBatchCount = prev.batchCounter + 1;
      const isBatchEnd = nextBatchCount >= 25;
      
      const nextStillLearning = isCorrect ? prev.stillLearningPile : [...prev.stillLearningPile, word];
      const nextCards = prev.sessionCards.filter(c => c.id !== word.id);
      const isSessionEnd = nextCards.length === 0 && nextStillLearning.length === 0;

      if (isSessionEnd) {
        return {
          ...prev,
          sessionCards: [],
          stillLearningPile: [],
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          isFinished: true,
          showBatchSummary: false,
          currentIndex: 0
        };
      } 
      
      if (isBatchEnd) {
        return {
          ...prev,
          sessionCards: nextCards,
          stillLearningPile: nextStillLearning,
          batchCounter: nextBatchCount,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
          batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
          showBatchSummary: true,
          currentIndex: 0
        };
      } 
      
      if (nextCards.length === 0) {
        // Recycle
        const combined = [...nextStillLearning].sort(() => Math.random() - 0.5);
        return {
          ...prev,
          sessionCards: combined,
          stillLearningPile: [],
          currentIndex: 0,
          correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
          incorrectCount: isCorrect ? prev.incorrectCount : prev.incorrectCount + 1,
          batchCorrectCount: isCorrect ? prev.batchCorrectCount + 1 : prev.batchCorrectCount,
          batchIncorrectCount: isCorrect ? prev.batchIncorrectCount : prev.batchIncorrectCount + 1,
          batchCounter: nextBatchCount
        };
      } 

      // Normal progression
      const nextIndex = prev.currentIndex >= nextCards.length ? 0 : prev.currentIndex;
      return {
        ...prev,
        sessionCards: nextCards,
        stillLearningPile: nextStillLearning,
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
  }, []);

  const handleMarkCorrect = useCallback(() => {
    if (isTransitioning || showBatchSummary || isFinished) return;
    const currentWord = sessionCards[currentIndex];
    if (!currentWord) return;
    
    setIsTransitioning(true);
    setDirection(1);
    setIsFlipped(false);
    
    try {
      onWordProgress(currentWord.id, true);
    } catch (err) {
      console.error("Error updating word progress:", err);
    }
    
    saveToHistory();
    processCardTransition(true, currentWord);
  }, [isTransitioning, showBatchSummary, isFinished, sessionCards, currentIndex, onWordProgress, saveToHistory, processCardTransition]);

  const handleMarkIncorrect = useCallback(() => {
    if (isTransitioning || showBatchSummary || isFinished) return;
    const currentWord = sessionCards[currentIndex];
    if (!currentWord) return;
    
    setIsTransitioning(true);
    setDirection(-1);
    setIsFlipped(false);
    
    try {
      onWordProgress(currentWord.id, false);
    } catch (err) {
      console.error("Error updating word progress:", err);
    }
    
    saveToHistory();
    processCardTransition(false, currentWord);
  }, [isTransitioning, showBatchSummary, isFinished, sessionCards, currentIndex, onWordProgress, saveToHistory, processCardTransition]);

  useEffect(() => {
    if (isFinished || showBatchSummary || !enableKeyboard) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const keysToPrevent = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      if (keysToPrevent.includes(e.key) || keysToPrevent.includes(e.code)) {
         e.preventDefault();
      }

      if (e.code === 'Space' || e.key === ' ') {
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
        handleMarkCorrect();
      } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
        handleMarkIncorrect();
      } else if (e.code === 'Backspace' || e.key === 'Backspace' || (e.metaKey && (e.code === 'ArrowLeft' || e.key === 'ArrowLeft'))) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, showBatchSummary, enableKeyboard, handleMarkCorrect, handleMarkIncorrect, handleBack]);

  const handleContinueNextBatch = useCallback(() => {
    recycleStillLearning();
  }, [recycleStillLearning]);

  const handleShuffle = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
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
      initialTotal: vocabulary.length,
      isFinished: false,
      showBatchSummary: false
    });
    setIsFlipped(false);
    setIsTransitioning(false);
    setDirection(0);
  }, [vocabulary]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* WIP Indicator */}
      {language === 'modern' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-4 py-1.5 bg-yellow-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg border-2 border-white flex items-center gap-2">
            <span className="animate-pulse">⚠️</span>
            Work in Progress
            <span className="animate-pulse">⚠️</span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showBatchSummary ? (
          <motion.div 
            key="batch-summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="bg-white p-12 rounded-[3rem] shadow-soft border border-slate-100 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Layers className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Batch Complete!</h2>
              <p className="text-slate-500 mb-8">
                You've completed 25 cards. The {stillLearningPile.length} cards you're still learning will be shuffled back into the pile.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-green-600">{batchCorrectCount}</div>
                  <div className="text-[10px] font-bold text-green-600/60 uppercase tracking-wider">Correct</div>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl">
                  <div className="text-2xl font-bold text-red-600">{batchIncorrectCount}</div>
                  <div className="text-[10px] font-bold text-red-600/60 uppercase tracking-wider">Incorrect</div>
                </div>
              </div>

              <button
                onClick={handleContinueNextBatch}
                className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Continue to Next Batch
              </button>
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
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Deck Mastered!</h2>
            <p className="text-gray-500 mb-12 text-lg">You've successfully reviewed all {vocabulary.length} words.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleShuffle}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
              >
                Restart Deck
              </button>
              <button
                onClick={onExit}
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
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
            className="max-w-[1100px] mx-auto px-6 py-8 flex-1 flex flex-col w-full"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={onExit}
                  className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-hover font-bold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Undo
                  </button>
                )}
                <button
                  onClick={onSwitchToLearn}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold hover:bg-primary/10 transition-all"
                >
                  <Book className="w-4 h-4" />
                  Switch to Learn
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Total</span>
                    <span className="text-red-500 bg-red-50 px-3 py-1 rounded-lg" title="Total Still Learning">{incorrectCount}</span>
                    <span className="text-green-500 bg-green-50 px-3 py-1 rounded-lg" title="Total Known">{correctCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 ml-2" title="Cards until next shuffle">
                    <RotateCw className="w-3 h-3" />
                    <span>{25 - batchCounter}</span>
                  </div>
                </div>
                <button
                  onClick={handleShuffle}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  title="Shuffle Deck"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {initialTotal - sessionCards.length + 1} / {initialTotal}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
              <div className="relative w-full max-w-xl aspect-[4/3]">
                <AnimatePresence mode="popLayout">
                  {sessionCards[currentIndex] && (
                    <motion.div
                      key={sessionCards[currentIndex].id}
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
                          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[3rem] shadow-soft border border-slate-100 flex flex-col items-center justify-center p-12 text-center"
                          style={{ zIndex: isFlipped ? 0 : 1 }}
                        >
                          <span className="absolute top-10 left-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Hebrew</span>
                          <h2 className="text-8xl font-bold text-slate-900 mb-6" dir="rtl">
                            {sessionCards[currentIndex].hebrew}
                          </h2>
                          <p className="text-slate-400 font-medium text-xl italic">
                            {sessionCards[currentIndex].transliteration}
                          </p>
                          <div className="absolute bottom-10 right-10 text-slate-300 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span>Click to flip</span>
                            <RotateCw className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Back */}
                        <div 
                          className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white"
                          style={{ 
                            transform: 'rotateY(180deg)',
                            zIndex: isFlipped ? 1 : 0
                          }}
                        >
                          <span className="absolute top-10 left-10 text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em]">English</span>
                          <h2 className="text-6xl font-black mb-6 drop-shadow-sm">
                            {sessionCards[currentIndex].english}
                          </h2>
                          <p className="text-blue-100 font-bold uppercase tracking-[0.2em] text-xs">
                            {sessionCards[currentIndex].category}
                          </p>
                          <div className="absolute bottom-10 right-10 text-blue-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span>Click to flip</span>
                            <RotateCw className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-12">
                <button
                  onClick={handleMarkIncorrect}
                  disabled={isTransitioning}
                  className="group flex flex-col items-center gap-3 disabled:opacity-50"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-3xl shadow-soft border border-slate-100 text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all relative">
                    <ChevronLeft className="w-10 h-10" />
                    <div className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {batchIncorrectCount}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-red-500">Still Learning</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  disabled={isTransitioning}
                  className="px-16 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  Flip Card
                </button>

                <button
                  onClick={handleMarkCorrect}
                  disabled={isTransitioning}
                  className="group flex flex-col items-center gap-3 disabled:opacity-50"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-3xl shadow-soft border border-slate-100 text-green-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all relative">
                    <ChevronRight className="w-10 h-10" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {batchCorrectCount}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-green-500">Know it</span>
                </button>
              </div>
            </div>

            <div className="mt-16 text-center text-slate-400 text-sm font-medium space-y-4">
              {enableKeyboard ? (
                <p>Tip: <span className="font-bold text-slate-600">Space</span> to flip • <span className="font-bold text-slate-600">←</span> Still Learning • <span className="font-bold text-slate-600">→</span> Know it</p>
              ) : (
                <p className="text-red-400 font-bold">Keyboard shortcuts disabled</p>
              )}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setEnableKeyboard(!enableKeyboard)}
                  className="text-[10px] uppercase tracking-widest text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {enableKeyboard ? "Disable Keyboard Shortcuts" : "Enable Keyboard Shortcuts"}
                </button>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Created by Aryeh Isaac-Saul</p>
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
