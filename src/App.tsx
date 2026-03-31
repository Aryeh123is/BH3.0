import { useState, useEffect, useMemo } from 'react';
import { Word, UserProgress, Question, MasteryLevel } from './types';
import { VOCABULARY } from './data/vocabulary';
import { Dashboard } from './components/Dashboard';
import { LearnCard } from './components/LearnCard';
import { FlashcardMode } from './components/FlashcardMode';
import { ProgressBar } from './components/ProgressBar';
import { SessionSummary } from './components/SessionSummary';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ChevronLeft, RotateCcw, ArrowRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PROGRESS_KEY = 'bh-keywords-progress';

export default function App() {
  const [view, setView] = useState<'home' | 'learn' | 'summary' | 'flashcards' | 'dashboard'>(() => {
    const saved = localStorage.getItem('bh-session-state');
    if (saved) return JSON.parse(saved).view;
    return 'home';
  });
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('bh-session-state');
    if (saved) return JSON.parse(saved).sessionQuestions;
    return [];
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem('bh-session-state');
    if (saved) return JSON.parse(saved).currentQuestionIndex;
    return 0;
  });
  const [sessionAnswers, setSessionAnswers] = useState<(boolean | null)[]>(() => {
    const saved = localStorage.getItem('bh-session-state');
    if (saved) return JSON.parse(saved).sessionAnswers;
    return [];
  });

  useEffect(() => {
    const state = {
      view,
      sessionQuestions,
      currentQuestionIndex,
      sessionAnswers
    };
    localStorage.setItem('bh-session-state', JSON.stringify(state));
  }, [view, sessionQuestions, currentQuestionIndex, sessionAnswers]);

  const sessionCorrectCount = useMemo(() => 
    sessionAnswers.filter(a => a === true).length,
  [sessionAnswers]);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const startSession = () => {
    // Group words by mastery level
    const grouped = VOCABULARY.reduce((acc, word) => {
      const prog = progress.find(p => p.wordId === word.id)?.mastery || 'new';
      if (!acc[prog]) acc[prog] = [];
      acc[prog].push(word);
      return acc;
    }, {} as Record<MasteryLevel, Word[]>);

    // Shuffle each group
    const shuffle = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);
    
    const newWords = shuffle(grouped['new'] || []);
    const learningWords = shuffle(grouped['learning'] || []);
    const masteredWords = shuffle(grouped['mastered'] || []);

    // Pick 10 words, prioritizing learning, then new, then mastered
    const sessionWords = [...learningWords, ...newWords, ...masteredWords].slice(0, 10);
    
    // Generate questions
    const questions: Question[] = sessionWords.map(word => {
      const wordProgress = progress.find(p => p.wordId === word.id);
      const type = (wordProgress?.mastery === 'learning') ? 'written' : 'multiple-choice';
      
      let options: string[] | undefined;
      if (type === 'multiple-choice') {
        const otherWords = VOCABULARY.filter(w => w.id !== word.id);
        const distractors = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.english);
        options = [word.english, ...distractors].sort(() => Math.random() - 0.5);
      }

      return {
        word,
        type,
        options,
        correctAnswer: word.english
      };
    });

    setSessionQuestions(questions);
    setSessionAnswers(new Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setView('learn');
  };

  const updateWordProgress = (wordId: string, isCorrect: boolean) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.wordId === wordId);
      const newProgress = [...prev];
      const now = Date.now();

      if (existingIndex >= 0) {
        const p = { ...newProgress[existingIndex] };
        if (isCorrect) {
          p.correctCount += 1;
          if (p.mastery === 'new') p.mastery = 'learning';
        } else {
          p.incorrectCount += 1;
          p.mastery = 'new';
        }
        p.lastStudied = now;
        newProgress[existingIndex] = p;
      } else {
        newProgress.push({
          wordId,
          mastery: isCorrect ? 'learning' : 'new',
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          lastStudied: now
        });
      }
      return newProgress;
    });
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    
    // Update session answers
    setSessionAnswers(prev => {
      const next = [...prev];
      next[currentQuestionIndex] = isCorrect;
      return next;
    });

    // Update progress
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.wordId === currentQuestion.word.id);
      const newProgress = [...prev];

      if (existingIndex >= 0) {
        const p = { ...newProgress[existingIndex] };
        if (isCorrect) {
          p.correctCount += 1;
          if (currentQuestion.type === 'written') p.mastery = 'mastered';
          else if (currentQuestion.type === 'multiple-choice') p.mastery = 'learning';
        } else {
          p.incorrectCount += 1;
          p.mastery = 'new'; // Reset on error
        }
        p.lastStudied = Date.now();
        newProgress[existingIndex] = p;
      } else {
        newProgress.push({
          wordId: currentQuestion.word.id,
          mastery: isCorrect ? (currentQuestion.type === 'written' ? 'mastered' : 'learning') : 'new',
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          lastStudied: Date.now()
        });
      }
      return newProgress;
    });

    // Move to next question or summary
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setView('summary');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/10">
      <Navbar onNavigate={(view) => setView(view)} />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onStartSession={startSession} 
                onViewDashboard={() => setView('dashboard')} 
                onStartFlashcards={() => setView('flashcards')}
              />
              <HowItWorks />
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard
                vocabulary={VOCABULARY}
                progress={progress}
                onStartSession={startSession}
                onStartFlashcards={() => setView('flashcards')}
                onResetProgress={() => setProgress([])}
              />
              <div className="text-center pb-20">
                <button 
                  onClick={() => setView('home')}
                  className="text-slate-400 font-bold hover:text-primary transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </motion.div>
          )}

          {view === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlashcardMode
                vocabulary={VOCABULARY}
                onExit={() => setView('home')}
                onSwitchToLearn={startSession}
                onWordProgress={updateWordProgress}
              />
            </motion.div>
          )}

          {view === 'learn' && sessionQuestions.length > 0 && sessionQuestions[currentQuestionIndex] && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-8"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setView('home')}
                    className="p-2 hover:bg-white rounded-full transition-colors group"
                    title="Back to Home"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                  </button>
                  <button
                    onClick={() => setView('flashcards')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold hover:bg-primary/10 transition-all"
                  >
                    <RotateCw className="w-4 h-4" />
                    Switch to Flashcards
                  </button>
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Previous Word</span>
                    </button>
                  )}
                </div>
                <div className="flex-1 max-w-md mx-8">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <span>Question {currentQuestionIndex + 1} of {sessionQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / sessionQuestions.length) * 100)}%</span>
                  </div>
                  <ProgressBar current={currentQuestionIndex + 1} total={sessionQuestions.length} color="bg-primary" />
                </div>
                <div className="w-10" />
              </div>

              <LearnCard
                question={sessionQuestions[currentQuestionIndex]}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}

          {view === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-4"
            >
              <SessionSummary
                correct={sessionCorrectCount}
                total={sessionQuestions.length}
                onRestart={startSession}
                onHome={() => setView('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
