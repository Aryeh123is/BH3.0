import { useState, useMemo, useEffect } from 'react';
import { Word, Question, QuestionType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  RotateCcw, 
  Check, 
  X,
  Keyboard,
  MousePointer2,
  HelpCircle,
  History as HistoryIcon,
  Calendar
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { safeLocalStorage } from '../lib/storage';

interface TestModeProps {
  vocabulary: Word[];
  onExit: () => void;
  language: 'biblical' | 'modern' | 'spanish';
}

interface TestResult {
  date: number;
  score: number;
  total: number;
  percentage: number;
  language: string;
  answers: { word: string, translation: string, correct: boolean, type: QuestionType }[];
}

type TestStep = 'setup' | 'testing' | 'results' | 'history';

export function TestMode({ vocabulary, onExit, language }: TestModeProps) {
  const [step, setStep] = useState<TestStep>('setup');
  const [testCount, setTestCount] = useState<number>(Math.min(20, vocabulary.length));
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['written', 'matching', 'true-false']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>(() => {
    const saved = safeLocalStorage.getItem(`bh-test-history-${language}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Matching state
  const [matchingPairs, setMatchingPairs] = useState<{ id: string, word: string, translation: string }[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<{ wordId: string, transId: string } | null>(null);

  const startTest = () => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, testCount);
    
    const generatedQuestions: Question[] = shuffled.map(word => {
      // Pick a random type from selected types
      const type = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];

      let options: string[] | undefined;
      let correctAnswer = word.english;

      if (type === 'true-false') {
        const isTrue = Math.random() > 0.5;
        if (!isTrue) {
          const otherWords = vocabulary.filter(w => w.id !== word.id);
          const distractor = otherWords[Math.floor(Math.random() * otherWords.length)].english;
          options = [distractor]; // Use options[0] as the "shown" translation
          correctAnswer = 'false';
        } else {
          options = [word.english];
          correctAnswer = 'true';
        }
      } else if (type === 'matching') {
        // Matching is handled a bit differently, we'll group them in sets of 5
        correctAnswer = word.english;
      }

      return {
        word,
        type,
        options,
        correctAnswer
      };
    });

    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(null));
    setCurrentIndex(0);
    setStep('testing');
  };

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion?.type === 'matching' && step === 'testing') {
      // Prepare matching pairs for the next 5 words (or remaining)
      const batchSize = 5;
      const batch = questions.slice(currentIndex, currentIndex + batchSize);
      const pairs = batch.map(q => ({
        id: q.word.id,
        word: q.word.hebrew,
        translation: q.word.english
      }));
      setMatchingPairs(pairs);
      setMatchedIds([]);
      setSelectedWord(null);
      setSelectedTranslation(null);
    }
  }, [currentIndex, step, questions]);

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = correct;
      setAnswers(newAnswers);
      
      setShowFeedback(false);
      setWrittenAnswer('');
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishTest(newAnswers);
      }
    }, 1000);
  };

  const finishTest = (finalAnswers: (boolean | null)[]) => {
    const score = finalAnswers.filter(a => a === true).length;
    const result: TestResult = {
      date: Date.now(),
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      language,
      answers: questions.map((q, i) => ({
        word: q.word.hebrew,
        translation: q.word.english,
        correct: finalAnswers[i] === true,
        type: q.type
      }))
    };

    const newHistory = [result, ...testHistory].slice(0, 20);
    setTestHistory(newHistory);
    safeLocalStorage.setItem(`bh-test-history-${language}`, JSON.stringify(newHistory));
    setStep('results');
  };

  const handleMatchingMatch = (wordId: string, translationId: string) => {
    if (wordId === translationId) {
      const newMatched = [...matchedIds, wordId];
      setMatchedIds(newMatched);
      setSelectedWord(null);
      setSelectedTranslation(null);

      // Mark this specific word as correct in answers
      const newAnswers = [...answers];
      const qIndex = questions.findIndex((q, idx) => idx >= currentIndex && idx < currentIndex + matchingPairs.length && q.word.id === wordId);
      if (qIndex !== -1) {
        newAnswers[qIndex] = true;
      }
      setAnswers(newAnswers);

      // If all in batch matched
      if (newMatched.length === matchingPairs.length) {
        setTimeout(() => {
          if (currentIndex + matchingPairs.length < questions.length) {
            setCurrentIndex(prev => prev + matchingPairs.length);
          } else {
            finishTest(newAnswers);
          }
        }, 500);
      }
    } else {
      // Wrong match
      setWrongMatch({ wordId, transId: translationId });
      
      // Mark this specific word as incorrect in answers
      const newAnswers = [...answers];
      const qIndex = questions.findIndex((q, idx) => idx >= currentIndex && idx < currentIndex + matchingPairs.length && q.word.id === wordId);
      if (qIndex !== -1) {
        newAnswers[qIndex] = false;
      }
      setAnswers(newAnswers);

      // Move on after a delay
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedWord(null);
        setSelectedTranslation(null);
        
        // Even if wrong, we "match" it so it disappears and we move on
        const newMatched = [...matchedIds, wordId];
        setMatchedIds(newMatched);

        if (newMatched.length === matchingPairs.length) {
          if (currentIndex + matchingPairs.length < questions.length) {
            setCurrentIndex(prev => prev + matchingPairs.length);
          } else {
            finishTest(newAnswers);
          }
        }
      }, 800);
    }
  };

  const score = answers.filter(a => a === true).length;
  const percentage = Math.round((score / questions.length) * 100);

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // Must have at least one
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <button onClick={onExit} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Test Setup</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Customize your challenge</p>
              </div>
            </div>
            {testHistory.length > 0 && (
              <button 
                onClick={() => setStep('history')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </button>
            )}
          </div>

          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Number of Words</label>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-lg">{testCount} / {vocabulary.length}</span>
              </div>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="5" 
                  max={vocabulary.length} 
                  value={testCount}
                  onChange={(e) => setTestCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="grid grid-cols-4 gap-3">
                  {[10, 25, 50, vocabulary.length].map(count => (
                    <button
                      key={count}
                      onClick={() => setTestCount(count)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        testCount === count 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {count === vocabulary.length ? 'Max' : count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Test Types (Select one or more)</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'matching', name: 'Join the Words', icon: MousePointer2, desc: 'Match Hebrew/Spanish with English' },
                  { id: 'written', name: 'Writing Answer', icon: Keyboard, desc: 'Type the correct translation' },
                  { id: 'true-false', name: 'True / False', icon: CheckCircle2, desc: 'Quickly verify translations' },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id as QuestionType)}
                    className={`p-5 rounded-3xl font-bold transition-all flex items-center gap-5 border-2 text-left ${
                      selectedTypes.includes(type.id as QuestionType)
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-transparent bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedTypes.includes(type.id as QuestionType) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900'
                    }`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`text-lg font-black ${selectedTypes.includes(type.id as QuestionType) ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                        {type.name}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{type.desc}</div>
                    </div>
                    {selectedTypes.includes(type.id as QuestionType) && (
                      <div className="ml-auto w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={startTest}
                className="w-full py-8 bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1.5 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                <span>🚀 Start Your Test</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">
                {testCount} words • {selectedTypes.length} modes active
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'history') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setStep('setup')} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Test History</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Your previous performance</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {testHistory.map((test, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    test.percentage >= 80 ? 'bg-green-100 text-green-600' : 
                    test.percentage >= 50 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {test.percentage}%
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white">{test.score} / {test.total} correct</div>
                    <div className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(test.date).toLocaleDateString()} at {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-primary transition-colors">
                  {test.language}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('setup')}
            className="w-full mt-8 py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
          >
            Back to Setup
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'results') {
    const correctAnswers = questions.filter((_, i) => answers[i] === true);
    const incorrectAnswers = questions.filter((_, i) => answers[i] === false);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-400/20">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-2">Test Complete!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Here's how you performed</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] text-center">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{score}/{questions.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] text-center">
              <div className="text-4xl font-black text-primary mb-1">{percentage}%</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-black text-green-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                What you got right ({correctAnswers.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {correctAnswers.map((q, i) => (
                  <div key={i} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white" dir={language === 'spanish' ? 'ltr' : 'rtl'}>{q.word.hebrew}</div>
                    <div className="text-sm text-green-600 font-medium">{q.word.english}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Mistakes to review ({incorrectAnswers.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {incorrectAnswers.map((q, i) => (
                  <div key={i} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white" dir={language === 'spanish' ? 'ltr' : 'rtl'}>{q.word.hebrew}</div>
                    <div className="text-sm text-red-600 font-medium">{q.word.english}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setStep('setup');
                setCurrentIndex(0);
                setAnswers([]);
              }}
              className="py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={onExit}
              className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onExit} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex gap-2">
              <span className="text-green-500">{answers.filter(a => a === true).length} Correct</span>
              <span className="text-red-500">{answers.filter(a => a === false).length} Incorrect</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-full flex-1 transition-colors duration-300 border-r border-white/10 last:border-0 ${
                  answers[i] === true ? 'bg-green-500' : 
                  answers[i] === false ? 'bg-red-500' : 
                  i === currentIndex ? 'bg-primary animate-pulse' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
        >
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm ${
                isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <div className={`p-6 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white shadow-2xl`}>
                {isCorrect ? <Check className="w-12 h-12" /> : <X className="w-12 h-12" />}
              </div>
            </motion.div>
          )}

          {currentQuestion.type === 'written' && (
            <div className="text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Translate this word</div>
              <div className="text-6xl font-black mb-12 text-slate-900 dark:text-white" dir={language === 'spanish' ? 'ltr' : 'rtl'}>
                {currentQuestion.word.hebrew}
              </div>
              <input
                autoFocus
                type="text"
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && writtenAnswer.trim()) {
                    handleAnswer(writtenAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase());
                  }
                }}
                placeholder="Type the English translation..."
                className="w-full max-w-md mx-auto block py-4 px-6 text-xl font-bold text-center bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all"
              />
              <button
                disabled={!writtenAnswer.trim()}
                onClick={() => handleAnswer(writtenAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase())}
                className="mt-8 px-12 py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Submit Answer
              </button>
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div className="text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Is this translation correct?</div>
              <div className="text-6xl font-black mb-4 text-slate-900 dark:text-white" dir={language === 'spanish' ? 'ltr' : 'rtl'}>
                {currentQuestion.word.hebrew}
              </div>
              <div className="text-2xl font-bold text-primary mb-12 italic">
                "{currentQuestion.options?.[0]}"
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => handleAnswer(currentQuestion.correctAnswer === 'true')}
                  className="py-6 bg-green-500 text-white font-black text-xl rounded-3xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  True
                </button>
                <button
                  onClick={() => handleAnswer(currentQuestion.correctAnswer === 'false')}
                  className="py-6 bg-red-500 text-white font-black text-xl rounded-3xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <X className="w-6 h-6" />
                  False
                </button>
              </div>
            </div>
          )}

          {currentQuestion.type === 'matching' && (
            <div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Match the pairs</div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  {matchingPairs.map(pair => (
                    <button
                      key={pair.id}
                      disabled={matchedIds.includes(pair.id)}
                      onClick={() => {
                        if (selectedTranslation) {
                          handleMatchingMatch(pair.id, selectedTranslation);
                        } else {
                          setSelectedWord(pair.id === selectedWord ? null : pair.id);
                        }
                      }}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all text-right border-2 ${
                        matchedIds.includes(pair.id)
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-200 dark:border-green-900/50 opacity-50 cursor-default'
                          : wrongMatch?.wordId === pair.id
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-500 shadow-lg animate-shake'
                          : selectedWord === pair.id
                          ? 'bg-primary text-white border-primary shadow-lg scale-105'
                          : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:bg-slate-100'
                      }`}
                      dir={language === 'spanish' ? 'ltr' : 'rtl'}
                    >
                      {pair.word}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {[...matchingPairs].sort((a, b) => a.translation.localeCompare(b.translation)).map(pair => (
                    <button
                      key={pair.id}
                      disabled={matchedIds.includes(pair.id)}
                      onClick={() => {
                        if (selectedWord) {
                          handleMatchingMatch(selectedWord, pair.id);
                        } else {
                          setSelectedTranslation(pair.id === selectedTranslation ? null : pair.id);
                        }
                      }}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all text-left border-2 ${
                        matchedIds.includes(pair.id)
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-200 dark:border-green-900/50 opacity-50 cursor-default'
                          : wrongMatch?.transId === pair.id
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-500 shadow-lg animate-shake'
                          : selectedTranslation === pair.id
                          ? 'bg-primary text-white border-primary shadow-lg scale-105'
                          : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {pair.translation}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
