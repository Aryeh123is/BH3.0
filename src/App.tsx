import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { Word, UserProgress, Question, MasteryLevel, CustomDeck, SRSSettings, UserPreferences } from './types';
import { VOCABULARY as BIBLICAL_HEBREW_VOCABULARY } from './data/vocabulary';
import { MODERN_HEBREW_VOCABULARY } from './data/modern_hebrew';
import { SPANISH_EDEXCEL_VOCABULARY } from './data/spanish_edexcel';
import { FRENCH_EDEXCEL_VOCABULARY } from './data/french_edexcel';

// Heavy components code-split for performance
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const FlashcardMode = lazy(() => import('./components/FlashcardMode').then(m => ({ default: m.FlashcardMode })));
const TestMode = lazy(() => import('./components/TestMode').then(m => ({ default: m.TestMode })));
const Shop = lazy(() => import('./components/Shop').then(m => ({ default: m.Shop })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));

import { LearnCard } from './components/LearnCard';
import { ProgressBar } from './components/ProgressBar';
import { SessionSummary } from './components/SessionSummary';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { DevModePasswordModal } from './components/DevModePasswordModal';
import { ReviewSection } from './components/ReviewSection';
import { ReviewFormModal } from './components/ReviewFormModal';
import type { Review } from './components/ReviewSection';
import { ChevronLeft, RotateCcw, ArrowRight, RotateCw, Sparkles, X, CheckCircle2, Lock, History, AlertCircle, RefreshCw, LogIn, LogOut, User as UserIcon, Moon, Sun, Book, Mail, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeLocalStorage } from './lib/storage';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, signOut, doc, setDoc, getDoc, collection, onSnapshot, writeBatch, addDoc, query, orderBy, deleteDoc } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { InstallPrompt } from './components/InstallPrompt';

const PROGRESS_KEY = 'bh-keywords-progress';
const VERSION_KEY = 'bh-app-version';
const THEME_KEY = 'bh-app-theme';
const PREFS_KEY = 'bh-app-preferences';
const REVIEWS_PROMPT_KEY = 'bh-review-prompt-shown';
const CURRENT_VERSION = '2.2.4';

