import React, { useState } from 'react';
import { Play, Book, Trophy, RotateCw, MessagesSquare, BookOpen, Lock, Layers, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModesGuideProps {
  language: string;
}

export function ModesGuide({ language }: ModesGuideProps) {
  const [activeMode, setActiveMode] = useState<string>('smart-srs');

  const modes = [
    {
      id: 'smart-srs',
      title: 'Smart Learning',
      icon: <Play className="w-5 h-5" />,
      color: 'bg-indigo-500 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'The core spaced-repetition (SRS) learning engine.',
      benefits: [
        'Automatically prioritizes words you struggle with.',
        'Uses scientifically proven spaced repetition to ensure long-term retention.',
        'Tracks mastery levels from \'New\' to \'Mastered\'.'
      ],
      howTo: 'Click "Start Learning Now" on the dashboard. You\'ll be tested on a mix of new words and words ready for review. Type the correct translation to answer.'
    },
    {
      id: 'flashcards',
      title: 'Flashcard Sandbox',
      icon: <Book className="w-5 h-5" />,
      color: 'bg-emerald-500 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'A relaxed, self-paced review environment without typing.',
      benefits: [
        'Quickly breeze through vocabulary without strict scoring.',
        'Great for last-minute cramming or visual review.',
        'Self-grade by flipping the card and deciding if you knew it.'
      ],
      howTo: 'Select "Flashcards" from the dashboard, pick a category (or all words), and click to flip the card. Use arrow keys or swipe to navigate.'
    },
    {
      id: 'custom-decks',
      title: 'Custom Deck Engine',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-emerald-600 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'Import or create your own custom study sets.',
      benefits: [
        'Import instantly from Quizlet URLs using our secure proxy.',
        'Paste raw text lists to quickly build personal revision decks.',
        'Use the full Smart SRS engine on your own specialized content.'
      ],
      howTo: 'Click "Manage Decks" or "New Deck" on the dashboard. Use the "Import from Quizlet" option for automatic multi-card creation from a link.'
    },
    {
      id: 'test',
      title: 'Written Test Mode',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-rose-500 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'Simulates intense exam conditions with a strict quiz.',
      benefits: [
        'Generates a randomized test from your vocabulary.',
        'Forces you to recall spelling and precise meanings.',
        'Provides an end-of-test grade to track exam readiness.'
      ],
      howTo: 'Click "Test Mode" on the dashboard. Choose the number of questions, then try to get the highest score possible. Mistakes will be highlighted at the end.'
    },
    {
      id: 'incorrect',
      title: 'Review Errors',
      icon: <RotateCw className="w-5 h-5" />,
      color: 'bg-amber-500 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'Target your weakest links by reviewing past mistakes.',
      benefits: [
        'Specifically targets words you\'ve gotten wrong previously.',
        'Helps clear bottlenecks in your learning journey.'
      ],
      howTo: 'Click "Review Errors" on the dashboard. You will only see words that have a recorded incorrect attempt in your study history.'
    },
    {
      id: 'verb-master',
      title: 'Verb Master Practice',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-indigo-600 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'An interactive conjugation sandbox designed for mastering high-yield verbs, irregular grids, and tenses across all subjects.',
      benefits: [
        'Mastery Multiplier: Consecutive correct answers increase your multiplier by +0.3 (up to x2.5), accelerating your streak score, while any incorrect answer resets it back to x1.0.',
        'Active Retention: A dynamic memory-fade indicator starting at 60% that updates live to show your cognitive retention based on conjugation accuracy.',
        'Session History Log: Track every submission in a neat session-end history log to identify persistent conjugation bottlenecks.',
        'Mistake Review Sandbox: Automatically logs incorrect conjugations so you can launch a targeted, pressure-free review round to correct mistakes immediately.'
      ],
      howTo: 'Click "Verb Master Playground" from the dashboard. Choose your preferred round length, answer conjugation multiple-choice quizzes, build up your Mastery Multiplier, and review your Mistakes at the end of the round.'
    },
    {
      id: 'speaking',
      title: 'Speaking Mock (Pro)',
      icon: <MessagesSquare className="w-5 h-5" />,
      color: 'bg-purple-500 text-white',
      availableFor: ['french', 'spanish', 'german', 'modern'],
      status: 'active',
      description: 'Simulate a real GCSE speaking exam with AI roleplay and feedback. (Premium Feature)',
      benefits: [
        'Practice responding to common GCSE speaking prompts.',
        'Simulates conversation with an examiner.',
        'Builds confidence for oral exams.'
      ],
      howTo: 'Requires a Premium subscription. Select "Special Modes" and select "Speaking Mock Exam" from the dashboard.'
    },
    {
      id: 'grammar',
      title: 'Grammar Mastery (Pro)',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-teal-500 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'Learn regular/irregular structures, case files, Binyanim, conjugations, and syntax custom-tailored to your language with an interactive AI Tutor. (Premium Feature)',
      benefits: [
        'Understand exactly how verbs are constructed and conjugated across tenses.',
        'Master common prefixes, suffixes, articles, and noun declension rules.',
        'Practice parsing with a responsive AI Tutor customized specifically for GCSE specifications (AQA/Edexcel).'
      ],
      howTo: 'Requires Premium. Click "Grammar Mastery" on the dashboard. Browse the Grammar modules, or click the "AI Grammar Tutor" button. Select a topic and chat with the AI to test your understanding of your language group rules and syntax.'
    },
    {
      id: 'ai-exam',
      title: 'Exam Simulator (Pro)',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-indigo-600 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'The absolute sandbox simulation environment mirroring genuine GCSE guidelines.',
      benefits: [
        'Training Mode: Interactive study aids with immediate translations, vocabs, and unlimited playbacks.',
        'Exam Mode: Restricts play counts to 2 runs, disables study hints, and simulates rigorous exam conditions.',
        'Global Accommodations: Apply the globally-active 25% Extra Time allowance inside countdown timers seamlessly.'
      ],
      howTo: 'Select "Exam Simulator" from the dashboard interface. Fine-tune your environment between Training or Exam style, and choose from Speaking, Listening, Reading, or Writing papers.'
    },
    {
      id: 'past-papers',
      title: 'Past Papers Tracker',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-slate-700 text-white',
      availableFor: 'all',
      status: 'active',
      description: 'Keep track of your past paper progress and official scores.',
      benefits: [
        'Monitor your grades across different exam years dynamically.',
        'Syncs with official grade boundaries to show your true grade trajectory.',
        'Provides tailored feedback loops for completed essays.'
      ],
      howTo: 'Access Past Papers from the dashboard sidebar or options menu, enter your practice scores, and see your GCSE targets update live.'
    },
    {
      id: 'security',
      title: 'Regulated Security & Integrity',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'bg-slate-900 text-indigo-400 dark:bg-slate-800',
      availableFor: 'all',
      status: 'active',
      description: 'Strict, multi-layered data compliance systems ensuring your profile database and memory analytics are un-hackable.',
      benefits: [
        'Concurrent Stream Tracking: Restricts continuous account-sharing and anti-cheat attempts via live activeSessionId matching.',
        'PCI-DSS Certified Transactions: Secure Stripe tokenization ensures credit card details never touch Vocariox servers.',
        'Total User Rule Authorization: Security verification layers protect key student records and progress files.',
        'GDPR Compliance: Absolute data authority with instant, permanent account-wiping mechanisms in Settings.'
      ],
      howTo: 'Vocariox is hardened using secure Firebase rules restricting database progress to authenticated user owners only. No local passwords or billing codes are ever stored in cleartext.'
    }
  ];

  const visibleModes = modes;

  const activeModeData = visibleModes.find(m => m.id === activeMode) || visibleModes[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-[600px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
      
      {/* Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-2">Available Modes</h3>
        {visibleModes.map(mode => {
          const isAvailable = mode.availableFor === 'all' || mode.availableFor.includes(language);
          
          return (
            <button
              key={mode.id}
              onClick={() => isAvailable && setActiveMode(mode.id)}
              disabled={!isAvailable}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all ${
                activeMode === mode.id 
                  ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ring-1 ring-primary/20' 
                  : !isAvailable
                  ? 'opacity-50 cursor-not-allowed filter grayscale bg-slate-100/50 dark:bg-slate-800/20 text-slate-400 border border-transparent'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mode.color} shadow-sm`}>
                {mode.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className={`font-bold text-sm truncate ${!isAvailable ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>{mode.title}</div>
                {!isAvailable ? (
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Other Languages Only</div>
                ) : (mode.status === 'in-progress' || mode.status === 'dev-only') && (
                  <div className="text-[9px] font-black uppercase tracking-widest text-amber-500">In Progress</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto custom-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModeData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeModeData.color} shadow-md`}>
                {activeModeData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{activeModeData.title}</h2>
                {(activeModeData.status === 'in-progress' || activeModeData.status === 'dev-only') ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-black uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Under Construction
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Active Mode
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">What is it?</h4>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {activeModeData.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">Key Benefits</h4>
                <ul className="space-y-2">
                  {activeModeData.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">How to Use</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {activeModeData.howTo}
                </p>
              </div>
              
              {(activeModeData.status === 'in-progress' || activeModeData.status === 'dev-only') && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <p className="text-amber-700 dark:text-amber-400 text-sm font-bold">
                    Note: This feature is currently in active development. Features marked as "In Progress" are either partially functioning or temporarily restricted to developer mode.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
