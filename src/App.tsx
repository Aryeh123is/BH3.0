import { useState, useEffect, useMemo } from 'react';
import { Word, UserProgress, Question, MasteryLevel } from './types';
import { VOCABULARY as BIBLICAL_HEBREW_VOCABULARY } from './data/vocabulary';
import { MODERN_HEBREW_VOCABULARY } from './data/modern_hebrew';
import { Dashboard } from './components/Dashboard';
import { LearnCard } from './components/LearnCard';
import { FlashcardMode } from './components/FlashcardMode';
import { ProgressBar } from './components/ProgressBar';
import { SessionSummary } from './components/SessionSummary';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ChevronLeft, RotateCcw, ArrowRight, RotateCw, Sparkles, X, CheckCircle2, History, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeLocalStorage } from './lib/storage';

const PROGRESS_KEY = 'bh-keywords-progress';
const VERSION_KEY = 'bh-app-version';
const CURRENT_VERSION = '1.4.3';

const LATEST_CHANGES = [
  { title: 'Flashcard Session Fix', description: 'Permanently resolved the issue where the session would incorrectly revert to an earlier card (e.g., the 25th or 50th card) after batch transitions.' },
  { title: 'Version Indicator', description: 'Added a version indicator to the flashcard study mode for easier troubleshooting.' },
  { title: 'Stability Improvements', description: 'Refactored state management in Flashcard mode to ensure progress tracking remains accurate throughout the entire deck.' },
];

const ARCHIVED_CHANGES = [
  { title: 'Keyboard Improvements', description: 'Keyboard shortcuts now reliably prevent page scrolling for a smoother study session.' },
  { title: 'Request a Feature', description: 'Have an idea for the app? You can now submit feature requests directly via the new button in the footer.' },
  { title: 'Keyboard Shortcut Toggle', description: 'Study with total control. Disable keyboard shortcuts if they interfere with your experience.' },
  { title: 'Stability Fixes', description: 'Fixed the "blank screen" bug with robust state management and memoized handlers.' },
  { title: 'Flashcard Batches', description: 'Study in focused sets of 25 cards with a summary after each batch.' },
  { title: 'Undo Action', description: 'Made a mistake? Use the new Undo button in Flashcard mode.' },
  { title: 'Creator Signature', description: 'Added a subtle signature to celebrate the app\'s creator, Aryeh Isaac-Saul.' },
  { title: 'Space Bar Flip', description: 'Use the space bar to flip flashcards quickly.' },
  { title: 'Keyboard Shortcuts', description: 'Use Arrow Keys (Left/Right) to grade cards and Backspace to undo.' },
  { title: 'Progress Tracking', description: 'Track your mastery of each word with a visual progress bar.' },
  { title: 'Dashboard Overview', description: 'See your overall learning statistics and deck completion at a glance.' },
  { title: 'Interactive Learning', description: 'A new way to learn keywords with multiple-choice questions and instant feedback.' },
  { title: 'Hebrew Vocabulary', description: 'Initial release with 100+ essential Hebrew keywords and phrases.' },
  { title: 'Mobile Optimization', description: 'Fully responsive design for studying on the go.' }
];