const CHANGELOG = [
  {
    version: '2.2.4',
    changes: [
      { title: 'Duplicate Key Resolution', description: 'Systematically fixed duplicate key errors in Flashcards, Test Mode, and Dashboard lists to ensure proper rendering.' },
      { title: 'Auth Security Hardening', description: 'Implemented mandatory 6-digit verification code flow for new accounts to prevent spam and verify emails.' },
      { title: 'Modern Hebrew Completion', description: 'Removed all "Work in Progress" and maintenance indicators from the Modern Hebrew section.' },
      { title: 'Shop Access Fix', description: 'Corrected the shop unlock mechanism and navigation reliability for premium study documents.' }
    ]
  },
  {
    version: '2.2.3',
    changes: [
      { title: 'Email Code Verification', description: 'Upgraded sign-up security with a 6-digit email confirmation code. Accounts now require activation before full access is granted.' },
      { title: 'Modern Hebrew Global Release', description: 'Removed all remaining developer-mode restrictions and "Work in Progress" indicators from Modern Hebrew.' },
      { title: 'Shop Navigation Fix', description: 'Resolved an issue where the Student Shop would not automatically open after completing the unlock sequence.' }
    ]
  },
  {
    version: '2.2.2',
    changes: [
      { title: 'Vocariox Rebranding', description: 'Officially transitioned the platform brand to Vocariox. Browser titles and metadata updated.' },
      { title: 'Secure Shop Lock', description: 'Enhanced the Student Shop lock mechanism. Access now strictly requires the hidden trigger sequence.' },
      { title: 'Rendering Stability', description: 'Resolved duplicate key warnings in review sections and list views.' }
    ]
  },
  {
    version: '2.2.1',
    changes: [
      { title: 'Code Integrity & Fixes', description: 'Resolved critical build errors related to symbol duplication and JSX tag nesting. Improved transform stability.' },
      { title: 'Performance Polish', description: 'Refined code-splitting chunks and optimized the main app entry point.' }
    ]
  },
  {
    version: '2.2.0',
    changes: [
      { title: 'Modern Hebrew Public Release', description: 'Modern Hebrew is now fully released to the public! Explore 1,400+ words and phrases across themed categories.' },
      { title: 'Performance Optimization', description: 'Implemented code-splitting and lazy loading for faster initial page loads and smoother navigation.' },
      { title: 'Responsive Refinements', description: 'Further UI polish for the Student Shop and flashcards on ultra-wide screens.' }
    ]
  },
  {
    version: '2.1.1',
    changes: [
      { title: 'Full Shop Content Restored', description: 'Restored the exact, original content for all study documents, including full 9-page depth and original Quranic/Torah formatting.' },
      { title: 'Security Polish', description: 'Internal security rule optimization and viewer stability improvements.', internal: true }
    ]
  },
  {
    version: '2.1.0',
    changes: [
      { title: 'Dynamic Anti-Piracy', description: 'Implemented user-specific watermarking and blur-on-focus-loss to prevent unauthorized sharing.' },
      { title: 'Screenshot Detection', description: 'Added keyboard shortcut detection for screenshot tools with instant security warnings.' },
      { title: 'High-Fidelity Printing', description: 'Refined print engine for perfectly formatted A4 physical study material.' }
    ]
  },
  {
    version: '2.0.8',
    changes: [
      { title: 'New Shop Content', description: 'Added GCSE Religious Studies documents for Islam and Judaism to the Student Shop.' },
      { title: 'Data Persistence Guard', description: 'Updated internal sync protocols to ensure manually added GitHub files are never overwritten.' }
    ]
  },
  {
    version: '2.0.7',
    changes: [
      { title: 'Multi-Page Viewer', description: 'The student shop now supports visual multi-page documents (PDF-style) with A4 sizing.' },
      { title: 'Anti-Piracy Hardening', description: 'Reinforced document security with screenshot watermarking and selection blocking.' }
    ]
  },
  {
    version: '2.0.6',
    changes: [
      { title: 'Admin Shop Upload', description: 'New protected management interface for uploading shop content via admin code.' },
      { title: 'Secure Document Viewer', description: 'Added anti-piracy measures to study documents with download disabling and watermark protection.' },
      { title: 'Cloud Printing', description: 'Implemented high-quality print support for premium study documents.' }
    ]
  },
  {
    version: '2.0.5',
    changes: [
      { title: 'Student Shop Update', description: 'All study documents in the shop are now free for the early access phase.' },
      { title: 'Responsive Flashcards', description: 'Implemented dynamic sizing for flashcards on small screens based on word length.' },
      { title: 'Navbar Optimization', description: 'Cleaned up mobile navbar with compact language flags and removed redundant upgrade button.' }
    ]
  },
  {
    version: '2.0.4',
    changes: [
      { title: 'Roadmap Refinement', description: 'Updated the premium roadmap targets (Phase 2 shifted to June 2026).' },
      { title: 'Bug Fixes', description: 'Resolved "Illegal constructor" error by properly importing the Lock icon from lucide-react.' }
    ]
  },
  {
    version: '2.0.3',
    changes: [
      { title: 'Modern Hebrew Topics Integrated', description: 'Topics like Social, Education, and Travel are now functional for Modern Hebrew on the homepage and dashboard.' },
      { title: 'Premium Development Roadmap', description: 'Interactive roadmap added for April 2026 (Audio, SRS, Test Mode) and June 2026 (Grammar, Exam Prep).' }
    ]
  },
  {
    version: '2.0.2',
    changes: [
      { title: 'Modern Hebrew Vocabulary Complete', description: 'Final batch added! The database now contains a total of 1,467 Modern Hebrew words and phrases for the SRS.' },
      { title: 'Categorization Optimization', description: 'Organized words into logical groups including Education, Personal Routine, Social Life, and Media.' }
    ]
  },
  {
    version: '2.0.1',
    changes: [
      { title: 'Hebrew Vocabulary Expansion', description: 'Added over 300 new words to Modern Hebrew, covering Home, Shopping, Health, Environment, and Travel.' },
      { title: 'Data Integrity', description: 'Standardized vocabulary IDs and fixed minor transliteration typos for better search and SRS tracking.' }
    ]
  },
  {
    version: '2.0.0',
    changes: [
      { title: 'Mobile Optimization', description: 'Improved the flashcard and dashboard UI for better usability on smartphones.' },
      { title: 'User Reviews', description: 'See what other students are saying in the new public reviews section on the home screen.' },
      { title: 'Privacy & Contact', description: 'Added dedicated sections for Privacy Policy and Contact Us in the footer.' },
      { title: 'Email Verification', description: 'New accounts now require email verification to ensure security and prevent fake sign-ups.' }
    ]
  },
  {
    version: '1.9.7',
    changes: [
      { title: 'Full Update History', description: 'Restored the very first launch updates (from back in 1.0.0) so you can scroll all the way back to the beginning of our journey.' }
    ]
  },
  {
    version: '1.9.6',
    changes: [
      { title: 'Changelog Improvements', description: 'We\'ve overhauled the update archives so you can seamlessly scroll through all our past releases with clean version headers!' },
      { title: 'Backend Polish', description: 'Cleaned up minor layout jumps and applied some privacy tweaks under the hood for developers.', internal: true }
    ]
  },
  {
    version: '1.9.5',
    changes: [
      { title: 'User Settings Hub', description: 'A new place to manage your account, including display name updates, learning statistics, and accessibility preferences.' },
      { title: 'Reduced Motion', description: 'Enable a smoother experience by disabling heavy animations and "bouncing" UI elements.' },
      { title: 'Clear Progress', description: 'Start fresh in any language by resetting your vocabulary mastery and study statistics.' },
      { title: 'Data Export & Privacy', description: 'Export your learning data as a JSON file or permanently delete your account directly from the settings.' },
    ]
  },
  {
    version: '1.9.4',
    changes: [
      { title: 'Premium Roadmaps', description: 'Updated the Pro feature list to include upcoming Grammar learning modules and Listening/Writing exam preparation tools.' },
      { title: 'Pricing Update', description: 'Updated Premium pricing to £4.99/year with support and updates. Monthly subscription available for £1.99/month.' },
      { title: 'Premium in Development', description: 'Updated the Premium system to reflect its development status and added a pre-launch discount registration.' },
      { title: 'Auth Configuration', description: 'Reverted to standard plaintext password for developer mode access.', internal: true },
      { title: 'Cloudflare Compatibility', description: 'Refactored the entire project to be fully compatible with Cloudflare Pages deployment.', internal: true },
    ]
  },
  {
    version: '1.9.3',
    changes: [
      { title: 'Spanish Vocabulary Update', description: 'Implemented a massive update to the Spanish vocabulary list with over 1200 new words and phrases.' },
      { title: 'Spanish Vocabulary Reset', description: 'Removed all existing Spanish keywords to prepare for a new, updated vocabulary list.', internal: true },
      { title: 'Flashcard Availability', description: 'Resolved a caching issue that mistakenly showed "No cards available" when selecting specific topics.' },
      { title: 'Session Isolation', description: 'Fixed cache mixing and reset issues when switching between language topics.', internal: true },
      { title: 'Default Language: BH', description: 'Biblical Hebrew is now the standard entry point for all users.' },
    ]
  },
  {
    version: '1.9.2',
    changes: [
      { title: 'Email & Password Sign In', description: 'Added the ability to create an account and sign in using an email and password, bypassing the need for Google Sign-In entirely.' },
      { title: 'Sign-In Preview Fix', description: 'Added detection for when the app is running in a preview window on Apple devices, prompting users to open the app in a new tab to complete sign-in.', internal: true },
      { title: 'iPad Sign-In Fix', description: 'Resolved an issue where Apple devices (iPad/iPhone/Safari) would block the sign-in popup. The app now automatically falls back to a redirect sign-in method.', internal: true },
      { title: 'Developer Mode', description: 'Added a toggle in the footer to easily switch Developer Mode on and off, hiding work-in-progress languages from public view.', internal: true },
    ]
  },
  {
    version: '1.9.1',
    changes: [
      { title: 'Request a Feature', description: 'Have an idea for the app? You can now submit feature requests directly via the new button in the footer.' },
      { title: 'Update Indicator Fix', description: 'Fixed an issue where the version indicator in the footer would incorrectly show that an update was needed.', internal: true },
      { title: 'Flashcard Session Fix', description: 'Permanently resolved the issue where the session would incorrectly revert to an earlier card (e.g., the 25th or 50th card) after batch transitions.', internal: true },
      { title: 'Version Indicator', description: 'Added a version indicator to the flashcard study mode for easier troubleshooting.', internal: true },
      { title: 'Stability Improvements', description: 'Refactored state management in Flashcard mode to ensure progress tracking remains accurate throughout the entire deck.', internal: true },
    ]
  },
  {
    version: '1.9.0',
    changes: [
      { title: 'Flashcard Batches', description: 'Study in focused sets of 25 cards with a summary after each batch.' },
      { title: 'Undo Action', description: 'Made a mistake? Use the new Undo button in Flashcard mode.' },
      { title: 'Keyboard Shortcuts', description: 'Use Arrow Keys (Left/Right) to grade cards and Backspace to undo.' },
      { title: 'Space Bar Flip', description: 'Use the space bar to flip flashcards quickly.' },
      { title: 'Stability Fixes', description: 'Fixed the "blank screen" bug with robust state management and memoized handlers.', internal: true },
      { title: 'Creator Signature', description: 'Added a subtle signature to celebrate the app\'s creator.', internal: true },
      { title: 'Keyboard Improvements', description: 'Keyboard shortcuts now reliably prevent page scrolling for a smoother study session.', internal: true },
      { title: 'Keyboard Shortcut Toggle', description: 'Study with total control. Disable keyboard shortcuts if they interfere with your experience.', internal: true },
    ]
  },
  {
    version: '1.0.0',
    changes: [
      { title: 'Hebrew Vocabulary', description: 'Initial release with 100+ essential Hebrew keywords and phrases.' },
      { title: 'Interactive Learning', description: 'A new way to learn keywords with multiple-choice questions and instant feedback.' },
      { title: 'Progress Tracking', description: 'Track your mastery of each word with a visual progress bar.' },
      { title: 'Dashboard Overview', description: 'See your overall learning statistics and deck completion at a glance.' },
      { title: 'Mobile Optimization', description: 'Fully responsive design for studying on the go.' }
    ]
  }
];

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">
      Loading Studio...
    </p>
  </div>
);

