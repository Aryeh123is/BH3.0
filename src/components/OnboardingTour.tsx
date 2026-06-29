import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Layers, 
  Settings, Award, BarChart2, CheckCircle2, Volume2, 
  FileText, Headphones, MessageSquare, Edit3, HelpCircle, Shuffle,
  Mic, Activity, Eye, RefreshCw, Sliders, User, Check, RotateCcw, File
} from 'lucide-react';

interface OnboardingTourProps {
  onClose: () => void;
  language: string;
}

interface TourStep {
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  uiMockup: React.ReactNode;
}

export function OnboardingTour({ onClose, language: initialLanguage }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // States for interactive UI mockups
  const [demoLanguage, setDemoLanguage] = useState(initialLanguage || 'spanish');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardCorrectCount, setCardCorrectCount] = useState(4);
  const [cardWrongCount, setCardWrongCount] = useState(1);
  const [demoAnswer, setDemoAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [scorecardTab, setScorecardTab] = useState<'summary' | 'missed'>('summary');
  
  // Paper interactive simulation states
  const [activePaperTab, setActivePaperTab] = useState<'paper1' | 'paper2' | 'paper3' | 'paper4'>('paper1');
  const [paper1Speed, setPaper1Speed] = useState<number>(1.0);
  const [paper1Playing, setPaper1Playing] = useState<boolean>(false);
  const [paper2Recording, setPaper2Recording] = useState<boolean>(false);
  const [paper2Feedback, setPaper2Feedback] = useState<string | null>(null);
  const [paper3Glossary, setPaper3Glossary] = useState<boolean>(false);
  const [paper4WordCount, setPaper4WordCount] = useState<number>(42);

  // Playground interactive mockup states
  const [playgroundTab, setPlaygroundTab] = useState<'verbs' | 'grammar' | 'pastPapers'>('verbs');
  const [selectedTense, setSelectedTense] = useState<'present' | 'preterite' | 'future'>('present');
  const [grammarNoun, setGrammarNoun] = useState<'masculine' | 'feminine'>('masculine');

  // Custom Decks mockup state
  const [quizletInput, setQuizletInput] = useState("el perro - the dog\nel gato - the cat\nla manzana - the apple");
  const [parsedCards, setParsedCards] = useState<Array<{ foreign: string, english: string }>>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Settings mockup states
  const [advSrsActive, setAdvSrsActive] = useState(true);
  const [multiplierVal, setMultiplierVal] = useState(1.5);
  const [demoTheme, setDemoTheme] = useState<'light' | 'dark'>('dark');

  // Multi-language dictionary values for mockup details
  const getLanguageDetails = (lang: string) => {
    switch (lang) {
      case 'french':
        return { 
          flag: <img src="https://flagcdn.com/w40/fr.png" alt="French" className="w-5 h-3.5 object-cover rounded-sm inline-block shrink-0 border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />, 
          name: 'French', 
          examBoard: 'Edexcel GCSE', 
          word: 'le livre', 
          translation: 'the book', 
          cat: 'Noun/Masculine', 
          verbRoot: 'manger', 
          present: 'mange', 
          past: 'ai mangé' 
        };
      case 'german':
        return { 
          flag: <img src="https://flagcdn.com/w40/de.png" alt="German" className="w-5 h-3.5 object-cover rounded-sm inline-block shrink-0 border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />, 
          name: 'German', 
          examBoard: 'AQA GCSE', 
          word: 'das Buch', 
          translation: 'the book', 
          cat: 'Noun/Neutral', 
          verbRoot: 'spielen', 
          present: 'spiele', 
          past: 'habe gespielt' 
        };
      case 'arabic':
        return { 
          flag: <img src="https://flagcdn.com/w40/sa.png" alt="Arabic" className="w-5 h-3.5 object-cover rounded-sm inline-block shrink-0 border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />, 
          name: 'Arabic', 
          examBoard: 'Edexcel GCSE', 
          word: 'الكتاب', 
          translation: 'the book', 
          cat: 'Noun/Masculine', 
          verbRoot: 'كتب', 
          present: 'يكتب', 
          past: 'كتبَ' 
        };
      case 'biblical':
        return { 
          flag: <span className="text-base leading-none shrink-0" title="Biblical Hebrew">📜</span>, 
          name: 'Biblical Hebrew', 
          examBoard: 'GCSE Level', 
          word: 'הַסֵּפֶר', 
          translation: 'the book', 
          cat: 'Noun/Definite', 
          verbRoot: 'כתב', 
          present: 'כֹּتֵב', 
          past: 'כָּתַב' 
        };
      case 'modern':
        return { 
          flag: <img src="https://flagcdn.com/w40/il.png" alt="Modern Hebrew" className="w-5 h-3.5 object-cover rounded-sm inline-block shrink-0 border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />, 
          name: 'Modern Hebrew', 
          examBoard: 'AQA GCSE', 
          word: 'הספר', 
          translation: 'the book', 
          cat: 'Noun/Masculine', 
          verbRoot: 'ללמוד', 
          present: 'לומד', 
          past: 'למדתי' 
        };
      case 'spanish':
      default:
        return { 
          flag: <img src="https://flagcdn.com/w40/es.png" alt="Spanish" className="w-5 h-3.5 object-cover rounded-sm inline-block shrink-0 border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />, 
          name: 'Spanish', 
          examBoard: 'Edexcel GCSE', 
          word: 'el libro', 
          translation: 'the book', 
          cat: 'Noun/Masculine', 
          verbRoot: 'hablar', 
          present: 'hablo', 
          past: 'hablé' 
        };
    }
  };

  const currentDetails = getLanguageDetails(demoLanguage);

  const steps: TourStep[] = [
    {
      title: "Welcome to Vocariox!",
      category: "Getting Started",
      icon: <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />,
      description: "Welcome to Vocariox, your elite, high-performance study engine built specifically to help you score a Grade 9 on GCSE Spanish, French, German, Arabic, or Hebrew! This interactive tour will show you exactly how to navigate each mode.",
      uiMockup: (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-sm mx-auto">
          <div className="text-3xl sm:text-4xl">👋</div>
          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm sm:text-base">Multiple Languages</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed px-2">
            Vocariox integrates full curriculum databases (Foundation Tier grades 1-5 and Higher Tier grades 4-9) that update automatically.
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2 text-[9px] sm:text-[10px] font-black uppercase text-slate-400 mt-2">
            <span>📚 Fully aligned to standards</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-500 font-extrabold hidden sm:inline">Active cloud sync connected</span>
          </div>
        </div>
      )
    },
    {
      title: "Select Your Subject",
      category: "Getting Started",
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
      description: "Click the buttons in the mockup below to change your active tongue and explore!\n\n💡 TO CHANGE LANGUAGE: In the real app, you can switch your active GCSE language at any time by clicking the flag button inside the top navigation bar header or choosing a flag on the homepage dashboard.",
      uiMockup: (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-sm mx-auto">
          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm sm:text-base">GCSE Curriculum</h4>
          {/* Interactive flag selection panel */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
            {(['spanish', 'french', 'german', 'arabic', 'modern', 'biblical'] as const).map((langKey) => {
               const info = getLanguageDetails(langKey);
               const isActive = demoLanguage === langKey;
               return (
                 <button
                   key={`lang-key-${langKey}`}
                   onClick={() => setDemoLanguage(langKey)}
                   className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                     isActive 
                       ? 'bg-indigo-600 text-white shadow-md scale-105' 
                       : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                   }`}
                 >
                   {info.flag}
                   <span className="hidden sm:inline text-[10px]">{info.name}</span>
                 </button>
               );
            })}
          </div>

          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-800/60 p-2 sm:p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 leading-relaxed text-left">
            🎯 <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Active App Switcher:</span> Simply click the active flag or language name dropdown in the top navigation header of the main app to swap languages instantly, anywhere!
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2 text-[9px] sm:text-[10px] font-black uppercase text-slate-400">
            <span>📚 {currentDetails.examBoard} standard</span>
          </div>
        </div>
      )
    },
    {
      title: "Flashcard Mode with Keyboard Shortcuts",
      category: "Vocabulary Core",
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      description: "Tackle target vocabulary inside manageable spaced repetition batches. Use touch buttons, or experience lightning-fast hands-free operation with keyboard shortcuts. Press space or flip to reveal definitions, then record if you remembered or forgot the card.",
      uiMockup: (
        <div className="space-y-4 w-full">
          {/* Flashcard container with 3D flip effect simulation - perfectly isolated with backface-hidden and solid bounds */}
          <div className="relative h-44 w-full max-w-sm mx-auto perspective-1000">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute inset-0 w-full h-full relative cursor-pointer"
              onClick={() => setIsFlipped(prev => !prev)}
            >
              {/* Front view */}
              <div 
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden',
                  zIndex: isFlipped ? 0 : 1 
                }}
                className="absolute inset-0 p-5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-100 rounded-[2rem] shadow-xl flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Vocariox Card #42</span>
                  <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-extrabold uppercase">
                    {currentDetails.cat}
                  </span>
                </div>
                <div className="text-center py-4 flex flex-col items-center justify-center">
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center justify-center gap-1.5 mb-2">
                    <span>Target Language:</span>
                    {currentDetails.flag}
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {currentDetails.word}
                  </p>
                </div>
                <div className="text-center text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">
                  👉 Click to Flip Card
                </div>
              </div>

              {/* Back view */}
              <div 
                style={{ 
                  backfaceVisibility: "hidden", 
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  zIndex: isFlipped ? 1 : 0
                }}
                className="absolute inset-0 p-5 bg-indigo-600 border-2 border-indigo-600 rounded-[2rem] shadow-xl flex flex-col justify-between text-white"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Answer Reveal</span>
                  <span className="px-2 py-0.5 rounded text-[8px] bg-white/20 text-white font-extrabold uppercase">Definite Match</span>
                </div>
                <div className="text-center py-4">
                  <span className="text-[10px] uppercase font-black text-indigo-200 tracking-widest block mb-1">English Translation</span>
                  <p className="text-3xl font-black text-white">
                    {currentDetails.translation}
                  </p>
                </div>
                <div className="text-center text-[9px] font-bold text-indigo-200 uppercase">
                  Click to flip back
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Keyboard & Navigation explanation */}
          <div className="bg-slate-100 dark:bg-slate-800/40 p-4 rounded-[1.5rem] text-left space-y-2.5 max-w-sm mx-auto">
            <h5 className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">⚡ Highly Responsive Hotkeys:</h5>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded shadow-xs text-xs font-mono font-bold text-indigo-600">A</kbd>
                <p className="font-extrabold mt-1 text-[9px] text-slate-500 lowercase">Forgot (Left Arrow)</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded shadow-xs text-xs font-mono font-bold text-indigo-600">W / S</kbd>
                <p className="font-extrabold mt-1 text-[9px] text-slate-500 lowercase">Flip Card (Space)</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded shadow-xs text-xs font-mono font-bold text-indigo-600">D</kbd>
                <p className="font-extrabold mt-1 text-[9px] text-slate-500 lowercase">Correct (Right Arrow)</p>
              </div>
            </div>
            
            {/* Retry Session explanation */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-black uppercase text-slate-400">🔄 Isolated Retry Counters</span>
              <div className="flex gap-1.5">
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 font-black rounded-md">✓ {cardCorrectCount}</span>
                <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 font-black rounded-md">✗ {cardWrongCount}</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              💡 <em>Retry Session:</em> Retrying failed words occurs inside self-contained sub-sessions that preserve your general analytics. You can re-run incorrect piles until fully mastered.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Active Learn Mode with Multi-sensory Assist",
      category: "Active Recall",
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
      description: "Bridge the gap between recognizing a word and recalling it from scratch. Active Learn Mode prompts you to type translations or match spellings, while checking accents block-by-block.",
      uiMockup: (
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto space-y-4 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Active learning simulation</span>
            <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded-lg">Spelling Prompt</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest leading-none">Translate word into English:</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{currentDetails.word}</span>
              <span className="text-[10px] text-slate-400 italic">Native accent matching active</span>
            </div>
          </div>

          {/* Simulated Input */}
          <div className="space-y-1.5">
            <input 
              type="text" 
              value={demoAnswer}
              onChange={(e) => {
                setDemoAnswer(e.target.value);
                setAnswerSubmitted(false);
              }}
              placeholder={`Type English meaning ('${currentDetails.translation}')`}
              className="w-full text-xs font-mono p-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl outline-hidden text-slate-805 dark:text-white"
            />
            {answerSubmitted && (
              <div className={`p-2.5 rounded-xl border text-[11px] font-bold ${
                answerCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                  : 'bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400'
              }`}>
                {answerCorrect ? "✓ Outstanding Recall! Spacing interval enlarged." : "✗ Incorrect spelling. Target translation: " + currentDetails.translation}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2.5">
            <button 
              onClick={() => {
                const isCorrect = demoAnswer.toLowerCase().trim() === currentDetails.translation.toLowerCase();
                setAnswerCorrect(isCorrect);
                setAnswerSubmitted(true);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer shadow-xs"
            >
              ✓ Submit Answer
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Customisable Test Mode & GCSE Grade Engine",
      category: "Self Assessment",
      icon: <Award className="w-6 h-6 text-indigo-500" />,
      description: "Test your skills with multiple question pools. Customise parameters to show Multiple Choice options, vocabulary definitions, or manual text writing assessments. Conclude and view a responsive exam scorecard translating your statistics directly into GCSE Grades.",
      uiMockup: (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-3 sm:space-y-4 max-w-sm mx-auto text-center relative overflow-hidden">
          {/* Tabs inside Scorecard preview */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            <button 
              onClick={() => setScorecardTab('summary')}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                scorecardTab === 'summary' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              🏆 Practice Score
            </button>
            <button 
              onClick={() => setScorecardTab('missed')}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                scorecardTab === 'missed' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              ❌ Missed Errors
            </button>
          </div>

          <AnimatePresence mode="wait">
            {scorecardTab === 'summary' ? (
              <motion.div 
                key="summary-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3 py-1"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-3xl font-black relative">
                  92%
                  <div className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-white dark:border-slate-900">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Grade Achieved: Grade 9</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase mt-1 leading-none tracking-widest">★ Foundation-Higher Cleared</p>
                </div>
                
                {/* Stats Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800 pt-2 px-1">
                  <span>⏱️ Time Taken: 03:45</span>
                  <span>Questions Correct: 23/25</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="missed-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-2 text-left py-1 text-xs"
              >
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Targeted Weak Spot correction Needed:</p>
                <div className="space-y-1.5 h-24 overflow-y-auto pr-1">
                  <div className="p-2 bg-red-500/5 dark:bg-red-505/10 rounded-lg border border-red-500/15 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{currentDetails.word}</p>
                      <p className="text-[9px] text-slate-400">Written typo</p>
                    </div>
                    <span className="text-[10px] text-red-500 font-bold">Try again</span>
                  </div>
                  <div className="p-2 bg-red-500/5 dark:bg-red-505/10 rounded-lg border border-red-500/15 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">el gato</p>
                      <p className="text-[9px] text-slate-400">Clicked 'the dog'</p>
                    </div>
                    <span className="text-[10px] text-red-500 font-bold font-bold">Try again</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      title: "Interactive AI GCSE Exam Simulator",
      category: "Exam Simulation Suite",
      icon: <FileText className="w-6 h-6 text-indigo-500 animate-bounce" />,
      description: "Our core crown jewel. Experience real, simulated mock conditions for every core exam paper built exactly to AQA & Edexcel specifications. No other program includes specialized engines for all 4 papers. Use the tabs below to test each preview interactive scenario and watch how they operate!",
      uiMockup: (
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto space-y-4 text-left">
          {/* Active Mode Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            {(['paper1', 'paper2', 'paper3', 'paper4'] as const).map((tab) => {
              const tabLabels = {
                paper1: 'P1: List',
                paper2: 'P2: Speak',
                paper3: 'P3: Read',
                paper4: 'P4: Write'
              };
              return (
                <button
                  key={`paper-tab-${tab}`}
                  onClick={() => setActivePaperTab(tab)}
                  className={`py-1.5 px-0.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer ${
                    activePaperTab === tab 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>

          {/* Render Active mock simulation */}
          <AnimatePresence mode="wait">
            {activePaperTab === 'paper1' && (
              <motion.div 
                key="paper1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 h-52 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-extrabold uppercase flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5" /> Paper 1: Listening
                    </span>
                    <span className="text-[8px] text-indigo-650 dark:text-indigo-400 font-extrabold uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded">Higher Tier</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-2">
                    Listen to authentic exam listening recordings. Includes adjustable native voice playback speeds (0.8x - 1.2x) to assist step-by-step listening comprehension.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md font-black text-[9px] uppercase">
                      🔊 PLAYING
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">0:42 / 1:30</span>
                  </div>
                  
                  {/* Non-interactive speed indicators */}
                  <div className="flex gap-1">
                    {[0.8, 1.0, 1.2].map((speed) => (
                      <span
                        key={`tour-speed-${speed}`}
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          speed === 1.0
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {speed}x
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activePaperTab === 'paper2' && (
              <motion.div 
                key="paper2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 h-52 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] bg-rose-500/10 text-rose-650 dark:text-rose-400 font-extrabold uppercase flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Paper 2: Speaking
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-black">AI Oral Feedback</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-2">
                    Practise photo card presentations and oral roleplay dialogues. Real-time AI evaluates pronunciation, grammar accuracy, and vocabulary coverage.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-full py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase text-center flex items-center justify-center gap-1.5 border border-rose-100 dark:border-rose-900/55">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    Speech Input Tracked
                  </div>
                  
                  {/* Static visual audio waveform representation */}
                  <div className="flex justify-center gap-1 h-3 items-center opacity-85">
                    {[1.2, 2.5, 4.0, 3.1, 1.8, 3.5, 4.1, 1.9, 1.1].map((h, i) => (
                      <span key={i} className="w-1 bg-rose-450 dark:bg-rose-500 rounded-full" style={{ height: `${h * 3.5}px` }}></span>
                    ))}
                  </div>

                  <div className="p-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-[9px] font-bold text-center leading-normal">
                    ✓ AI Grading: <strong>94% (Grade 9 target)</strong><br />
                    Excellent irregular tense structure and stress placement.
                  </div>
                </div>
              </motion.div>
            )}

            {activePaperTab === 'paper3' && (
              <motion.div 
                key="paper3"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 h-52 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Paper 3: Reading
                    </span>
                    <span className="text-[8px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded font-bold uppercase">Glossary Tooltip</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-2">
                    Browse side-by-side comprehension exercises. Highlight any text or click integrated glossary helpers to view instant translate tooltips on-screen.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/65 dark:border-slate-850 relative">
                  <p className="text-[10px] font-mono text-slate-500 italic">
                    "I walked to the local <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1 rounded-sm border-b-2 border-indigo-500 font-bold">library</span> to check out a study booklet."
                  </p>
                  
                  {/* Pop over dictionary card simulation */}
                  <div className="absolute -top-5 right-2 p-1 bg-indigo-600 text-white text-[8px] font-bold rounded-lg shadow-md flex items-center gap-1 select-none animate-bounce-subtle">
                    <span>📖 library → biblioteca / bibliothèque</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activePaperTab === 'paper4' && (
              <motion.div 
                key="paper4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 h-52 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] bg-purple-500/10 text-purple-650 dark:text-purple-400 font-extrabold uppercase flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Paper 4: Writing Essay
                    </span>
                    <span className="text-[9px] text-purple-650 dark:text-purple-400 font-black">92 / 90 words</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-2">
                    Compose formal essays with real-time feedback. Integrated word counters help track 90-word/150-word layouts required by GCSE marks schedules.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[9.5px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed max-h-16 overflow-hidden">
                  <span className="text-indigo-600 dark:text-indigo-400">"</span>Mi escuela es bastante moderna y grande. Lo bueno es que los profesores son muy amables y nos ayudan a prepararnos para los exámenes GCSE...<span className="text-indigo-600 dark:text-indigo-400">"</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      title: "Verb Playgrounds, Grammar & Past Papers",
      category: "Mastery Systems",
      icon: <Award className="w-6 h-6 text-indigo-500" />,
      description: "Dive deep into functional, structured tools designed to fix specific weak spots. Drill down into individual conjugations, correct grammatical genders, or browse chronological past paper solutions with print options.",
      uiMockup: (
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 max-w-sm mx-auto space-y-4 text-left">
          {/* Playground Mode Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            {(['verbs', 'grammar', 'pastPapers'] as const).map((tab) => {
              const labelMap = {
                verbs: '⚔️ Verb Master',
                grammar: '📚 Grammar',
                pastPapers: '📋 Past Papers'
              };
              return (
                <button
                  key={`playground-tab-${tab}`}
                  onClick={() => setPlaygroundTab(tab)}
                  className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    playgroundTab === tab ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {playgroundTab === 'verbs' && (
              <motion.div 
                key="verbs-play"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500">Selected Verb: <strong className="text-slate-900 dark:text-white font-black">{currentDetails.verbRoot}</strong></span>
                  
                  {/* Select Tense slider */}
                  <div className="flex gap-1">
                    {(['present', 'preterite', 'future'] as const).map((t) => (
                      <button
                        key={`verb-tense-${t}`}
                        onClick={() => setSelectedTense(t)}
                        className={`px-1 rounded text-[8px] uppercase font-black tracking-widest ${
                          selectedTense === t 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">First Person Singular</span>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {selectedTense === 'present' ? currentDetails.present : selectedTense === 'preterite' ? currentDetails.past : `voy a ${currentDetails.verbRoot}`}
                  </p>
                </div>
              </motion.div>
            )}

            {playgroundTab === 'grammar' && (
              <motion.div 
                key="grammar-play"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500">Gender & Agreement Drills</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setGrammarNoun('masculine')}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${grammarNoun === 'masculine' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      Masculine
                    </button>
                    <button 
                      onClick={() => setGrammarNoun('feminine')}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${grammarNoun === 'feminine' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      Feminine
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Determiner Agreement Rules</p>
                  <p className="font-mono font-black text-slate-850 dark:text-slate-200">
                    {grammarNoun === 'masculine' ? 'el chico rubio (m)' : 'la chica rubia (f)'}
                  </p>
                </div>
              </motion.div>
            )}

            {playgroundTab === 'pastPapers' && (
              <motion.div 
                key="papers-play"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-semibold"
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-405">Summer Exam Series (2018-2025)</span>
                  <span className="text-emerald-500">Officially Solved</span>
                </div>
                
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-lg flex justify-between items-center">
                    <span className="font-mono text-[10px]">AQA GCSE 2024 German Higher</span>
                    <button 
                      onClick={() => alert("Simulating document generator download link!")}
                      className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-bold rounded hover:bg-indigo-700 cursor-pointer"
                    >
                      PDF
                    </button>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-lg flex justify-between items-center">
                    <span className="font-mono text-[10px]">Edexcel 2023 Spanish Foundation</span>
                    <button 
                      onClick={() => alert("Simulating document generator download link!")}
                      className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-bold rounded hover:bg-indigo-700 cursor-pointer"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      title: "Quizlet Importers & Custom Decks",
      category: "Personalization",
      icon: <Shuffle className="w-6 h-6 text-indigo-500" />,
      description: "Do you have specific vocab handouts from school lessons? You don't need to manually type everything. Just copy-paste any public Quizlet, CSV, or text-delimited document and watch Vocariox convert it into a custom card stack!",
      uiMockup: (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-xl border border-slate-250 dark:border-slate-800 max-w-sm mx-auto text-left space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Quizlet Parser Tool</span>
            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Raw Text Delimited</span>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Delimiter Input:</p>
            <textarea 
              value={quizletInput}
              onChange={(e) => setQuizletInput(e.target.value)}
              rows={3}
              placeholder="Paste custom raw strings here..."
              className="w-full text-[10px] font-mono p-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl outline-hidden text-slate-800 dark:text-slate-300"
            />
          </div>

          <button 
            onClick={() => {
              setIsParsing(true);
              setParsedCards([]);
              setTimeout(() => {
                const lines = quizletInput.split('\n');
                const parsed = lines.map(line => {
                  const parts = line.split('-');
                  return {
                    foreign: parts[0]?.trim() || '',
                    english: parts[1]?.trim() || ''
                  };
                }).filter(p => p.foreign && p.english);
                
                setParsedCards(parsed);
                setIsParsing(false);
              }, 1200);
            }}
            disabled={isParsing}
            className="w-full py-3 bg-slate-950 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Parsing cards...
              </>
            ) : '⚡ Parse & Build Deck'}
          </button>

          {parsedCards.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-[10px] font-bold space-y-1"
            >
              <span className="block font-black uppercase text-[9px] text-emerald-500">Successfully Created Stack:</span>
              <div className="font-mono text-[9px] max-h-12 overflow-y-auto">
                {parsedCards.map((card, idx) => (
                  <div key={`parsed-card-${idx}-${card.foreign}`}>✓ {card.foreign} → {card.english}</div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )
    },
    {
      title: "Advanced AI Spaced Repetition (SRS)",
      category: "Power Settings",
      icon: <Settings className="w-6 h-6 text-indigo-500" />,
      description: "Vocariox features a highly customisable Spaced Repetition System (SRS). Standard (Leitner) uses regular card decks, but the premium 'Advanced AI' algorithm uses a 4-button review screen (Forgot, Partial Recall, Effortful Recall, Easy) to mathematically extend or compress review times from 1 minute to 14 days based on your performance. You can turn this on at any time by navigating to Settings > Spaced Repetition!",
      uiMockup: (
        <div className={`p-5 rounded-[2.5rem] border border-slate-205 transition-colors duration-300 max-w-sm mx-auto space-y-4 text-left shadow-xl ${
          demoTheme === 'dark' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Device Customisation Settings</span>
            <button 
              onClick={() => setDemoTheme(demoTheme === 'dark' ? 'light' : 'dark')}
              className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 rounded-lg cursor-pointer"
            >
              Toggle {demoTheme === 'dark' ? '🔆 Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Advanced SRS Option Toggle */}
            <div className="flex justify-between items-center bg-slate-100/10 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/5">
              <div>
                <p className="text-[10px] font-black uppercase">Advanced SRS Scales</p>
                <p className="text-[8px] text-slate-400">Customise spacing intervals manually</p>
              </div>
              <button 
                onClick={() => setAdvSrsActive(!advSrsActive)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex items-center ${
                  advSrsActive ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>

            {/* SRS multiplier slider representation */}
            {advSrsActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2.5 bg-slate-100/10 dark:bg-slate-950 rounded-xl space-y-1.5"
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Multiplier coefficient:</span>
                  <span className="text-indigo-400 font-mono font-black">{multiplierVal}x</span>
                </div>
                <input 
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={multiplierVal}
                  onChange={(e) => setMultiplierVal(parseFloat(e.target.value))}
                  className="w-full h-1.5 accent-indigo-500 rounded-lg outline-hidden cursor-pointer"
                />
              </motion.div>
            )}

            {/* Auth Cloud Backup status */}
            <div className="bg-slate-100/10 dark:bg-slate-950 p-2.5 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase">Instant Cloud Backup Enabled</p>
                <p className="text-[8px] text-slate-400">Register in Settings to secure study paths</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 sm:p-6 max-w-xl mx-auto w-full border border-slate-100 dark:border-slate-805 relative shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Top bar with progress indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[9px] bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 font-extrabold uppercase tracking-widest border border-indigo-500/20">
              {activeStep.category}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Content */}
        <div className="flex-1 my-3 min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Slide Heading */}
              <div className="flex gap-3 items-start">
                <div className="p-3 bg-indigo-50 dark:bg-slate-800/85 rounded-2xl shrink-0 mt-0.5 border border-indigo-500/10">
                  {activeStep.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                    {activeStep.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                    {activeStep.description}
                  </p>
                </div>
              </div>

              {/* Graphical illustration Mockup */}
              <div className="py-2 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
                  {activeStep.uiMockup}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls Footer */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 text-slate-404 hover:text-slate-800 dark:hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={`dot-step-${idx}`}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-500' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:translate-y-[-1px] active:scale-95 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {currentStep === steps.length - 1 ? "Start Studying" : "Next Step"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
