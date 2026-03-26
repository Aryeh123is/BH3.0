import { useState, useEffect } from 'react';
import { Word } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Volume2, Book, Trophy, RotateCcw } from 'lucide-react';

interface FlashcardModeProps {
  vocabulary: Word[];
  onExit: () => void;
  onSwitchToLearn: () => void;
  onWordProgress: (wordId: string, isCorrect: boolean) => void;
}

export function FlashcardMode({ vocabulary, onExit, onSwitchToLearn, onWordProgress }: FlashcardModeProps) {
  const [sessionCards, setSessionCards] = useState([...vocabulary].sort(() => Math.random() - 0.5));
  const [stillLearningPile, setStillLearningPile] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [batchCounter, setBatchCounter] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<{
    sessionCards: Word[];
    stillLearningPile: Word[];
    currentIndex: number;
    correctCount: number;
    incorrectCount: number;
    batchCounter: number;
  }[]>([]);

  useEffect(() => {
    if (isFinished) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleMarkCorrect();
      } else if (e.code === 'ArrowLeft') {
        handleMarkIncorrect();
      } else if (e.code === 'Backspace' || (e.metaKey && e.code === 'ArrowLeft')) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sessionCards, isFinished, stillLearningPile, batchCounter, history]);

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
    if (history.length === 0) return;
    
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
    const currentWord = sessionCards[currentIndex];
    onWordProgress(currentWord.id, true);
    
    saveToHistory();
    setIsFlipped(false); // Reset flip immediately
    setDirection(1);
    setCorrectCount(prev => prev + 1);
    
    const nextBatchCount = batchCounter + 1;
    const nextCards = sessionCards.filter((_, i) => i !== currentIndex);
    
    setTimeout(() => {
      if (nextBatchCount >= 15 && (nextCards.length > 0 || stillLearningPile.length > 0)) {
        recycleStillLearning(nextCards, stillLearningPile);
      } else if (nextCards.length === 0 && stillLearningPile.length === 0) {
        setIsFinished(true);
      } else if (nextCards.length === 0 && stillLearningPile.length > 0) {
        recycleStillLearning([], stillLearningPile);
      } else {
        setSessionCards(nextCards);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(prev => prev >= nextCards.length ? 0 : prev);
        setDirection(0);
      }
    }, 100);
  };

  const handleMarkIncorrect = () => {
    const currentWord = sessionCards[currentIndex];
    onWordProgress(currentWord.id, false);
    
    saveToHistory();
    setIsFlipped(false); // Reset flip immediately
    setDirection(-1);
    setIncorrectCount(prev => prev + 1);
    
    const nextBatchCount = batchCounter + 1;
    const nextStillLearning = [...stillLearningPile, currentWord];
    const nextCards = sessionCards.filter((_, i) => i !== currentIndex);
    
    setTimeout(() => {
      if (nextBatchCount >= 15) {
        recycleStillLearning(nextCards, nextStillLearning);
      } else if (nextCards.length === 0) {
        recycleStillLearning([], nextStillLearning);
      } else {
        setSessionCards(nextCards);
        setStillLearningPile(nextStillLearning);
        setBatchCounter(nextBatchCount);
        setCurrentIndex(prev => prev >= nextCards.length ? 0 : prev);
        setDirection(0);
      }
    }, 100);
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

  const currentWord = sessionCards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-700 font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Undo
            </button>
          )}
          <button
            onClick={onSwitchToLearn}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all"
          >
            <Book className="w-4 h-4" />
            Switch to Learn
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full" title="Still Learning">{incorrectCount}</span>
            <span className="text-green-500 bg-green-50 px-3 py-1 rounded-full" title="Known">{correctCount}</span>
            <div className="flex items-center gap-1 text-gray-400 ml-2" title="Cards until next shuffle">
              <RotateCw className="w-3 h-3" />
              <span>{15 - batchCounter}</span>
            </div>
          </div>
          <button
            onClick={handleShuffle}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Shuffle Deck"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {currentIndex + 1} / {sessionCards.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="relative w-full max-w-lg aspect-[4/3]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
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
                  className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-12 text-center"
                  style={{ zIndex: isFlipped ? 0 : 1 }}
                >
                  <span className="absolute top-8 left-8 text-xs font-bold text-gray-300 uppercase tracking-widest">Hebrew</span>
                  <h2 className="text-7xl font-serif font-bold text-gray-900 mb-4" dir="rtl">
                    {currentWord.hebrew}
                  </h2>
                  <p className="text-gray-400 font-medium text-lg italic">
                    {currentWord.transliteration}
                  </p>
                  <div className="absolute bottom-8 right-8 text-gray-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <span>Click to flip</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white"
                  style={{ 
                    transform: 'rotateY(180deg)',
                    zIndex: isFlipped ? 1 : 0
                  }}
                >
                  <span className="absolute top-8 left-8 text-xs font-bold text-blue-200 uppercase tracking-widest">English</span>
                  <h2 className="text-5xl font-bold mb-4">
                    {currentWord.english}
                  </h2>
                  <p className="text-blue-200 font-bold uppercase tracking-widest text-sm">
                    {currentWord.category}
                  </p>
                  <div className="absolute bottom-8 right-8 text-blue-200 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <span>Click to flip</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={handleMarkIncorrect}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all">
              <ChevronLeft className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-500">Still Learning</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Flip Card
          </button>

          <button
            onClick={handleMarkCorrect}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 text-green-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all">
              <ChevronRight className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-green-500">Know it</span>
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-400 text-sm font-medium">
        <p>Tip: <span className="font-bold text-gray-600">Space</span> to flip • <span className="font-bold text-gray-600">←</span> Still Learning • <span className="font-bold text-gray-600">→</span> Know it</p>
      </div>
    </div>
  );
}