export default function App() {
  const [devMode, setDevMode] = useState(() => safeLocalStorage.getItem('bh-dev-mode') === 'true');
  const [showDevModePasswordModal, setShowDevModePasswordModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
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
    return saved || 'biblical';
  });

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [shopUnlocked, setShopUnlocked] = useState(false); // Default to false so it locks when returning
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Fetch reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserReviews(reviewsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitReview = async (review: any) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        date: new Date().toISOString(),
        userId: user?.uid || 'anonymous'
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleCloseReviewPrompt = () => {
    setShowReviewPrompt(false);
    safeLocalStorage.setItem(REVIEWS_PROMPT_KEY, 'true');
  };

  const handleLeaveReview = () => {
    setShowReviewPrompt(false);
    setShowReviewForm(true);
    safeLocalStorage.setItem(REVIEWS_PROMPT_KEY, 'true');
  };

  useEffect(() => {
    if (!devMode) {
      safeLocalStorage.setItem('bh-language', language);
    }
  }, [language, devMode]);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const activeVocabulary = useMemo(() => {
    let vocab: Word[] = [];
    if (language === 'biblical') vocab = BIBLICAL_HEBREW_VOCABULARY;
    else if (language === 'modern') vocab = MODERN_HEBREW_VOCABULARY;
    else if (language === 'spanish') vocab = SPANISH_EDEXCEL_VOCABULARY;
    else if (language === 'french') vocab = FRENCH_EDEXCEL_VOCABULARY;
    else {
      const customDeck = customDecks.find(d => d.id === language);
      vocab = customDeck ? customDeck.words : BIBLICAL_HEBREW_VOCABULARY;
    }

    if (selectedTopic) {
      if (language === 'spanish' || language === 'french') {
        const topicKeywords: Record<string, string[]> = {
          'Family & Friends': ['family', 'friend', 'brother', 'sister', 'mother', 'father', 'son', 'daughter', 'uncle', 'aunt', 'grand', 'cousin', 'marry', 'boyfriend', 'girlfriend', 'people', 'person', 'neighbor', 'neighbour', 'invite', 'call', 'love', 'name', 'relationship', 'wedding'],
          'School & Study': ['school', 'study', 'learn', 'teacher', 'professor', 'subject', 'homework', 'exam', 'grade', 'classroom', 'pen', 'book', 'notebook', 'library', 'education', 'maths', 'science', 'history', 'language', 'lesson', 'class'],
          'Food & Drink': ['eat', 'drink', 'food', 'meal', 'restaurant', 'café', 'cafe', 'bread', 'water', 'milk', 'meat', 'fish', 'fruit', 'vegetable', 'cheese', 'egg', 'rice', 'pasta', 'dessert', 'dinner', 'lunch', 'breakfast', 'hungry', 'thirsty', 'cook', 'menu', 'bill', 'tasty', 'snack'],
          'Holidays & Travel': ['holiday', 'trip', 'travel', 'hotel', 'beach', 'sea', 'sun', 'plane', 'train', 'bus', 'car', 'bike', 'bicycle', 'passport', 'ticket', 'luggage', 'tourism', 'tourist', 'visit', 'museum', 'monument', 'castle', 'island', 'costa', 'destination', 'station', 'airport', 'flight', 'arrival', 'departure', 'vacation']
        };

        const keywords = topicKeywords[selectedTopic] || [];
        return vocab.filter(word => {
          const eng = word.english.toLowerCase();
          return keywords.some(k => eng.includes(k.toLowerCase()));
        });
      } else if (language === 'modern') {
        // Use the category field for Modern Hebrew
        return vocab.filter(word => word.category === selectedTopic);
      }
    }

    return vocab;
  }, [language, customDecks, selectedTopic]);

  const SESSION_STATE_KEY = `bh-session-state-${language}`;

  const [view, setView] = useState<'home' | 'learn' | 'summary' | 'flashcards' | 'dashboard' | 'test' | 'shop'>(() => {
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

  // Check if we should show the review prompt
  useEffect(() => {
    if (view === 'home' || view === 'dashboard') {
      const promptShown = safeLocalStorage.getItem(REVIEWS_PROMPT_KEY);
      if (!promptShown) {
        const timer = setTimeout(() => {
          setShowReviewPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [view]);

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
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = safeLocalStorage.getItem(PREFS_KEY);
    return saved ? JSON.parse(saved) : {
      animationsEnabled: true,
      reducedMotion: false
    };
  });

  useEffect(() => {
    if (!devMode) {
      safeLocalStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    }
  }, [preferences, devMode]);

  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [sharedDeckToImport, setSharedDeckToImport] = useState<any>(null);

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (view === 'learn' || view === 'flashcards' || view === 'test') {
      if (!sessionStartTime) setSessionStartTime(Date.now());
    } else {
      if (sessionStartTime) {
        const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        if (durationSeconds > 0 && user && !devMode) {
          const userRef = doc(db, 'users', user.uid);
          setDoc(userRef, {
            totalLearningTime: (userProfile?.totalLearningTime || 0) + durationSeconds
          }, { merge: true }).catch(err => console.error("Error saving time:", err));
        }
        setSessionStartTime(null);
      }
    }
  }, [view, user, userProfile?.totalLearningTime]);

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
  const handleExportData = () => {
    const data = {
      profile: userProfile,
      progress: progress,
      decks: customDecks,
      settings: srsSettings,
      preferences: preferences,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `language-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearProgress = async (lang: string) => {
    let targetVocab: Word[] = [];
    if (lang === 'biblical') targetVocab = BIBLICAL_HEBREW_VOCABULARY;
    else if (lang === 'modern') targetVocab = MODERN_HEBREW_VOCABULARY;
    else if (lang === 'spanish') targetVocab = SPANISH_EDEXCEL_VOCABULARY;
    else if (lang === 'french') targetVocab = FRENCH_EDEXCEL_VOCABULARY;
    const targetIds = new Set(targetVocab.map(w => w.id));

    // 1. Clear progress from local state
    setProgress(prev => {
      const filtered = prev.filter(p => !targetIds.has(p.wordId));
      if (!devMode) {
        safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(filtered));
        // Clear legacy partitioned keys just in case
        safeLocalStorage.removeItem(`bh-keywords-progress-${lang}`);
      }
      
      return filtered;
    });

    if (lang === language) {
      setSessionQuestions([]);
      setSessionAnswers([]);
      setCurrentQuestionIndex(0);
    }
    
    if (!devMode) {
      safeLocalStorage.removeItem(`bh-session-state-${lang}`);
      safeLocalStorage.removeItem(`bh-flashcard-session-${lang}-full`);
      safeLocalStorage.removeItem(`bh-test-history-${lang}`);
      
      const topicKeysToClear = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`bh-flashcard-session-${lang}-`)) {
          topicKeysToClear.push(key);
        }
      }
      topicKeysToClear.forEach(key => safeLocalStorage.removeItem(key));
    }

    // 2. Clear progress safely in cloud
    if (user && !devMode) {
      try {
        let targetVocab: Word[] = [];
        if (lang === 'biblical') targetVocab = BIBLICAL_HEBREW_VOCABULARY;
        else if (lang === 'modern') targetVocab = MODERN_HEBREW_VOCABULARY;
        else if (lang === 'spanish') targetVocab = SPANISH_EDEXCEL_VOCABULARY;
        else if (lang === 'french') targetVocab = FRENCH_EDEXCEL_VOCABULARY;
        const targetIds = new Set(targetVocab.map(w => w.id));

        const progressRef = collection(db, 'users', user.uid, 'progress');
        const snapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(progressRef));
        
        let batchCounter = 0;
        let batch = writeBatch(db);
        
        snapshot.forEach((doc) => {
          if (targetIds.has(doc.id)) {
            batch.delete(doc.ref);
            batchCounter++;
          }
        });
        
        if (batchCounter > 0) {
          await batch.commit();
        }
      } catch (err) {
        console.error("Error clearing cloud progress:", err);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || devMode) return;
    try {
      // 1. Delete Firestore data (optional but good for privacy)
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { deleted: true, deletedAt: Date.now() }, { merge: true });
      
      // 2. Delete the user
      const { deleteUser } = await import('firebase/auth');
      await deleteUser(user);
      
      // 3. Sign out and reset
      await signOut(auth);
      setView('home');
      alert("Your account and data have been deleted.");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      if (err.code === 'auth/requires-recent-login') {
        alert("Please sign out and sign in again to perform this sensitive action.");
      } else {
        alert("Delete failed. Please try again later.");
      }
    }
  };

  const handleUpdateDisplayName = async (name: string) => {
    if (!user) return;
    try {
      if (!devMode) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { displayName: name }, { merge: true });
      }
      setUserProfile((prev: any) => ({ ...prev, displayName: name }));
    } catch (err) {
      console.error("Error updating display name:", err);
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

  const handleUnlockShop = () => {
    setShopUnlocked(true);
  };

  const handleDevModePasswordSubmit = (password: string) => {
    const pw = password.trim();
    if (pw === 'leonisadmin') {
      setDevMode(true);
      safeLocalStorage.setItem('bh-dev-mode', 'true');
      setShowDevModePasswordModal(false);
    } else {
      alert('Incorrect developer password.');
    }
  };

  const handleStartFlashcards = (topic?: string | unknown) => {
    // If the function is called directly from an onClick without an arrow function wrapper,
    // React passes the SyntheticEvent object as the first argument. We must ignore it.
    const actualTopic = typeof topic === 'string' ? topic : null;
    setSelectedTopic(actualTopic);
    setView('flashcards');
  };

  // Auth listener
  useEffect(() => {
    if (devMode) {
      setUser({
        uid: 'dev-user-123',
        email: 'dev@test.com',
        displayName: 'Dev Account',
        emailVerified: true
      } as any);
      setUserProfile({
        isPremium: true,
        displayName: 'Dev Account',
        role: 'admin'
      });
      setIsAuthReady(true);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [devMode]);

  useEffect(() => {
    if (isAuthReady && !user && !devMode && view !== 'home' && view !== 'flashcards') {
      setView('home');
    }
  }, [user, isAuthReady, view, devMode]);

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
    setLanguage(newLang);
    if (!devMode) {
      safeLocalStorage.setItem('bh-language', newLang);
    }
  };

  useEffect(() => {
    const savedVersion = safeLocalStorage.getItem(VERSION_KEY);
    if (savedVersion !== CURRENT_VERSION) {
      setShowChangelog(true);
    }
  }, []);

  const handleCloseChangelog = () => {
    if (!devMode) {
      safeLocalStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
    setShowChangelog(false);
    setViewingArchive(false);
  };

  useEffect(() => {
    if (!devMode) {
      safeLocalStorage.setItem('bh-language', language);
    }
  }, [language, devMode]);

  useEffect(() => {
    if (devMode) return;
    const state = {
      view,
      sessionQuestions,
      currentQuestionIndex,
      sessionAnswers
    };
    safeLocalStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
  }, [view, sessionQuestions, currentQuestionIndex, sessionAnswers, SESSION_STATE_KEY, devMode]);

  const sessionCorrectCount = useMemo(() => 
    sessionAnswers.filter(a => a === true).length,
  [sessionAnswers]);

  // Load progress from localStorage or Firestore
  const hasAttemptedLocalSync = useRef(false);

  useEffect(() => {
    if (!isAuthReady) return;

    if (devMode) {
      setProgress([]);
      setUserProfile((prev: any) => prev || { isPremium: true });
      return;
    }

    if (user) {
      // Listen to User Profile
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setUserProfile(profileData);
          
          // If logged in but not verified, force the auth modal/verification view
          if (profileData.verified === false && !devMode && !showAuthModal) {
            setShowAuthModal(true);
          }
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
          hasAttemptedLocalSync.current = true;
        } else {
          // If Firestore is empty but local has progress, sync local to Firestore
          // Only attempt this once per session to avoid restoring deleted progress
          if (!hasAttemptedLocalSync.current) {
            hasAttemptedLocalSync.current = true;
            const allLegacyKeys = ['bh-keywords-progress', 'bh-keywords-progress-biblical', 'bh-keywords-progress-modern', 'bh-keywords-progress-spanish', 'bh-keywords-progress-french'];
            const uniqueProgressMap = new Map();
            
            allLegacyKeys.forEach(key => {
              const saved = safeLocalStorage.getItem(key);
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  parsed.forEach((p: UserProgress) => uniqueProgressMap.set(p.wordId, p));
                } catch (e) {}
              }
            });
            
            const mergedLocalProgress = Array.from(uniqueProgressMap.values());
            
            if (mergedLocalProgress.length > 0) {
              const batch = writeBatch(db);
              mergedLocalProgress.forEach((p: UserProgress) => {
                const docRef = doc(db, 'users', user.uid, 'progress', p.wordId);
                batch.set(docRef, p);
              });
              batch.commit().catch(err => console.error("Initial sync failed:", err));
              setProgress(mergedLocalProgress);
              safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(mergedLocalProgress));
              return;
            }
          }
          
          // If we reach here, we have 0 progress in Firestore and no local to sync.
          setProgress([]);
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
      // Load from local storage and migrate legacy fragmented storage
      const allLegacyKeys = [PROGRESS_KEY, 'bh-keywords-progress-biblical', 'bh-keywords-progress-modern', 'bh-keywords-progress-spanish', 'bh-keywords-progress-french'];
      const uniqueProgressMap = new Map();
      
      allLegacyKeys.forEach(key => {
        const saved = safeLocalStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.forEach((p: UserProgress) => uniqueProgressMap.set(p.wordId, p));
          } catch (e) {}
        }
      });
      
      const mergedLocalProgress = Array.from(uniqueProgressMap.values());
      setProgress(mergedLocalProgress);
      
      if (mergedLocalProgress.length > 0) {
        safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(mergedLocalProgress));
      }
    }
  }, [user, isAuthReady]);

  // Save progress to localStorage whenever progress legitimately updates
  useEffect(() => {
    if (devMode) return;
    // Only save if progress array contains items to prevent wiping on initial mount
    if (progress.length > 0) {
      safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [progress, devMode]);

  // Unified Streak & Daily Goal Logic
  useEffect(() => {
    if (!user || !userProfile || devMode) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUpdateTs = userProfile.lastStreakUpdate;
    const lastUpdate = lastUpdateTs ? new Date(lastUpdateTs) : null;
    if (lastUpdate) {
      lastUpdate.setHours(0, 0, 0, 0);
    }

    let currentStreak = userProfile.streak || 0;
    let currentFreezes = userProfile.streakFreezes || 0;
    let newLastUpdate = lastUpdateTs;
    let needsUpdate = false;

    // 1. Handle Missed Days first
    if (lastUpdate && lastUpdate.getTime() < today.getTime()) {
      const diffTime = today.getTime() - lastUpdate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        const missedDays = diffDays - 1;
        if (currentFreezes >= missedDays) {
          currentFreezes -= missedDays;
          // Set last update to "virtual yesterday" to allow streak continuation today
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          newLastUpdate = yesterday.getTime();
          needsUpdate = true;
        } else {
          currentStreak = 0;
          currentFreezes = 0;
          // Reset last update so they can start fresh today if they finish goal
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          newLastUpdate = yesterday.getTime();
          needsUpdate = true;
        }
      }
    }

    // 2. Handle Daily Goal Completion
    const dailyGoal = srsSettings.dailyGoal || 20;
    // Normalized check to see if we already updated TODAY
    const checkUpdateDate = new Date(newLastUpdate || 0);
    checkUpdateDate.setHours(0, 0, 0, 0);

    if (todayReviews >= dailyGoal && (!newLastUpdate || checkUpdateDate.getTime() < today.getTime())) {
      // Goal met today for the first time!
      currentStreak = (currentStreak || 0) + 1;
      const freezeInterval = isPremium ? 3 : 5;
      const maxFreezes = isPremium ? 5 : 3;

      if (currentStreak % freezeInterval === 0) {
        currentFreezes = Math.min(currentFreezes + 1, maxFreezes);
      }
      newLastUpdate = Date.now();
      needsUpdate = true;
    }

    if (needsUpdate) {
      // Single atomic update to Firestore prevents racing transitions
      setDoc(doc(db, 'users', user.uid), {
        streak: currentStreak,
        streakFreezes: currentFreezes,
        lastStreakUpdate: newLastUpdate
      }, { merge: true }).catch(err => console.error("Error updating streak:", err));
    }
  }, [user, userProfile?.lastStreakUpdate, userProfile?.streak, todayReviews, srsSettings.dailyGoal, devMode, isPremium]);

  const updateFirestoreWordProgress = async (p: UserProgress) => {
    if (!user || devMode) return;
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

  const calculateNextReview = (isCorrect: boolean, currentInterval: number, currentMastery: MasteryLevel, explicitIntervalDays?: number): { interval: number, nextReview: number } => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    const dayInMs = 24 * hourInMs;
    
    if (explicitIntervalDays !== undefined) {
      return {
        interval: explicitIntervalDays,
        nextReview: now + (explicitIntervalDays * dayInMs)
      };
    }

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

  const updateWordProgress = (wordId: string, isCorrect: boolean, explicitIntervalDays?: number) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.wordId === wordId);
      const newProgress = [...prev];
      const now = Date.now();
      let updatedEntry: UserProgress;

      if (existingIndex >= 0) {
        const p = { ...newProgress[existingIndex] };
        const srs = calculateNextReview(isCorrect, p.interval, p.mastery, explicitIntervalDays);
        
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
        const srs = calculateNextReview(isCorrect, 0, 'new', explicitIntervalDays);
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

  const handleAnswer = (isCorrect: boolean, explicitIntervalDays?: number) => {
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
        const srs = calculateNextReview(isCorrect, p.interval, p.mastery, explicitIntervalDays);
        
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
        const srs = calculateNextReview(isCorrect, 0, 'new', explicitIntervalDays);
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
      <InstallPrompt />
      <Navbar 
        onNavigate={(v) => {
          setView(v);
        }} 
        language={language} 
        onLanguageChange={setLanguage}
        user={user}
        userProfile={userProfile}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onShowPro={() => setShowProModal(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        devMode={devMode}
        isPremium={isPremium}
        onShowSettings={() => setShowSettings(true)}
      />

      <main className="pt-16 flex-1">
        <Suspense fallback={<LoadingFallback />}>
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
                onStartFlashcards={handleStartFlashcards}
                onStartTest={() => setView('test')}
                language={language}
                onLanguageChange={handleLanguageChange}
                user={user}
                onSignIn={handleSignIn}
                onShowPro={() => setShowProModal(true)}
                devMode={devMode}
                isPremium={isPremium}
                reducedMotion={preferences.reducedMotion}
              />
              <HowItWorks language={language} />
              <ReviewSection userReviews={userReviews} onLeaveReview={handleLeaveReview} />
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
                onStartFlashcards={handleStartFlashcards}
                onStartTest={() => setView('test')}
                onNavigate={(v) => {
                  setView(v);
                }}
                onResetProgress={() => {
                  setProgress([]);
                  if (!devMode) {
                    safeLocalStorage.removeItem(`bh-flashcard-session-${language}`);
                  }
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
                  if (!devMode) {
                    safeLocalStorage.setItem('bh-srs-settings', JSON.stringify(newSettings));
                  }
                }}
                onLeaveReview={handleLeaveReview}
                onShowSettings={() => setShowSettings(true)}
                shopUnlocked={shopUnlocked}
                onUnlockShop={handleUnlockShop}
              />
              <div className="text-center pb-20">
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => setView('home')}
                    className="text-slate-400 font-bold hover:text-primary transition-colors"
                  >
                    ← Back to Home
                  </button>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                     Powered by AI Learning Algorithm
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'flashcards' && (
            <motion.div
              key={`flashcards-${language}-${selectedTopic || 'full'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlashcardMode
                vocabulary={activeVocabulary}
                onExit={() => {
                  setSelectedTopic(null);
                  setView('home');
                }}
                onSwitchToLearn={startSession}
                onWordProgress={updateWordProgress}
                language={language}
                user={user}
                onRequireAuth={() => {
                  setShowGuestLimitModal(true);
                  setView('home');
                }}
                isPremium={isPremium}
                onShowPro={() => setShowProModal(true)}
                selectedTopic={selectedTopic}
                devMode={devMode}
                srsSettings={srsSettings}
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
                devMode={devMode}
              />
            </motion.div>
          )}

          {view === 'learn' && sessionQuestions.length > 0 && sessionQuestions[currentQuestionIndex] && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-8 md:py-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setView('home')}
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors group"
                    title="Back to Home"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                  </button>
                  <button
                    onClick={() => setView('flashcards')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold hover:bg-primary/10 transition-all text-sm md:text-base"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Switch to Flashcards</span>
                    <span className="sm:hidden">Flashcards</span>
                  </button>
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-bold text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                </div>
                <div className="w-full md:flex-1 md:max-w-md">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <span>Question {currentQuestionIndex + 1} of {sessionQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / sessionQuestions.length) * 100)}%</span>
                  </div>
                  <ProgressBar current={currentQuestionIndex + 1} total={sessionQuestions.length} color="bg-primary" />
                </div>
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
                animationsEnabled={preferences.animationsEnabled}
              />
            </motion.div>
          )}
          {view === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shop
                onBack={() => {
                  setShopUnlocked(false);
                  safeLocalStorage.removeItem('bh-shop-unlocked');
                  setView('dashboard');
                }}
                language={language}
                user={user}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </main>

    <footer className="py-12 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => setShowPrivacy(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl transition-all active:scale-95 text-sm border border-slate-100 dark:border-slate-700"
              >
                Privacy Policy
              </button>
              <a 
                href="https://forms.gle/NjUpvWAZCjTF4aPB6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-all active:scale-95 text-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Request a Feature / Bug
              </a>
              <button 
                onClick={() => setShowContact(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl transition-all active:scale-95 text-sm border border-slate-100 dark:border-slate-700"
              >
                Contact Us
              </button>
              <button 
                onClick={handleLeaveReview}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl transition-all active:scale-95 text-sm border border-slate-100 dark:border-slate-700"
              >
                Leave a Review
              </button>
            </div>
            <p className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="w-3 h-3 fill-current" />
              Vocariox Premium AI Learning
            </p>
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

      {showPrivacy && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-100 dark:border-slate-800 relative"
          >
            <button onClick={() => setShowPrivacy(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Privacy Policy</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-4 font-medium">
              <p>Your privacy is important to us. Here is how we handle your data:</p>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">1. Data Collection</h3>
              <p>We collect your email address and display name only when you create an account to sync your progress across devices.</p>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">2. Learning Progress</h3>
              <p>Your study history, streaks, and flashcard mastery are stored securely in our database to provide your personalized AI learning experience.</p>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">3. Account Deletion</h3>
              <p>You can permanently delete your account and all associated study data at any time from the Settings menu.</p>
              <p className="pt-4 text-xs italic">Last Updated: April 2026</p>
            </div>
            <button 
              onClick={() => setShowPrivacy(false)}
              className="mt-8 w-full py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full border border-slate-100 dark:border-slate-800 relative text-center"
          >
            <button onClick={() => setShowContact(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Get in Touch</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              We value your feedback and would love to hear from you.
            </p>
            <div className="space-y-3">
              <a 
                href="https://forms.gle/pytqWTbHTGodjkDx7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <a 
                href="https://forms.gle/NjUpvWAZCjTF4aPB6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Feature Suggestion
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {showReviewPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full border border-slate-100 dark:border-slate-800 relative overflow-hidden shadow-2xl"
          >
            <button 
              onClick={handleCloseReviewPrompt} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
                <Star className="w-10 h-10 fill-current" />
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                Enjoying your study journey?
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium text-lg leading-relaxed">
                We are constantly improving! Could you spare a moment to share your feedback or leave a review? It helps us immensely.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    handleLeaveReview();
                  }}
                  className="w-full py-4 md:py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xl uppercase tracking-tight"
                >
                  Leave a Review
                </button>
                <button 
                  onClick={handleCloseReviewPrompt}
                  className="w-full py-4 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest text-xs"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" />
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showDevModePasswordModal && (
          <DevModePasswordModal
            onClose={() => setShowDevModePasswordModal(false)}
            onSubmit={handleDevModePasswordSubmit}
          />
        )}
        <Suspense fallback={null}>
          {showAuthModal && (
            <AuthModal 
              onClose={() => setShowAuthModal(false)}
              onVerified={() => {
                // Verification successful
              }}
            />
          )}
        </Suspense>
        
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

        {showProModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <button
                onClick={() => setShowProModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              {trialInfo.isTrialActive ? (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Early Access Active!</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Premium is currently in development. As a new user, you have <strong>{trialInfo.daysLeft} days of early access</strong> to all latest features, including Grammar modules, Exam Prep, Unlimited Flashcards, and Advanced Analytics!
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
                    Your 7-day early access period has ended. Premium is still in development, but we're launching soon!
                  </p>
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 mb-6">
                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Claim 50% Off!
                    </h3>
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-400 line-through mr-2">£9.99/yr</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">£4.99/yr</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-bold text-sm">or <span className="line-through font-normal">£3.99</span> £1.99/mo</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Register your interest now to get an exclusive 50% early bird discount when we officially launch. Get access to Pronunciation Audio, Grammar modules, Exam Prep, Streak Freezes, and unlimited flashcards!
                    </p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          window.open('https://forms.gle/2pfkeCpef1XTrezV7', '_blank');
                          setShowProModal(false);
                        }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                      >
                        Claim My 50% Discount
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowProModal(false)}
                      className="w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                    Premium Roadmap 2026
                  </h2>
                  <div className="space-y-6 mb-8">
                    <div className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                      <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">April 2026</h3>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-bold">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Audio Pronunciations</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Streak Freezes</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced Progress Insights</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full Smart-SRS System</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Test Mode (Active Typing)</li>
                      </ul>
                    </div>
                    
                    <div className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                      <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">June 2026</h3>
                      <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-500 font-bold">
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Easy Grammar Learning Modules</li>
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Listening & Writing Exam Prep</li>
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4" /> Offline Mode & More</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-sm leading-relaxed text-center italic">
                    Claim your <strong className="text-indigo-600 dark:text-indigo-400">50% pioneer discount</strong> now!
                  </p>
                  <button 
                    onClick={() => {
                      window.open('https://forms.gle/2pfkeCpef1XTrezV7', '_blank');
                      setShowProModal(false);
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-indigo-600/20 mb-3 text-lg hover:-translate-y-0.5"
                  >
                    Claim My 50% Discount
                  </button>
                  {!user && (
                    <button 
                      onClick={() => {
                        setShowProModal(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      Sign in to sync your progress
                    </button>
                  )}
                </>
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
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">You're learning fast 🚀</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Sign up to save your progress and unlock smart spaced repetition.
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

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          user={user}
          userProfile={userProfile}
          preferences={preferences}
          onUpdatePreferences={(newPrefs) => setPreferences(prev => ({ ...prev, ...newPrefs }))}
          srsSettings={srsSettings}
          onUpdateSrsSettings={(newSettings) => {
            const updated = { ...srsSettings, ...newSettings };
            setSrsSettings(updated);
            if (!devMode) {
              safeLocalStorage.setItem('bh-srs-settings', JSON.stringify(updated));
            }
          }}
          onUpdateDisplayName={handleUpdateDisplayName}
          onClearProgress={handleClearProgress}
          onDeleteAccount={handleDeleteAccount}
          onExportData={handleExportData}
          onLeaveReview={handleLeaveReview}
          language={language}
          devMode={devMode}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
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

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 pb-8 custom-scrollbar">
                {!viewingArchive ? (
                  CHANGELOG[0].changes.filter(c => devMode || !c.internal).map((item, index) => (
                    <div key={`current-change-${index}`} className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-8">
                    {CHANGELOG.slice(1).map((release) => {
                      const visibleChanges = release.changes.filter(c => devMode || !c.internal);
                      if (visibleChanges.length === 0) return null;
                      
                      return (
                        <div key={release.version} className="space-y-4">
                          <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                            Version {release.version}
                          </h3>
                          <div className="space-y-4">
                            {visibleChanges.map((item, index) => (
                              <div key={`archive-change-${release.version}-${index}`} className="flex gap-4">
                                <div className="mt-1 shrink-0">
                                  <CheckCircle2 className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{item.title}</h4>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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

      <AnimatePresence>
        {showReviewForm && (
          <ReviewFormModal 
            onClose={() => setShowReviewForm(false)} 
            onSubmit={handleSubmitReview} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