export default function App() {
  const [language, setLanguage] = useState<'biblical' | 'modern'>(() => {
    const saved = safeLocalStorage.getItem('bh-language');
    return (saved as 'biblical' | 'modern') || 'biblical';
  });

  const activeVocabulary = useMemo(() => 
    language === 'biblical' ? BIBLICAL_HEBREW_VOCABULARY : MODERN_HEBREW_VOCABULARY,
  [language]);

  const PROGRESS_KEY = `bh-keywords-progress-${language}`;
  const SESSION_STATE_KEY = `bh-session-state-${language}`;

  const [view, setView] = useState<'home' | 'learn' | 'summary' | 'flashcards' | 'dashboard'>(() => {
    const saved = safeLocalStorage.getItem(SESSION_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).view;
      } catch (e) {
        console.error("Error parsing session view", e);
      }
    }
    return 'home';
  });
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => {
    const saved = safeLocalStorage.getItem(SESSION_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).sessionQuestions;
      } catch (e) {
        console.error("Error parsing session questions", e);
      }
    }
    return [];
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = safeLocalStorage.getItem(SESSION_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).currentQuestionIndex;
      } catch (e) {
        console.error("Error parsing question index", e);
      }
    }
    return 0;
  });
  const [sessionAnswers, setSessionAnswers] = useState<(boolean | null)[]>(() => {
    const saved = safeLocalStorage.getItem(SESSION_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).sessionAnswers;
      } catch (e) {
        console.error("Error parsing session answers", e);
      }
    }
    return [];
  });
  const [showChangelog, setShowChangelog] = useState(false);
  const [viewingArchive, setViewingArchive] = useState(false);
  const [showWipPopup, setShowWipPopup] = useState(false);
  const [isLatestVersion, setIsLatestVersion] = useState<boolean | null>(null);

  const checkVersion = async () => {
    try {
      const response = await fetch('/version.json?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        setIsLatestVersion(data.version === CURRENT_VERSION);
      }
    } catch (error) {
      console.error('Failed to check version:', error);
    }
  };

  useEffect(() => {
    checkVersion();
    const interval = setInterval(checkVersion, 1000 * 60 * 5); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (newLang: 'biblical' | 'modern') => {
    setLanguage(newLang);
    if (newLang === 'modern') {
      setShowWipPopup(true);
    }
  };

  useEffect(() => {
    const savedVersion = safeLocalStorage.getItem(VERSION_KEY);
    if (savedVersion !== CURRENT_VERSION) {
      setShowChangelog(true);
    }
  }, []);

  const handleCloseChangelog = () => {
    safeLocalStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    setShowChangelog(false);
    setViewingArchive(false);
  };

  useEffect(() => {
    safeLocalStorage.setItem('bh-language', language);
  }, [language]);

  useEffect(() => {
    const state = {
      view,
      sessionQuestions,
      currentQuestionIndex,
      sessionAnswers
    };
    safeLocalStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
  }, [view, sessionQuestions, currentQuestionIndex, sessionAnswers, SESSION_STATE_KEY]);

  const sessionCorrectCount = useMemo(() => 
    sessionAnswers.filter(a => a === true).length,
  [sessionAnswers]);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = safeLocalStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Error parsing progress data", e);
        setProgress([]);
      }
    } else {
      setProgress([]);
    }
  }, [PROGRESS_KEY]);

  // Save progress to localStorage
  useEffect(() => {
    if (progress.length > 0 || safeLocalStorage.getItem(PROGRESS_KEY)) {
      safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [progress, PROGRESS_KEY]);

  const startSession = () => {
    // Group words by mastery level
    const grouped = activeVocabulary.reduce((acc, word) => {
      const prog = progress.find(p => p.wordId === word.id)?.mastery || 'new';
      if (!acc[prog]) acc[prog] = [];
      acc[prog].push(word);
      return acc;
    }, {} as Record<MasteryLevel, Word[]>);

    // Shuffle each group
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    const newWords: Word[] = shuffle(grouped['new'] || []);
    const learningWords: Word[] = shuffle(grouped['learning'] || []);
    const masteredWords: Word[] = shuffle(grouped['mastered'] || []);

    // Pick 10 words, prioritizing learning, then new, then mastered
    const sessionWords: Word[] = [...learningWords, ...newWords, ...masteredWords].slice(0, 10);
    
    // Generate questions
    const questions: Question[] = sessionWords.map(word => {
      const wordProgress = progress.find(p => p.wordId === word.id);
      const type = (wordProgress?.mastery === 'learning') ? 'written' : 'multiple-choice';
      
      let options: string[] | undefined;
      if (type === 'multiple-choice') {
        const otherWords = activeVocabulary.filter(w => w.id !== word.id);
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
      <Navbar onNavigate={(view) => setView(view)} language={language} />

      <AnimatePresence>
        {showWipPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-slate-100 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400" />
              <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <span className="text-4xl font-black">!</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Work in Progress</h2>
              <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                Modern Hebrew support is currently in early beta. You might encounter bugs or incomplete vocabulary lists. We're working hard to polish this experience!
              </p>
              <button
                onClick={() => setShowWipPopup(false)}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}

        {showChangelog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      {viewingArchive ? <History className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">
                        {viewingArchive ? "Update Archives" : "What's New"}
                      </h2>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                        {viewingArchive ? "Previous Updates" : `Version ${CURRENT_VERSION}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCloseChangelog}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {(viewingArchive ? ARCHIVED_CHANGES : LATEST_CHANGES).map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCloseChangelog}
                    className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    Got it, let's study!
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setViewingArchive(!viewingArchive)}
                    className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    {viewingArchive ? (
                      <>← Back to What's New</>
                    ) : (
                      <>
                        <History className="w-4 h-4" />
                        View Update Archives
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
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
                language={language}
                onLanguageChange={handleLanguageChange}
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
                vocabulary={activeVocabulary}
                progress={progress}
                onStartSession={startSession}
                onStartFlashcards={() => setView('flashcards')}
                onResetProgress={() => {
                  setProgress([]);
                  safeLocalStorage.removeItem(`bh-flashcard-session-${language}`);
                }}
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
              key={`flashcards-${language}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlashcardMode
                vocabulary={activeVocabulary}
                onExit={() => setView('home')}
                onSwitchToLearn={startSession}
                onWordProgress={updateWordProgress}
                language={language}
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

      <footer className="py-12 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://forms.gle/NjUpvWAZCjTF4aPB6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Request a Feature
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Created by <span className="text-slate-900 font-bold">Aryeh Isaac-Saul</span>
            </p>
            
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v{CURRENT_VERSION}</span>
              </div>
              
              {isLatestVersion === true && (
                <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" />
                  Latest Version
                </div>
              )}
              
              {isLatestVersion === false && (
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1.5 text-amber-500 hover:text-amber-600 text-[10px] font-bold uppercase tracking-widest transition-colors animate-pulse"
                >
                  <AlertCircle className="w-3 h-3" />
                  Update Available (Reload)
                  <RefreshCw className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
