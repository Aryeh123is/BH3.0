import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, UserProgress, Question, MasteryLevel, CustomDeck, SRSSettings } from './types';
import { VOCABULARY as BIBLICAL_HEBREW_VOCABULARY } from './data/vocabulary';
import { MODERN_HEBREW_VOCABULARY } from './data/modern_hebrew';
import { SPANISH_EDEXCEL_VOCABULARY } from './data/spanish_edexcel';
import { Dashboard } from './components/Dashboard';
import { LearnCard } from './components/LearnCard';
import { FlashcardMode } from './components/FlashcardMode';
import { ProgressBar } from './components/ProgressBar';
import { SessionSummary } from './components/SessionSummary';
import { TestMode } from './components/TestMode';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { AuthModal } from './components/AuthModal';
import { DevModePasswordModal } from './components/DevModePasswordModal';
import { ChevronLeft, RotateCcw, ArrowRight, RotateCw, Sparkles, X, CheckCircle2, History, AlertCircle, RefreshCw, LogIn, LogOut, User as UserIcon, Moon, Sun, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeLocalStorage } from './lib/storage';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, signOut, doc, setDoc, getDoc, collection, onSnapshot, writeBatch } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const PROGRESS_KEY = 'bh-keywords-progress';
const VERSION_KEY = 'bh-app-version';
const THEME_KEY = 'bh-app-theme';
const CURRENT_VERSION = '1.6.2';

const LATEST_CHANGES = [
  { title: 'Flashcard UI Update', description: 'Removed the version number from the flashcard mode header.' },
  { title: 'Daily Goal Customization', description: 'You can now change your daily review goal in the SRS Settings tab.' },
  { title: 'Streak System Overhaul', description: 'Streaks are now tied to completing your daily goal, and freezes are used automatically if you miss a day.' },
  { title: 'Dynamic Language Support', description: 'Updated the landing page to dynamically reflect the selected language.' },
  { title: 'New Test Mode', description: 'Test your knowledge with customizable tests! Choose question counts and types including Matching, Written, and True/False.' },
  { title: 'Full Spanish Vocabulary Implementation', description: 'Successfully implemented all 1243+ Spanish keywords into the system.' },
];

