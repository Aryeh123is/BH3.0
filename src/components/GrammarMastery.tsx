import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, ChevronRight, Info, Book, SpellCheck, Zap, FileText, Sparkles, Brain, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface GrammarMasteryProps {
  onBack: () => void;
  devMode?: boolean;
}

type TabType = 'overview' | 'binyanim' | 'nouns' | 'morphemes' | 'pointing' | 'syntax' | 'ai-practice';

export function GrammarMastery({ onBack, devMode }: GrammarMasteryProps) {
  const [activeSection, setActiveSection] = useState<TabType>('overview');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // AI Practice State
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiTopic, setAiTopic] = useState<string>('Binyanim (Verb Patterns)');
  const [hasStartedAi, setHasStartedAi] = useState(false);

  const startAiPractice = async () => {
    if (isAiTyping) return;
    setIsAiTyping(true);
    setHasStartedAi(true);
    setChatHistory([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `You are an expert Biblical Hebrew Grammar Tutor.
The user wants to practice the topic: "${aiTopic}".
Your goal is to be an interactive tutor. Do NOT just give a lecture.
Start by giving the user a short exercise, question, or word to parse related to ${aiTopic}. Wait for their response.
Keep your messages relatively short, encouraging, and focused on helping them learn.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const text = response.text || "Hello! Let's practice Biblical Hebrew.";
      setChatHistory([{ role: 'model', content: text }]);
    } catch (e) {
      console.error(e);
      setChatHistory([{ role: 'model', content: "Sorry, I had trouble starting the session. Please try again." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const sendAiMessage = async () => {
    if (!currentMessage.trim() || isAiTyping) return;
    
    const userText = currentMessage;
    setCurrentMessage('');
    const newHistory = [...chatHistory, { role: 'user' as const, content: userText }];
    setChatHistory(newHistory);
    setIsAiTyping(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const contents = newHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      // Add system prompt context to the first message if needed, or rely on history.
      const promptCtx = `You are an expert Biblical Hebrew Grammar Tutor. The practice topic is "${aiTopic}". The user just replied. Evaluate their answer, explain any mistakes gently, and give them the next question/exercise. Keep it interactive.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          { role: 'user', parts: [{ text: promptCtx }] },
          { role: 'model', parts: [{ text: "Understood. I will act as the tutor." }] },
          ...contents
        ]
      });
      
      const text = response.text || "I'm not sure how to respond to that.";
      setChatHistory([...newHistory, { role: 'model', content: text }]);
    } catch (e) {
      console.error(e);
      setChatHistory([...newHistory, { role: 'model', content: "Sorry, something went wrong on my end." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const binyanimData = [
    { 
      id: 'paal', 
      name: 'Pa\'al (Qal)', 
      meaning: 'Simple Active', 
      example: 'כָּתַב (He wrote)', 
      desc: 'The most basic verb pattern. Denotes a simple action with no added intensive or causative nuance.',
      recognize: 'Vowels are typically pathach or qamets. No characteristic prefix in the perfect. Active participle: כּוֹתֵב. Passive participle: כָּתוּב.'
    },
    { 
      id: 'nifal', 
      name: 'Nif\'al', 
      meaning: 'Simple Passive / Reflexive', 
      example: 'נִכְתַּב (It was written)', 
      desc: 'The passive counterpart to Pa\'al. Can also express reflexive or reciprocal actions. Often denotes actions happening to the subject.',
      recognize: 'Characterized by a Nun (נ) prefix in the perfect and participle. In the imperfect, the Nun assimilates into the first root letter as a dagesh (e.g., יִכָּתֵב).'
    },
    { 
      id: 'piel', 
      name: 'Pi\'el', 
      meaning: 'Intensive Active', 
      example: 'שִׁבֵּר (He smashed/destroyed)', 
      desc: 'Expresses an intensive or repetitive action. Often used to make intransitive verbs transitive (e.g., "to learn" -> "to teach").',
      recognize: 'Characterized by a dagesh in the second root letter and specific vowel patterns (hiriq-sere in perfect, usually pathach-sere in imperfect).'
    },
    { 
      id: 'pual', 
      name: 'Pu\'al', 
      meaning: 'Intensive Passive', 
      example: 'שֻׁבַּר (It was smashed)', 
      desc: 'The passive counterpart to Pi\'el. Denotes intensive action being done to the subject.',
      recognize: 'Characterized by a dagesh in the second root letter and a qibbuts (u) or shureq (u) vowel in the first root letter.'
    },
    { 
      id: 'hifil', 
      name: 'Hif\'il', 
      meaning: 'Causative Active', 
      example: 'הִכְתִּיב (He caused someone to write)', 
      desc: 'Expresses bringing about an action or state (causing something to happen).',
      recognize: 'Characterized by a He (ה) prefix in the perfect and often a hiriq-yod (i) after the second root letter.'
    },
    { 
      id: 'hofal', 
      name: 'Hof\'al', 
      meaning: 'Causative Passive', 
      example: 'הָכְתַּב (It was caused to be written)', 
      desc: 'The passive counterpart to Hif\'il. Denotes that the subject was caused to be in a certain state.',
      recognize: 'Characterized by a He (ה) prefix and a qamets-hatuph (o) or qibbuts (u) vowel (e.g., הָקְטַל).'
    },
    { 
      id: 'hitpael', 
      name: 'Hitpa\'el', 
      meaning: 'Intensive Reflexive', 
      example: 'הִתְפַּלֵּל (He prayed)', 
      desc: 'Expresses reflexive or intensive action, often showing the subject acting upon themselves or for themselves.',
      recognize: 'Characterized by a הִתְ- (Hit-) prefix and a dagesh in the middle root letter.'
    },
  ];

  const weakVerbsData = [
    { title: "Pe-Nun (I-נ)", desc: "Verbs starting with Nun. The Nun often drops out (assimilates) when it has a silent sheva (e.g., נפל -> יִפֹּל)." },
    { title: "Pe-Aleph/Guttural (I-Guttural)", desc: "Verbs starting with א, ה, ח, ע. Gutturals cannot take dagesh and often prefer composite shevas (Hataf)." },
    { title: "Lamed-He (III-ה)", desc: "Verbs ending in He. The He is often replaced by Yod or Tav in certain inflections (e.g., בנה -> בָּנִיתִי)." },
    { title: "Ayin-Vav/Yod (II-ו/י)", desc: "Hollow verbs. The middle letter is a vowel, causing contraction (e.g., קום -> קָם)." },
    { title: "Geminate (Double)", desc: "Verbs with identical 2nd and 3rd root letters (e.g., סבב). Often they contract (סַב)." }
  ];

  const morphData = [
    {
      title: 'Noun Formation',
      content: 'Nouns are formed from roots, often with preformative letters like מ (often indicating location/instrument), א, or ת. They show Gender (Masculine/Feminine) and Number (Singular/Plural/Dual).'
    },
    {
      title: 'Adjectives',
      content: 'Adjectives must agree with the noun they modify in gender, number, and definiteness. Comparatives are formed using מִן (e.g., "better than") and superlatives often use the definite article or the construct state.'
    },
    {
       title: 'Numbers',
       content: 'Cardinal numbers (one, two...) have masculine and feminine forms. Ordinal numbers (1st, 2nd...) are adjectives.'
    },
    {
      title: 'Pronouns & Suffixes',
      content: 'Independent pronouns (I, You, He...) exist for the subject. Pronominal suffixes are attached to nouns (possession), verbs (object), and prepositions.'
    }
  ];

  const morphemeData = [
    {
      title: 'The Definite Article (Ha-)',
      content: 'Prefix הַ (Ha-). It usually causes a dagesh in the next letter. Gutturals (א, ה, ח, ע, ר) cause "compensatory lengthening" of the vowel to Qamets or Segol because they cannot take a dagesh.'
    },
    {
      title: 'Inseparable Prepositions',
      content: 'Prefixes בְּ (in), כְּ (as), לְ (to). If the noun is definite, the preposition takes the article\'s vowel and the He disappears (e.g., הַמֶּלֶךְ -> לַמֶּלֶךְ).'
    },
    {
      title: 'The Preposition "From" (Min)',
      content: 'Can appear as an independent word מִן or a prefix מִ-. The Nun usually assimilates into the following letter as a dagesh.'
    },
    {
      title: 'Vav Conjunctive & Consecutive',
      content: 'Vav Conjunctive וְ means "and". Vav Consecutive/Conversive (Wayyiqtol/Weqatal) flips the tense of the verb in narrative: Perfect becomes future-meaning, Imperfect becomes past-meaning.'
    },
    {
       title: 'Interrogative He',
       content: 'Prefix הֲ- (Ha-) used to turn a statement into a question. Usually pointed with Hataf-Pathach.'
    },
    {
       title: 'Locative He & Gentilic Yod',
       content: 'Locative He (הָ-) attached to the end of a noun indicates direction "to/towards". Gentilic Yod (י-) forms adjectives from names of places or people (e.g., "Israelite").'
    }
  ];

  const pointingData = [
    {
      title: 'Syllables & Vowels',
      content: 'Hebrew words are made of open syllables (Consonant + Vowel) and closed syllables (Consonant + Vowel + Consonant). Vowels are divided into Long (Qamets, Tsere), Short (Pathach, Hiriq, Segol), and Composite (Sheva, Hatafs).'
    },
    {
      title: 'Dagesh (The Dot)',
      content: 'Dagesh Lene (weak) appears in Begadkephat letters (בגּדכּפּת) when they start a syllable. Dagesh Forte (strong) indicates a doubled consonant.'
    },
    {
      title: 'Guttural Effects',
      content: 'Gutturals (א, ה, ח, ע) and Resh (ר) cannot be doubled with a dagesh. They prefer A-class vowels (Pathach) and often take Hataf (composite sheva) instead of simple vocal sheva.'
    }
  ];

  const syntaxData = [
    {
      title: 'Narrative Syntax',
      content: 'Standard Biblical prose often uses "Wayyiqtol" (Vav + Imperfect) for a sequence of past events. Subject-Verb order often puts the verb first.'
    },
    {
      title: 'Clauses types',
      content: 'Relative clauses (introduced by אֲשֶׁר), Conditional (if/then), Temporal (when), Purpose (in order that), and Result clauses appear frequently.'
    },
    {
       title: 'Other Clauses',
       content: 'Concessive, Causal, Asseverative (assertion), Negative (using לֹא or אַל), Oath, and Interrogative clauses are common structures to recognize.'
    },
    {
      title: 'Verbless Clauses (Nominal)',
      content: 'Sentences where the verb "to be" is implied (e.g., "The Lord [is] king") are common in Biblical Hebrew.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              BH Grammar
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-6">
        {/* Hero Card */}
        <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-600/20 mb-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                LATEST SPECIFICATION (v2023)
              </div>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Master the Ancient <br/> Language Patterns</h2>
            <p className="text-emerald-50 font-bold opacity-90 max-w-xl text-lg leading-relaxed">
              Every verb, noun, and syntax rule from the Edexcel Biblical Hebrew GCSE specification, decoded.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <button 
              onClick={() => setActiveSection('ai-practice')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-black transition-all hover:-translate-y-1 ${
                activeSection === 'ai-practice'
                  ? 'bg-slate-900 border-2 border-slate-700 text-white shadow-xl shadow-slate-900/20'
                  : 'bg-gradient-to-br from-slate-900 to-black text-white shadow-2xl shadow-slate-900/30 border border-slate-800 hover:shadow-indigo-500/20'
              }`}
            >
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span>AI Grammar Tutor</span>
            </button>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4">
            <Zap className="w-64 h-64 -rotate-12" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide px-1">
          {[
            { id: 'overview', label: 'Home', icon: <Book className="w-4 h-4" /> },
            { id: 'ai-practice', label: 'AI Tutor', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'binyanim', label: 'Verbs', icon: <Zap className="w-4 h-4" /> },
            { id: 'nouns', label: 'Nouns & Adj', icon: <Layers className="w-4 h-4" /> },
            { id: 'morphemes', label: 'Prefixes', icon: <SpellCheck className="w-4 h-4" /> },
            { id: 'pointing', label: 'Pointing', icon: <Info className="w-4 h-4" /> },
            { id: 'syntax', label: 'Syntax', icon: <FileText className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id as TabType);
                setSelectedTopic(null);
              }}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all border ${
                activeSection === tab.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 border-emerald-500 scale-105' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50 hover:text-emerald-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { title: 'The 7 Binyanim', desc: 'Understanding the core verb structures.', icon: <Zap className="text-amber-500" />, section: 'binyanim' },
                { title: 'Nouns & Adjectives', desc: 'Gender, number, and possession.', icon: <Layers className="text-blue-500" />, section: 'nouns' },
                { title: 'Prefixed Morphemes', desc: 'Articles, Vavs, and Prepositions.', icon: <SpellCheck className="text-emerald-500" />, section: 'morphemes' },
                { title: 'Syntactic Flow', desc: 'Sentence structure and clauses.', icon: <Info className="text-purple-500" />, section: 'syntax' }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveSection(item.section as TabType)}
                  className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-left hover:shadow-2xl hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">{item.desc}</p>
                </button>
              ))}
            </motion.div>
          )}

          {activeSection === 'binyanim' && (
            <motion.div 
              key="binyanim"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Verb Patterns (Binyanim)</h3>
                <div className="grid grid-cols-1 gap-4">
                  {binyanimData.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedTopic(selectedTopic === b.id ? null : b.id)}
                      className={`p-8 rounded-[2rem] border text-left transition-all ${
                        selectedTopic === b.id 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-lg' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 dark:text-white">{b.name}</h4>
                          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest">{b.meaning}</span>
                        </div>
                        <div className="text-3xl font-hebrew text-indigo-600 dark:text-indigo-400 font-black">{b.example.split(' ')[0]}</div>
                      </div>
                      {selectedTopic === b.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t border-emerald-500/20 space-y-4"
                        >
                          <div>
                            <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-widest">Core Function</h5>
                            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{b.desc}</p>
                          </div>
                          <div className="p-4 bg-emerald-600/5 dark:bg-emerald-400/5 rounded-2xl border border-emerald-500/20">
                            <h5 className="font-black text-emerald-900 dark:text-emerald-100 mb-2 uppercase text-[10px] tracking-widest flex items-center gap-2">
                              <Info className="w-3 h-3" /> Diagnostics (Identification)
                            </h5>
                            <p className="text-emerald-800 dark:text-emerald-200 font-bold text-sm">{b.recognize}</p>
                          </div>
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Weak Verb Classes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weakVerbsData.map((v, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                      <h4 className="font-black text-indigo-600 dark:text-indigo-400 mb-2 text-sm">{v.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'morphemes' && (
            <motion.div 
              key="morphemes"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6"
            >
              {morphemeData.map((rule, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{rule.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{rule.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'nouns' && (
            <motion.div 
              key="nouns"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid gap-6"
            >
              {morphData.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 underline decoration-emerald-500/30">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{item.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'pointing' && (
            <motion.div 
              key="pointing"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid gap-6"
            >
              {pointingData.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{item.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'syntax' && (
            <motion.div 
              key="syntax"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid gap-6"
            >
              {syntaxData.map((syntax, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{syntax.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{syntax.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'ai-practice' && (
            <motion.div 
              key="ai-practice"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white leading-none mb-1">AI Grammar Tutor</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Powered by Gemini</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Topic:</span>
                  <select 
                    value={aiTopic}
                    onChange={(e) => {
                      setAiTopic(e.target.value);
                      if (hasStartedAi) {
                        // Automatically restart session with new topic if already started
                        setHasStartedAi(false);
                      }
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Binyanim (Verb Patterns)">Binyanim (Verb Patterns)</option>
                    <option value="Weak Verbs">Weak Verbs</option>
                    <option value="Nouns & Adjectives">Nouns & Adjectives</option>
                    <option value="Prefixes & Suffixes">Prefixes & Suffixes</option>
                    <option value="Syntax & Clauses">Syntax & Clauses</option>
                    <option value="Parsing unknown words">Parsing unknown words</option>
                  </select>
                </div>
              </div>

              {!hasStartedAi ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                    <Brain className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Interactive Practice</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                    Select a topic and start an interactive session. The AI tutor will quiz you and help you learn.
                  </p>
                  <button 
                    onClick={startAiPractice}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1"
                  >
                    Start Practice Session
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                        }`}>
                          {msg.role === 'user' ? (
                            <p className="font-bold text-sm whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-sm dark:prose-invert font-bold">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); sendAiMessage(); }}
                      className="flex items-center gap-2"
                    >
                      <input 
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white outline-none"
                        disabled={isAiTyping}
                      />
                      <button 
                        type="submit"
                        disabled={!currentMessage.trim() || isAiTyping}
                        className="p-3 bg-indigo-600 text-white rounded-xl disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
