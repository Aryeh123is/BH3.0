import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Volume2, Book, Trophy, RotateCcw, Layers } from 'lucide-react';

interface FlashcardModeProps {
  vocabulary: Word[];
  onExit: () => void;
  onSwitchToLearn: () => void;
  onWordProgress: (wordId: string, isCorrect: boolean) => void;
}

export function FlashcardMode({ vocabulary, onExit, onSwitchToLearn, onWordProgress }: FlashcardModeProps) {
  const [sessionCards, setSessionCards] = useState<Word[]>(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).sessionCards;
    return [...vocabulary].sort(() => Math.random() - 0.5);
  });
  const [initialTotal] = useState(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).initialTotal;
    return vocabulary.length;
  });
  const [stillLearningPile, setStillLearningPile] = useState<Word[]>(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).stillLearningPile;
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).currentIndex;
    return 0;
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).correctCount;
    return 0;
  });
  const [incorrectCount, setIncorrectCount] = useState(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).incorrectCount;
    return 0;
  });
  const [batchCorrectCount, setBatchCorrectCount] = useState(0);
  const [batchIncorrectCount, setBatchIncorrectCount] = useState(0);
  const [batchCounter, setBatchCounter] = useState(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).batchCounter;
    return 0;
  });
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isFinished, setIsFinished] = useState(false);
  const [showBatchSummary, setShowBatchSummary] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [history, setHistory] = useState<{
    sessionCards: Word[];
    stillLearningPile: Word[];
    currentIndex: number;
    correctCount: number;
    incorrectCount: number;
    batchCounter: number;
  }[]>(() => {
    const saved = localStorage.getItem('bh-flashcard-session');
    if (saved) return JSON.parse(saved).history || [];
    return [];
  });

  useEffect(() => {
    if (isFinished) {
      localStorage.removeItem('bh-flashcard-session');
      return;
    }
    const state = {
      sessionCards,
      initialTotal,
      stillLearningPile,
      currentIndex,
      correctCount,
      incorrectCount,
      batchCounter,
      history
    };
    localStorage.setItem('bh-flashcard-session', JSON.stringify(state));
  }, [sessionCards, initialTotal, stillLearningPile, currentIndex, correctCount, incorrectCount, batchCounter, history, isFinished]);

  const saveToHistory = () => {
    setHistory(prev => [...prev, {
      sessionCards: [...sessionCards],
      stillLearningPile: [...stillLearningPile],
      currentIndex,
      correctCount,
      incorrectCount,
      batchCounter
    }]);
  };

  const handleBack = () => {
    if (history.length === 0 || isTransitioning) return;
    
    const prevState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    setSessionCards(prevState.sessionCards);
    setStillLearningPile(prevState.stillLearningPile);
    setCurrentIndex(prevState.currentIndex);
    setCorrectCount(prevState.correctCount);
    setIncorrectCount(prevState.incorrectCount);
    setBatchCounter(prevState.batchCounter);
    setIsFlipped(false);
    setDirection(0);
    setIsFinished(false);
    setShowBatchSummary(false);
  };

  const recycleStillLearning = (currentSession: Word[], currentStillLearning: Word[]) => {
    saveToHistory();
    const combined = [...currentSession, ...currentStillLearning].sort(() => Math.random() - 0.5);
    setSessionCards(combined);
    setStillLearningPile([]);
    setBatchCounter(0);
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
  };

  const handleMarkCorrect = () => {
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
    setCorrectCount(prev => prev + 1);
    setBatchCorrectCount(prev => prev + 1);
    
    const nextBatchCount = batchCounter + 1;
    const nextCards = sessionCards.filter((_, i) => i !== currentIndex);
    
    setTimeout(() => {
      const isSessionEnd = nextCards.length === 0 && stillLearningPile.length === 0;
      const isBatchEnd = nextBatchCount >= 25;

      if (isSessionEnd) {
        setIsFinished(true);
      } else if (isBatchEnd) {
        setSessionCards(nextCards);
        setBatchCounter(nextBatchCount);
        setShowBatchSummary(true);
      } else if (nextCards.length === 0) {
        // Recycle
        const combined = [...stillLearningPile].sort(() => Math.random() - 0.5);
        setSessionCards(combined);
        setStillLearningPile([]);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(0);
      } else {
        setSessionCards(nextCards);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(prev => (prev >= nextCards.length ? 0 : prev));
      }
      setDirection(0);
      setIsTransitioning(false);
    }, 250);
  };

  const handleMarkIncorrect = () => {
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
    setIncorrectCount(prev => prev + 1);
    setBatchIncorrectCount(prev => prev + 1);
    
    const nextBatchCount = batchCounter + 1;
    const nextStillLearning = [...stillLearningPile, currentWord];
    const nextCards = sessionCards.filter((_, i) => i !== currentIndex);
    
    setTimeout(() => {
      const isSessionEnd = nextCards.length === 0 && nextStillLearning.length === 0;
      const isBatchEnd = nextBatchCount >= 25;

      if (isSessionEnd) {
        setIsFinished(true);
      } else if (isBatchEnd) {
        setSessionCards(nextCards);
        setStillLearningPile(nextStillLearning);
        setBatchCounter(nextBatchCount);
        setShowBatchSummary(true);
      } else if (nextCards.length === 0) {
        // Recycle
        const combined = [...nextStillLearning].sort(() => Math.random() - 0.5);
        setSessionCards(combined);
        setStillLearningPile([]);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(0);
      } else {
        setSessionCards(nextCards);
        setStillLearningPile(nextStillLearning);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(prev => (prev >= nextCards.length ? 0 : prev));
      }
      setDirection(0);
      setIsTransitioning(false);
    }, 250);
  };

  useEffect(() => {
    if (isFinished || showBatchSummary) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for these keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) || ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
           e.preventDefault();
        }
      }

      if (e.code === 'Space' || e.key === ' ') {
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
        handleMarkCorrect();
      } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
        handleMarkIncorrect();
      } else if (e.code === 'Backspace' || e.key === 'Backspace' || (e.metaKey && (e.code === 'ArrowLeft' || e.key === 'ArrowLeft'))) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, showBatchSummary, handleMarkCorrect, handleMarkIncorrect, handleBack]);

  const handleContinueNextBatch = () => {
    recycleStillLearning(sessionCards, stillLearningPile);
    setBatchCorrectCount(0);
    setBatchIncorrectCount(0);
    setShowBatchSummary(false);
    setDirection(0);
  };

  const handleShuffle = () => {
    setHistory([]);
    setSessionCards([...vocabulary].sort(() => Math.random() - 0.5));
    setStillLearningPile([]);
    setBatchCounter(0);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsFinished(false);
  };

  if (showBatchSummary) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-soft border border-slate-100 max-w-md w-full text-center"
        >
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
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
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
      </div>
    );
  }

  const currentWord = useMemo(() => sessionCards[currentIndex], [sessionCards, currentIndex]);

  if (!currentWord && !isFinished && !isTransitioning && !showBatchSummary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <p className="text-slate-400 mb-8 font-medium">No cards available in this session.</p>
        <button
          onClick={onExit}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 min-h-[80vh] flex flex-col">
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
            {currentWord && (
              <motion.div
                key={currentWord.id}
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
                    {currentWord.hebrew}
                  </h2>
                  <p className="text-slate-400 font-medium text-xl italic">
                    {currentWord.transliteration}
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
                    {currentWord.english}
                  </h2>
                  <p className="text-blue-100 font-bold uppercase tracking-[0.2em] text-xs">
                    {currentWord.category}
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

      <div className="mt-16 text-center text-slate-400 text-sm font-medium">
        <p>Tip: <span className="font-bold text-slate-600">Space</span> to flip • <span className="font-bold text-slate-600">←</span> Still Learning • <span className="font-bold text-slate-600">→</span> Know it</p>
      </div>
    </div>
  );
}