const ARCHIVED_CHANGES = [
  { title: 'Spanish Vocabulary Update', description: 'Implemented a massive update to the Spanish vocabulary list with over 1200 new words and phrases.' },
  { title: 'Spanish Vocabulary Reset', description: 'Removed all existing Spanish keywords to prepare for a new, updated vocabulary list.' },
  { title: 'Email & Password Sign In', description: 'Added the ability to create an account and sign in using an email and password, bypassing the need for Google Sign-In entirely.' },
  { title: 'Sign-In Preview Fix', description: 'Added detection for when the app is running in a preview window on Apple devices, prompting users to open the app in a new tab to complete sign-in.' },
  { title: 'Update Indicator Fix', description: 'Fixed an issue where the version indicator in the footer would incorrectly show that an update was needed.' },
  { title: 'iPad Sign-In Fix', description: 'Resolved an issue where Apple devices (iPad/iPhone/Safari) would block the sign-in popup. The app now automatically falls back to a redirect sign-in method.' },
  { title: 'Developer Mode', description: 'Added a toggle in the footer to easily switch Developer Mode on and off, hiding work-in-progress languages from public view.' },
  { title: 'Flashcard Session Fix', description: 'Permanently resolved the issue where the session would incorrectly revert to an earlier card (e.g., the 25th or 50th card) after batch transitions.' },
  { title: 'Version Indicator', description: 'Added a version indicator to the flashcard study mode for easier troubleshooting.' },
  { title: 'Stability Improvements', description: 'Refactored state management in Flashcard mode to ensure progress tracking remains accurate throughout the entire deck.' },
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
  const [devMode, setDevMode] = useState(() => safeLocalStorage.getItem('bh-dev-mode') === 'true');
  const [showDevModePasswordModal, setShowDevModePasswordModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proEmail, setProEmail] = useState('');
  const [proSubmitted, setProSubmitted] = useState(false);
  const [customDecks, setCustomDecks] = useState<CustomDeck[]>([]);
  const [srsSettings, setSrsSettings] = useState<SRSSettings>(() => {
    const saved = safeLocalStorage.getItem('bh-srs-settings');
    return saved ? JSON.parse(saved) : {
      algorithm: 'leitner',
      newInterval: 24,
      learningInterval: 72,
      masteredInterval: 168
    };
  });
  const [language, setLanguage] = useState<string>(() => {
    const saved = safeLocalStorage.getItem('bh-language');
    const parsed = saved || 'biblical';
    if (safeLocalStorage.getItem('bh-dev-mode') !== 'true' && parsed === 'modern') {
      return 'biblical';
    }
    return parsed;
  });

  useEffect(() => {
    if (!devMode && language === 'modern') {
      setLanguage('biblical');
    }
  }, [devMode, language]);

  const activeVocabulary = useMemo(() => {
    if (language === 'biblical') return BIBLICAL_HEBREW_VOCABULARY;
    if (language === 'modern') return MODERN_HEBREW_VOCABULARY;
    if (language === 'spanish') return SPANISH_EDEXCEL_VOCABULARY;
    
    const customDeck = customDecks.find(d => d.id === language);
    if (customDeck) return customDeck.words;
    
    return BIBLICAL_HEBREW_VOCABULARY; // fallback
  }, [language, customDecks]);

  const PROGRESS_KEY = `bh-keywords-progress-${language}`;
  const SESSION_STATE_KEY = `bh-session-state-${language}`;

  const [view, setView] = useState<'home' | 'learn' | 'summary' | 'flashcards' | 'dashboard' | 'test'>(() => {
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

  const todayReviews = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return progress.filter(p => {
      if (!p.lastStudied) return false;
      const studyDate = new Date(p.lastStudied);
      studyDate.setHours(0, 0, 0, 0);
      return studyDate.getTime() === now.getTime();
    }).length;
  }, [progress]);

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
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [sharedDeckToImport, setSharedDeckToImport] = useState<any>(null);

  const trialInfo = useMemo(() => {
    if (!user) return { isTrialActive: false, daysLeft: 0, isExpired: false };
    if (userProfile?.isPremium) return { isTrialActive: false, daysLeft: 0, isExpired: false };
    
    const creationTime = user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now();
    const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    const timeElapsed = Date.now() - creationTime;
    
    if (timeElapsed < trialDuration) {
      const daysLeft = Math.ceil((trialDuration - timeElapsed) / (1000 * 60 * 60 * 24));
      return { isTrialActive: true, daysLeft, isExpired: false };
    }
    
    return { isTrialActive: false, daysLeft: 0, isExpired: true };
  }, [user, userProfile]);

  const isPremium = useMemo(() => {
    if (devMode || user?.email === 'aisaacsaul@gmail.com') return true;
    if (!user) return false;
    if (userProfile?.isPremium) return true;
    return trialInfo.isTrialActive;
  }, [user, userProfile, devMode, trialInfo.isTrialActive]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deckId = params.get('deck');

    if (deckId) {
      // Fetch the shared deck
      import('firebase/firestore').then(({ doc, getDoc }) => {
        getDoc(doc(db, 'sharedDecks', deckId)).then((snapshot) => {
          if (snapshot.exists()) {
            setSharedDeckToImport({ id: snapshot.id, ...snapshot.data() });
          } else {
            alert('Shared deck not found or has been deleted.');
          }
          // Remove the query param so it doesn't trigger again on refresh
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch(err => {
          console.error("Error fetching shared deck:", err);
          alert('Failed to load shared deck.');
        });
      });
    }
  }, []);

  const handleImportSharedDeck = async () => {
    if (!user) {
      alert('Please sign in to import this deck.');
      return;
    }
    if (!sharedDeckToImport) return;

    try {
      const { addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'users', user.uid, 'decks'), {
        title: sharedDeckToImport.title,
        description: sharedDeckToImport.description || '',
        words: sharedDeckToImport.words,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      alert('Deck imported successfully! You can now find it in your Dashboard.');
      setSharedDeckToImport(null);
      setView('dashboard');
    } catch (error) {
      console.error("Error importing deck:", error);
      alert('Failed to import deck. Please try again.');
    }
  };
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeLocalStorage.getItem(THEME_KEY);
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeLocalStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleDevMode = () => {
    if (!devMode) {
      setShowDevModePasswordModal(true);
    } else {
      setDevMode(false);
      safeLocalStorage.setItem('bh-dev-mode', 'false');
    }
  };

  const handleDevModePasswordSubmit = (password: string) => {
    setDevMode(true);
    safeLocalStorage.setItem('bh-dev-mode', 'true');
    setShowDevModePasswordModal(false);
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthReady && !user && !devMode && view !== 'home' && view !== 'flashcards') {
      setView('home');
    }
  }, [user, isAuthReady, view, devMode]);

  const handleGoogleSignIn = async () => {
    try {
      // First try popup, which is preferred in this environment
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Don't log expected user actions as errors
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Sign in cancelled by user.");
        return;
      }
      
      // If popup is blocked or fails due to cross-origin/third-party cookie issues (common on iPad/Safari)
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/web-storage-unsupported' ||
        error.message?.toLowerCase().includes('cross-origin') ||
        /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) // Fallback for Apple devices if popup fails
      ) {
        console.warn("Popup sign-in failed or blocked. Falling back to redirect sign-in...", error);
        
        // Check if we are running inside an iframe (like the AI Studio preview)
        if (window !== window.top) {
          alert("Apple devices block Google sign-in inside previews. Please click the 'Open in New Tab' button (the square with an arrow at the top right of the preview) to sign in with Google, or use Email/Password instead!");
          return;
        }

        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect sign-in also failed:", redirectError);
          alert("Sign in failed. If you are on an iPad/iPhone, please ensure 'Prevent Cross-Site Tracking' is disabled in Safari settings, or try another browser.");
        }
        return;
      }
      
      console.error("Sign in failed:", error);
      alert("Sign in failed. Please try again.");
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    if (newLang === 'modern' && !devMode) {
      setShowWipPopup(true);
      return;
    }
    
    setLanguage(newLang);
    safeLocalStorage.setItem('bh-language', newLang);
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

  // Load progress from localStorage or Firestore
  useEffect(() => {
    if (!isAuthReady) return;

    if (user) {
      // Listen to User Profile
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setUserProfile({});
        }
      });

      // Listen to Firestore progress
      const progressRef = collection(db, 'users', user.uid, 'progress');
      const unsubscribeProgress = onSnapshot(progressRef, (snapshot) => {
        const firestoreProgress: UserProgress[] = [];
        snapshot.forEach((doc) => {
          firestoreProgress.push(doc.data() as UserProgress);
        });
        
        if (firestoreProgress.length > 0) {
          setProgress(firestoreProgress);
        } else {
          // If Firestore is empty but local has progress, sync local to Firestore
          const localProgress = safeLocalStorage.getItem(PROGRESS_KEY);
          if (localProgress) {
            const parsed = JSON.parse(localProgress);
            if (parsed.length > 0) {
              const batch = writeBatch(db);
              parsed.forEach((p: UserProgress) => {
                const docRef = doc(db, 'users', user.uid, 'progress', p.wordId);
                batch.set(docRef, p);
              });
              batch.commit().catch(err => console.error("Initial sync failed:", err));
              setProgress(parsed);
            }
          }
        }
      }, (error) => {
        console.error("Firestore progress listener error:", error);
      });
      // Listen to Custom Decks
      const decksRef = collection(db, 'users', user.uid, 'decks');
      const unsubscribeDecks = onSnapshot(decksRef, (snapshot) => {
        const decks: CustomDeck[] = [];
        snapshot.forEach((doc) => {
          decks.push({ id: doc.id, ...doc.data() } as CustomDeck);
        });
        setCustomDecks(decks);
      }, (error) => {
        console.error("Firestore decks listener error:", error);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeProgress();
        unsubscribeDecks();
      };
    } else {
      // Load from local storage
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
    }
  }, [PROGRESS_KEY, user, isAuthReady]);

  // Save progress to localStorage and Firestore
  useEffect(() => {
    if (progress.length > 0 || safeLocalStorage.getItem(PROGRESS_KEY)) {
      safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [progress, PROGRESS_KEY]);

  // Handle missed days and consume freezes
  useEffect(() => {
    if (!user || !userProfile) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUpdate = userProfile.lastStreakUpdate ? new Date(userProfile.lastStreakUpdate) : null;
    if (lastUpdate) {
      lastUpdate.setHours(0, 0, 0, 0);
    }

    let missedDays = 0;
    if (lastUpdate) {
      const diffTime = today.getTime() - lastUpdate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        missedDays = diffDays - 1;
      }
    }

    if (missedDays > 0) {
      let newFreezes = userProfile.streakFreezes || 0;
      let newStreak = userProfile.streak || 0;
      let newLastUpdate = userProfile.lastStreakUpdate;

      if (newFreezes >= missedDays) {
        newFreezes -= missedDays;
        // Set last update to yesterday so they can continue the streak today
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        newLastUpdate = yesterday.getTime();
      } else {
        newStreak = 0;
        newFreezes = 0;
      }

      setDoc(doc(db, 'users', user.uid), {
        streak: newStreak,
        streakFreezes: newFreezes,
        lastStreakUpdate: newLastUpdate
      }, { merge: true });
    }
  }, [user, userProfile?.lastStreakUpdate]);

  // Handle daily goal completion and streak increment
  useEffect(() => {
    if (!user || !userProfile) return;

    const dailyGoal = srsSettings.dailyGoal || 20;
    if (todayReviews >= dailyGoal) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastUpdate = userProfile.lastStreakUpdate ? new Date(userProfile.lastStreakUpdate) : null;
      if (lastUpdate) lastUpdate.setHours(0, 0, 0, 0);

      if (!lastUpdate || lastUpdate.getTime() < today.getTime()) {
        // Goal met today for the first time!
        const newStreak = (userProfile.streak || 0) + 1;
        let newFreezes = userProfile.streakFreezes || 0;

        const freezeInterval = isPremium ? 3 : 5;
        const maxFreezes = isPremium ? 5 : 3;

        if (newStreak % freezeInterval === 0) {
          newFreezes = Math.min(newFreezes + 1, maxFreezes);
        }

        setDoc(doc(db, 'users', user.uid), {
          streak: newStreak,
          streakFreezes: newFreezes,
          lastStreakUpdate: Date.now()
        }, { merge: true });
      }
    }
  }, [todayReviews, user, userProfile, srsSettings.dailyGoal, devMode, isPremium]);

  const updateFirestoreWordProgress = async (p: UserProgress) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'progress', p.wordId);
      await setDoc(docRef, p);
      
      // Also update user profile lastActive
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { 
        lastActive: Date.now(),
        language: language 
      }, { merge: true });
    } catch (err) {
      console.error("Error updating Firestore progress:", err);
    }
  };

  const startSession = () => {
    const now = Date.now();
    
    // Group words by mastery level and review status
    const initialGrouped: Record<MasteryLevel, { due: Word[], notDue: Word[] }> = {
      'new': { due: [], notDue: [] },
      'learning': { due: [], notDue: [] },
      'mastered': { due: [], notDue: [] }
    };

    const grouped = activeVocabulary.reduce((acc, word) => {
      const prog = progress.find(p => p.wordId === word.id);
      const mastery = prog?.mastery || 'new';
      const isDue = prog ? prog.nextReview <= now : true;
      
      if (isDue) acc[mastery].due.push(word);
      else acc[mastery].notDue.push(word);
      
      return acc;
    }, initialGrouped);

    // Shuffle helper
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    // Priority: 
    // 1. Learning words that are due
    // 2. New words
    // 3. Mastered words that are due
    // 4. Learning words not yet due (if space)
    
    const sessionWords: Word[] = shuffle<Word>(grouped['learning'].due)
      .concat(shuffle<Word>(grouped['new'].due))
      .concat(shuffle<Word>(grouped['mastered'].due))
      .concat(shuffle<Word>(grouped['learning'].notDue))
      .slice(0, 10);
    
    // Generate questions
    const questions: Question[] = sessionWords.map(word => {
      const wordProgress = progress.find(p => p.wordId === word.id);
      const type = (wordProgress?.mastery === 'learning' || wordProgress?.mastery === 'mastered') 
        ? 'written' 
        : 'multiple-choice';
      
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

  const startIncorrectSession = () => {
    // Filter words that have an incorrect count > 0
    const incorrectWords = activeVocabulary.filter(word => {
      const prog = progress.find(p => p.wordId === word.id);
      return prog && prog.incorrectCount > 0;
    });

    if (incorrectWords.length === 0) {
      alert("Great job! You don't have any incorrect flashcards to review right now.");
      return;
    }

    // Shuffle helper
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    // Take up to 10 incorrect words
    const sessionWords: Word[] = shuffle<Word>(incorrectWords).slice(0, 10);
    
    // Generate questions
    const questions: Question[] = sessionWords.map(word => {
      const wordProgress = progress.find(p => p.wordId === word.id);
      const type = (wordProgress?.mastery === 'learning' || wordProgress?.mastery === 'mastered') 
        ? 'written' 
        : 'multiple-choice';
      
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

  const calculateNextReview = (isCorrect: boolean, currentInterval: number, currentMastery: MasteryLevel): { interval: number, nextReview: number } => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    const dayInMs = 24 * hourInMs;
    
    if (!isCorrect) {
      return { interval: 0, nextReview: now }; // Review immediately
    }
    
    if (srsSettings.algorithm === 'custom') {
      let nextIntervalHours = srsSettings.newInterval;
      if (currentMastery === 'new') {
        nextIntervalHours = srsSettings.learningInterval;
      } else if (currentMastery === 'learning') {
        nextIntervalHours = srsSettings.masteredInterval;
      } else if (currentMastery === 'mastered') {
        // Double the current interval (converted to hours) or use masteredInterval
        const currentHours = currentInterval * 24;
        nextIntervalHours = Math.max(srsSettings.masteredInterval, currentHours * 2);
      }
      
      const nextIntervalDays = nextIntervalHours / 24;
      return {
        interval: nextIntervalDays,
        nextReview: now + (nextIntervalHours * hourInMs)
      };
    }
    
    // Simple Leitner-style progression: 0 -> 1 -> 3 -> 7 -> 14 -> 30 -> 60 -> 90
    const intervals = [0, 1, 3, 7, 14, 30, 60, 90, 180];
    const currentIndex = intervals.indexOf(currentInterval);
    const nextIndex = Math.min(currentIndex + 1, intervals.length - 1);
    const nextInterval = intervals[nextIndex] !== undefined ? intervals[nextIndex] : currentInterval * 2;
    
    return {
      interval: nextInterval,
      nextReview: now + (nextInterval * dayInMs)
    };
  };

  const updateWordProgress = (wordId: string, isCorrect: boolean) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.wordId === wordId);
      const newProgress = [...prev];
      const now = Date.now();
      let updatedEntry: UserProgress;

      if (existingIndex >= 0) {
        const p = { ...newProgress[existingIndex] };
        const srs = calculateNextReview(isCorrect, p.interval, p.mastery);
        
        if (isCorrect) {
          p.correctCount += 1;
          if (p.mastery === 'new') p.mastery = 'learning';
          else if (p.mastery === 'learning') p.mastery = 'mastered';
        } else {
          p.incorrectCount += 1;
          p.mastery = 'new';
        }
        
        p.interval = srs.interval;
        p.nextReview = srs.nextReview;
        p.lastStudied = now;
        newProgress[existingIndex] = p;
        updatedEntry = p;
      } else {
        const srs = calculateNextReview(isCorrect, 0, 'new');
        updatedEntry = {
          wordId,
          mastery: isCorrect ? 'learning' : 'new',
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          lastStudied: now,
          interval: srs.interval,
          nextReview: srs.nextReview
        };
        newProgress.push(updatedEntry);
      }
      
      if (user) {
        updateFirestoreWordProgress(updatedEntry);
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
      let updatedEntry: UserProgress;

      if (existingIndex >= 0) {
        const p = { ...newProgress[existingIndex] };
        const srs = calculateNextReview(isCorrect, p.interval, p.mastery);
        
        if (isCorrect) {
          p.correctCount += 1;
          if (currentQuestion.type === 'written') p.mastery = 'mastered';
          else if (currentQuestion.type === 'multiple-choice') p.mastery = 'learning';
        } else {
          p.incorrectCount += 1;
          p.mastery = 'new'; // Reset on error
        }
        
        p.interval = srs.interval;
        p.nextReview = srs.nextReview;
        p.lastStudied = Date.now();
        newProgress[existingIndex] = p;
        updatedEntry = p;
      } else {
        const srs = calculateNextReview(isCorrect, 0, 'new');
        updatedEntry = {
          wordId: currentQuestion.word.id,
          mastery: isCorrect ? (currentQuestion.type === 'written' ? 'mastered' : 'learning') : 'new',
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          lastStudied: Date.now(),
          interval: srs.interval,
          nextReview: srs.nextReview
        };
        newProgress.push(updatedEntry);
      }

      if (user) {
        updateFirestoreWordProgress(updatedEntry);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/10 transition-colors duration-300">
      <Navbar 
        onNavigate={(view) => setView(view)} 
        language={language} 
        user={user}
        userProfile={userProfile}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onShowPro={() => setShowProModal(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        devMode={devMode}
        isPremium={isPremium}
      />

      <AnimatePresence>
        {showDevModePasswordModal && (
          <DevModePasswordModal
            onClose={() => setShowDevModePasswordModal(false)}
            onSubmit={handleDevModePasswordSubmit}
          />
        )}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onGoogleSignIn={handleGoogleSignIn} 
          />
        )}
        
        {sharedDeckToImport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Book className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Import Shared Deck</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Someone shared <strong>"{sharedDeckToImport.title}"</strong> with you. It contains {sharedDeckToImport.words?.length || 0} words.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSharedDeckToImport(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSharedDeck}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  {user ? 'Import Deck' : 'Sign in to Import'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showWipPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400" />
              <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <span className="text-4xl font-black">!</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Work in Progress</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                {language === 'modern' ? 'Modern Hebrew' : 'Spanish'} support is currently in early beta. You might encounter bugs or incomplete vocabulary lists. We're working hard to polish this experience!
              </p>
              <button
                onClick={() => setShowWipPopup(false)}
                className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-xl active:scale-95"
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
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      {viewingArchive ? <History className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {viewingArchive ? "Update Archives" : "What's New"}
                      </h2>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {viewingArchive ? "Previous Updates" : `Version ${CURRENT_VERSION}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCloseChangelog}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
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
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCloseChangelog}
                    className="w-full py-5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    Got it, let's study!
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setViewingArchive(!viewingArchive)}
                    className="w-full py-3 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs flex items-center justify-center gap-2 uppercase tracking-widest"
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
                onStartTest={() => setView('test')}
                language={language}
                onLanguageChange={handleLanguageChange}
                user={user}
                onSignIn={handleSignIn}
                onShowPro={() => setShowProModal(true)}
                devMode={devMode}
                isPremium={isPremium}
              />
              <HowItWorks language={language} />
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
                onStartIncorrectSession={startIncorrectSession}
                onStartFlashcards={() => setView('flashcards')}
                onStartTest={() => setView('test')}
                onResetProgress={() => {
                  setProgress([]);
                  safeLocalStorage.removeItem(`bh-flashcard-session-${language}`);
                }}
                user={user}
                userProfile={userProfile}
                language={language}
                onLanguageChange={handleLanguageChange}
                onShowPro={() => setShowProModal(true)}
                devMode={devMode}
                isPremium={isPremium}
                customDecks={customDecks}
                srsSettings={srsSettings}
                onUpdateSrsSettings={(newSettings) => {
                  setSrsSettings(newSettings);
                  safeLocalStorage.setItem('bh-srs-settings', JSON.stringify(newSettings));
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
                user={user}
                onRequireAuth={() => {
                  setShowGuestLimitModal(true);
                  setView('home');
                }}
              />
            </motion.div>
          )}

          {view === 'test' && (
            <motion.div
              key={`test-${language}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TestMode
                vocabulary={activeVocabulary}
                onExit={() => setView('home')}
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
                language={language}
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

      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            {!proSubmitted ? (
              <>
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                {trialInfo.isTrialActive ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Early Access Active!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      Premium is currently in development. As a new user, you have <strong>{trialInfo.daysLeft} days of early access</strong> to all latest features, including Unlimited Flashcards, Streak Freezes, and Advanced Analytics!
                    </p>
                    <button 
                      onClick={() => setShowProModal(false)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      Continue Learning
                    </button>
                  </>
                ) : trialInfo.isExpired ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Early Access Ended</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      Your 7-day early access period has ended. Premium is still in development, but stay tuned for the full launch!
                    </p>
                    <button 
                      onClick={() => setShowProModal(false)}
                      className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Premium in Development</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      We're building something great! Sign up now to get <strong>7 days of free early access</strong> to all upcoming features like Spaced Repetition, AI Pronunciation, and Custom Decks.
                    </p>
                    {!user && (
                      <button 
                        onClick={() => {
                          setShowProModal(false);
                          setShowAuthModal(true);
                        }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                      >
                        Sign Up for Early Access
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Request Received!</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  We'll email you a secure checkout link to upgrade your account for £2.50 shortly.
                </p>
                <button 
                  onClick={() => setShowProModal(false)}
                  className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showGuestLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <button 
              onClick={() => setShowGuestLimitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Great Job!</h2>
              <p className="text-slate-500 dark:text-slate-400">
                You've reviewed 50 cards! Your progress is saved locally, but sign up now to sync it across devices and unlock more features.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setShowGuestLimitModal(false);
                setShowAuthModal(true);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              Sign Up / Log In
            </button>
          </div>
        </div>
      )}

      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://forms.gle/NjUpvWAZCjTF4aPB6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Request a Feature
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium tracking-wide">
              Created by <span className="text-slate-900 dark:text-white font-bold">Aryeh Isaac-Saul</span>
            </p>
            
            <div className="flex items-center justify-center gap-3 mt-2">
              <button 
                onClick={toggleDevMode}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${devMode ? 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
              >
                Dev Mode: {devMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
