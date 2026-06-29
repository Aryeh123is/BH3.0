import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Brain, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, Star, Sparkles, Languages, Clock } from 'lucide-react';
import { spanishQuestions, frenchQuestions } from '../data/verbQuestions';
import { germanQuestions } from '../data/germanQuestions';
import { modernHebrewQuestions } from '../data/modernHebrewQuestions';
import { biblicalHebrewQuestions } from '../data/biblicalHebrewQuestions';
import { arabicQuestions } from '../data/arabicQuestions';

interface VerbMasterProps {
  language: string;
  onBack?: () => void;
  isPremium?: boolean;
  devMode?: boolean;
  onBlockPremiumFeature?: (featureName: string, description: string) => void;
}

interface VerbQuestion {
  verb: string;
  english: string;
  tense: string;
  person: string;
  answer: string;
  options: string[];
}

export function VerbMaster({ 
  language, 
  onBack,
  isPremium = false,
  devMode = false,
  onBlockPremiumFeature
}: VerbMasterProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // remaining seconds logic (5 minutes limit of Verb Master per day)
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (isPremium || devMode) return 300;
    const todayStr = new Date().toDateString();
    const rawLimit = localStorage.getItem('bh-verb-master-limit');
    let limitObj = { date: todayStr, secondsUsed: 0 };
    try {
      if (rawLimit) {
        const parsed = JSON.parse(rawLimit);
        if (parsed && typeof parsed === 'object' && parsed.date === todayStr) {
          limitObj = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse daily verb limit", e);
    }
    return Math.max(0, 300 - limitObj.secondsUsed);
  });

  useEffect(() => {
    if (isPremium || devMode) return;
    if (secondsRemaining <= 0) {
      if (onBack) onBack();
      if (onBlockPremiumFeature) {
        onBlockPremiumFeature(
          "Verb Master 5-Minute Daily Limit",
          "You have depleted your 5 minutes of free practice on the Verb Master playground for today. Upgrade to Premium for unconstrained, unlimited access to conjugations & interactive tense training!"
        );
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        const next = Math.max(0, prev - 1);
        const todayStr = new Date().toDateString();
        const secondsUsed = 300 - next;
        localStorage.setItem('bh-verb-master-limit', JSON.stringify({ date: todayStr, secondsUsed }));

        if (next <= 0) {
          clearInterval(interval);
          if (onBack) onBack();
          if (onBlockPremiumFeature) {
            onBlockPremiumFeature(
              "Verb Master 5-Minute Daily Limit",
              "You have completed your 5 minutes of free practice on the Verb Master playground for today. Upgrade to Premium for unconstrained, unlimited access to conjugations & interactive tense training!"
            );
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPremium, devMode, onBack, onBlockPremiumFeature]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Advanced learning states
  const [history, setHistory] = useState<{ question: VerbQuestion; selected: string; isCorrect: boolean }[]>([]);
  const [mistakes, setMistakes] = useState<VerbQuestion[]>([]);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
  const [masteryMultiplier, setMasteryMultiplier] = useState(1.0);
  const [playgroundQuestions, setPlaygroundQuestions] = useState<VerbQuestion[]>([]);
  const [questionsPerRound, setQuestionsPerRound] = useState<number>(15);

  const verbData = useMemo(() => {
    const data: Record<string, VerbQuestion[]> = {
      spanish: spanishQuestions,
      french: frenchQuestions,
      german: germanQuestions,
      modern: modernHebrewQuestions,
      biblical: biblicalHebrewQuestions,
      arabic: arabicQuestions
    };
    return data[language] || data['spanish'];
  }, [language]);

  const selectRandomQuestions = (allQuestions: VerbQuestion[], limit: number) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(limit, allQuestions.length));
  };

  const questionsToUse = useMemo(() => {
    if (isReviewingMistakes) return mistakes;
    return playgroundQuestions.length > 0 ? playgroundQuestions : verbData.slice(0, questionsPerRound);
  }, [isReviewingMistakes, mistakes, playgroundQuestions, verbData, questionsPerRound]);

  const currentQuestion = questionsToUse[currentQuestionIndex];

  // Dynamically compute active retention based on session accuracy so far
  const activeRetentionPct = useMemo(() => {
    if (history.length === 0) return 60;
    const correctCount = history.filter(h => h.isCorrect).length;
    return Math.round(60 + (correctCount / history.length) * 40);
  }, [history]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      setMasteryMultiplier(prev => Math.min(2.5, Number((prev + 0.3).toFixed(1))));
    } else {
      setMasteryMultiplier(1.0);
      // Log to mistakes if we aren't already reviewing mistakes
      if (!isReviewingMistakes && !mistakes.some(m => m.verb === currentQuestion.verb && m.person === currentQuestion.person)) {
        setMistakes(prev => [...prev, currentQuestion]);
      }
    }

    setHistory(prev => [...prev, { question: currentQuestion, selected: option, isCorrect: correct }]);

    setTimeout(() => {
      if (currentQuestionIndex < questionsToUse.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const restart = () => {
    const pool = verbData;
    const selected = selectRandomQuestions(pool, questionsPerRound);
    setPlaygroundQuestions(selected);

    setSessionActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setHistory([]);
    setMistakes([]);
    setIsReviewingMistakes(false);
    setMasteryMultiplier(1.0);
  };

  const startReviewingMistakes = () => {
    setSessionActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setHistory([]);
    setIsReviewingMistakes(true);
    setMasteryMultiplier(1.0);
  };

  const formatLanguageName = (lang: string) => {
    switch (lang) {
      case 'spanish': return 'Spanish';
      case 'french': return 'French';
      case 'german': return 'German';
      case 'modern': return 'Modern Hebrew';
      case 'biblical': return 'Biblical Hebrew';
      case 'arabic': return 'Arabic';
      default: return lang;
    }
  };

  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-soft border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Verb Master Playground</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-6 max-w-lg mx-auto leading-relaxed">
              Master conjugations and verb patterns perfectly. Practice high-yield {formatLanguageName(language)} verbs across all tenses.
            </p>

            {!isPremium && !devMode && (
              <div className="mb-8 max-w-sm mx-auto bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-4 rounded-2xl flex items-center gap-3 text-left">
                <Clock className="w-5 h-5 text-rose-500 shrink-0 animate-pulse" />
                <div>
                  <p className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">5-Minute Daily Trial Active</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    You have <span className="font-extrabold text-rose-600 dark:text-rose-400">{formatTime(secondsRemaining)}</span> remaining today. Upgrade to Premium for unconstrained, unlimited practice.
                  </p>
                </div>
              </div>
            )}

            {/* Questions per Round Selector option */}
            <div className="mb-10 max-w-sm mx-auto bg-slate-50 dark:bg-slate-800/40 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Questions per Round
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 25].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionsPerRound(count)}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all duration-200 ${
                      questionsPerRound === count
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={restart}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                Start Playground
                <ArrowRight className="w-5 h-5" />
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-[2rem] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Go Back
                </button>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
            <Languages className="w-64 h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-soft border border-slate-100 dark:border-slate-800 text-center"
        >
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            {isReviewingMistakes ? "Mistake Review Complete!" : "Playground Complete!"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">
            {isReviewingMistakes ? "You have successfully reviewed your incorrect verb forms." : "You mastered your verbs today."}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Score</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{score} / {questionsToUse.length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{Math.round((score / questionsToUse.length) * 100)}%</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Retention Pct</div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{activeRetentionPct}%</div>
            </div>
          </div>

          {/* Session History Logging Panel */}
          {history.length > 0 && (
            <div className="mb-10 text-left">
              <h4 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-4 px-2 uppercase tracking-wide">Session History Log</h4>
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                {history.map((entry, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>{entry.question.person} {entry.question.verb}</span>
                        <span className="text-xs text-indigo-400">({entry.question.tense})</span>
                      </div>
                      <div className="text-xs text-slate-400 font-bold uppercase mt-1">
                        Your answer: <span className={entry.isCorrect ? "text-green-500" : "text-red-500"}>{entry.selected}</span>
                        {!entry.isCorrect && (
                          <span className="ml-2 text-slate-500">Correct: <span className="text-green-500">{entry.question.answer}</span></span>
                        )}
                      </div>
                    </div>
                    <div>
                      {entry.isCorrect ? (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full font-black text-[10px] uppercase">Correct</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full font-black text-[10px] uppercase">Review</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {mistakes.length > 0 && !isReviewingMistakes && (
              <button
                onClick={startReviewingMistakes}
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Review {mistakes.length} Mistakes
              </button>
            )}
            <button
              onClick={restart}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ArrowRight className="w-5 h-5" />
              Restart Full Playground
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            {isReviewingMistakes ? "Reviewing Mistake" : "Question"} {currentQuestionIndex + 1} of {questionsToUse.length}
          </div>
          {!isPremium && !devMode && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-full text-xs font-black animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-black text-slate-900 dark:text-white">{score}</span>
        </div>
      </div>

      <motion.div 
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-slate-100 dark:border-slate-800 mb-8"
      >
        <div className="text-center mb-10">
          <div className="text-sm font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Conjugate</div>
          <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight" dir={['modern', 'biblical'].includes(language) ? 'rtl' : 'ltr'}>
            {currentQuestion.verb}
          </h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
              {currentQuestion.tense}
            </span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
              {currentQuestion.person}
            </span>
            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
              {currentQuestion.english}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.answer;
            
            let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg";
            if (selectedOption) {
              if (isCorrectOption) btnClass = "bg-green-500 text-white border-green-500 ring-4 ring-green-500/20";
              else if (isSelected) btnClass = "bg-red-500 text-white border-red-500 ring-4 ring-red-500/20";
              else btnClass = "opacity-50 grayscale border-slate-100 dark:border-slate-800";
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`group p-6 rounded-3xl border-2 text-xl font-black transition-all ${btnClass} flex items-center justify-between`}
              >
                <span dir={['modern', 'biblical'].includes(language) ? 'rtl' : 'ltr'}>{option}</span>
                {selectedOption && isCorrectOption && <CheckCircle2 className="w-6 h-6 text-white" />}
                {selectedOption && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-white" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Retention</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{activeRetentionPct}%</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 border-b-4 border-b-orange-500 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Multiplier</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">x{masteryMultiplier.toFixed(1)}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <button 
            onClick={() => setSessionActive(false)}
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-sm"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
