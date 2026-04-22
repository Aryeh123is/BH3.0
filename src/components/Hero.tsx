import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, LogIn, Trophy, Zap, Brain, TrendingUp, CheckCircle2, PlayCircle, Volume2, Target, BarChart3, Snowflake, Book } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeroProps {
  onStartSession: () => void;
  onViewDashboard: () => void;
  onStartFlashcards: (topic?: string | any) => void;
  onStartTest: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  user: User | null;
  onSignIn: () => void;
  onShowPro: () => void;
  devMode?: boolean;
  isPremium?: boolean;
  reducedMotion?: boolean;
}

export function Hero({ onStartSession, onViewDashboard, onStartFlashcards, onStartTest, language, onLanguageChange, user, onSignIn, onShowPro, devMode = false, isPremium = false, reducedMotion = false }: HeroProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const previewCards: Record<string, { front: string, back: string, label: string }> = {
    french: { front: 'le moyen orient', back: 'the Middle East', label: 'French' },
    spanish: { front: 'el medio ambiente', back: 'the environment', label: 'Spanish' },
    biblical: { front: 'מֶלֶךְ', back: 'king', label: 'Biblical Hebrew' },
    modern: { front: 'שָׁלוֹם', back: 'peace / hello', label: 'Modern Hebrew' },
    default: { front: 'Example', back: 'Translation', label: 'Custom' }
  };

  const currentPreview = previewCards[language] || previewCards.default;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="pt-24 sm:pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {(language === 'spanish' || language === 'french') && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold mb-8 border border-indigo-100 dark:border-indigo-800/50">
                <Sparkles className="w-4 h-4" />
                <span>New: {language === 'spanish' ? 'Spanish' : 'French'} GCSE Vocabulary Added!</span>
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1] max-w-4xl">
              Master {(language === 'spanish' || language === 'french') ? 'GCSE' : currentPreview.label} Vocabulary with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap">Vocariox</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
              The fastest way to memorise vocabulary for {(language === 'spanish' || language === 'french') ? 'GCSEs' : 'exams'} and real life. Powered by AI Smart-SRS technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8">
              <button 
                onClick={onStartFlashcards}
                className={`w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all ${!reducedMotion ? 'hover:scale-105 active:scale-95 animate-bounce-subtle' : ''} shadow-xl shadow-indigo-600/20 text-lg flex items-center justify-center gap-2 group`}
              >
                <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                START LEARNING NOW
              </button>
              {(language === 'spanish' || language === 'french') && (
                <button 
                  onClick={() => {
                    document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
                >
                  <Layers className="w-5 h-5" />
                  Browse Topics
                </button>
              )}
            </div>

            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-16 flex items-center gap-2 justify-center">
              <Trophy className="w-4 h-4 text-amber-500" />
              Trusted by thousands of students across the country
            </p>

            {/* INTERACTIVE FLASHCARD PREVIEW */}
            <div className="w-full max-w-md mx-auto perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest flex items-center justify-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Tap to flip
              </div>
              <motion.div 
                className="relative w-full aspect-[4/3] preserve-3d transition-transform duration-500 ease-out shadow-2xl rounded-[2.5rem]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8">
                  <span className="text-sm font-bold text-indigo-500 mb-4 uppercase tracking-widest">{currentPreview.label}</span>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white text-center">{currentPreview.front}</h3>
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-white" style={{ transform: 'rotateY(180deg)' }}>
                  <span className="text-sm font-bold text-indigo-200 mb-4 uppercase tracking-widest">English</span>
                  <h3 className="text-4xl md:text-5xl font-black text-center">{currentPreview.back}</h3>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOPICS SECTION (For Spanish, French & Modern Hebrew) */}
      {(language === 'spanish' || language === 'french' || language === 'modern') && (
        <section id="topics-section" className="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Choose a Topic</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Start learning instantly. No account needed.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {language === 'modern' ? (
                // Modern Hebrew Topics
                [
                  { title: 'Personal', icon: '👤', color: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                  { title: 'Education', icon: '🎓', color: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
                  { title: 'Social', icon: '🤝', color: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
                  { title: 'Travel', icon: '✈️', color: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
                ].map((topic, i) => (
                  <button 
                    key={`modern-${i}`}
                    onClick={() => onStartFlashcards(topic.title)}
                    className="group p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg hover:-translate-y-1 text-left flex flex-col gap-4"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${topic.color}`}>
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Start learning →</p>
                    </div>
                  </button>
                ))
              ) : (
                // Spanish & French Topics
                [
                  { title: 'Family & Friends', icon: '👨‍👩‍👧‍👦', color: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                  { title: 'School & Study', icon: '🏫', color: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
                  { title: 'Food & Drink', icon: '🥘', color: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
                  { title: 'Holidays & Travel', icon: '✈️', color: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
                ].map((topic, i) => (
                  <button 
                    key={`lang-${i}`}
                    onClick={() => onStartFlashcards(topic.title)}
                    className="group p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg hover:-translate-y-1 text-left flex flex-col gap-4"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${topic.color}`}>
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Start learning →</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* CREDIBILITY & HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8">Built for GCSE Success</h2>
            <div className="space-y-6">
              {[
                { icon: <Book className="w-6 h-6" />, title: 'Based on official specifications', desc: 'Vocabulary lists perfectly aligned with AQA and Edexcel.' },
                { icon: <Brain className="w-6 h-6" />, title: 'Learn faster with repetition', desc: 'Our smart algorithm ensures you remember words long-term.' },
                { icon: <Target className="w-6 h-6" />, title: 'Designed for exam prep', desc: 'Focus on the high-frequency words that actually appear in exams.' },
              ].map((item, i) => (
                <div key={`hero-feature-${i}`} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">How it works</h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              {[
                { step: '1', title: 'Pick a topic', desc: 'Choose from exam-specific categories.' },
                { step: '2', title: 'Start learning instantly', desc: 'Flip cards and test your memory.' },
                { step: '3', title: 'Improve every day', desc: 'Build a streak and track your progress.' },
              ].map((item, i) => (
                <div key={`how-it-works-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-600 text-white font-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM TEASER */}
      <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Go further with Premium</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Unlock the ultimate toolkit to guarantee your target grade.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Volume2 className="w-5 h-5" />, text: `Audio pronunciation${(language === 'spanish' || language === 'french') ? ` (${language === 'spanish' ? 'Spanish' : 'French'})` : ''}` },
                { icon: <Brain className="w-5 h-5" />, text: 'Smart spaced repetition' },
                { icon: <Trophy className="w-5 h-5" />, text: 'Test mode (type answers)' },
                { icon: <Target className="w-5 h-5" />, text: 'Weak words tracking' },
                { icon: <BarChart3 className="w-5 h-5" />, text: 'Advanced progress insights' },
                { icon: <Snowflake className="w-5 h-5" />, text: 'Streak freezes' },
              ].map((feature, i) => (
                <div key={`premium-feature-${i}`} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-indigo-400">{feature.icon}</div>
                  <span className="font-medium text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] border border-indigo-400/30 text-center relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
              <div className="inline-block px-4 py-1.5 bg-red-500 text-white font-black text-sm rounded-full mb-6 shadow-lg shadow-red-500/20 animate-pulse uppercase tracking-widest">
                50% Pre-Launch Discount
              </div>
              <div className="mb-2">
                <span className="text-xl text-indigo-200 line-through mr-2 font-bold opacity-70">£9.99/yr</span>
              </div>
              <div className="flex justify-between items-end gap-2 mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-black text-white drop-shadow-md">£4.99</span>
                  <span className="text-white/80 font-bold mb-2">/year</span>
                </div>
                <div className="text-right pb-1">
                  <span className="text-indigo-200 text-sm font-bold block">or <span className="line-through opacity-70 font-normal">£3.99</span></span>
                  <span className="text-white font-bold block">£1.99/mo</span>
                </div>
              </div>
              <p className="text-indigo-100 mb-8 font-medium">Register interest now to claim your 50% early bird discount.</p>
              <button 
                onClick={onShowPro}
                className="w-full py-4 bg-white text-indigo-600 hover:bg-slate-50 font-black rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20 text-lg shadow-lg"
              >
                Claim My Discount
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
            Start learning in seconds.
          </h2>
          <button 
            onClick={onStartFlashcards}
            className={`px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all ${!reducedMotion ? 'hover:scale-105 active:scale-95 animate-bounce-subtle' : ''} shadow-2xl shadow-indigo-600/30 text-xl flex items-center justify-center gap-3 mx-auto group`}
          >
            <Zap className="w-6 h-6 fill-current group-hover:animate-pulse" />
            START LEARNING NOW
          </button>
        </div>
      </section>
    </div>
  );
}
