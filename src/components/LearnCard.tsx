import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Word } from '../types';
import { Check, X, ArrowRight } from 'lucide-react';
import { getForeignWord } from '../lib/utils';

interface LearnCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  language?: 'biblical' | 'modern' | 'spanish' | 'french';
}

export function LearnCard({ question, onAnswer, language = 'biblical' }: LearnCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setWrittenAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [question]);

  const getFontSize = (text: string) => {
    if (!text) return 'text-6xl md:text-7xl';
    const len = text.length;
    if (len < 12) return 'text-6xl md:text-7xl';
    if (len < 25) return 'text-4xl md:text-5xl';
    if (len < 40) return 'text-3xl md:text-4xl';
    return 'text-2xl md:text-3xl';
  };

  const isPhoneticallySimilar = (input: string, target: string) => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s1 = normalize(input);
    const s2 = normalize(target);

    if (s1 === s2) return true;

    // Simple Levenshtein-like check for small typos (max 1-2 chars depending on length)
    if (Math.abs(s1.length - s2.length) > 2) return false;

    let edits = 0;
    let i = 0;
    let j = 0;

    while (i < s1.length && j < s2.length) {
      if (s1[i] !== s2[j]) {
        edits++;
        if (s1.length > s2.length) i++;
        else if (s2.length > s1.length) j++;
        else { i++; j++; }
      } else {
        i++;
        j++;
      }
    }
    edits += (s1.length - i) + (s2.length - j);

    // Allow 1 edit for short words, 2 for longer ones
    const threshold = s2.length <= 4 ? 1 : 2;
    return edits <= threshold;
  };

  const handleSubmit = (answer: string) => {
    if (isSubmitted) return;

    const correct = isPhoneticallySimilar(answer, question.correctAnswer);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      onAnswer(isCorrect);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.word.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 p-8 md:p-16"
        >
          <div className="mb-12 text-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4 block">
              {question.type === 'multiple-choice' ? 'Choose the correct meaning' : 'Type the meaning'}
            </span>
            <h2 className={`font-bold text-slate-900 dark:text-white mb-6 ${getFontSize(getForeignWord(question.word, language))}`} dir={language === 'spanish' || language === 'french' ? 'ltr' : 'rtl'}>
              {getForeignWord(question.word, language)}
            </h2>
            {isSubmitted && question.word.transliteration && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 dark:text-slate-500 font-medium text-lg italic"
              >
                {question.word.transliteration}
              </motion.p>
            )}
          </div>

          <div className="space-y-4">
            {question.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 gap-4">
                {question.options?.map((option, idx) => {
                  const isThisCorrect = option === question.correctAnswer;
                  const isThisSelected = selectedOption === option;

                  let buttonClass = "w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 flex justify-between items-center ";
                  if (!isSubmitted) {
                    buttonClass += isThisSelected 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-900 dark:text-white";
                  } else {
                    if (isThisCorrect) buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                    else if (isThisSelected) buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                    else buttonClass += "border-slate-50 dark:border-slate-800 opacity-50 text-slate-900 dark:text-white";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isSubmitted && setSelectedOption(option)}
                      disabled={isSubmitted}
                      className={buttonClass}
                    >
                      <span className="font-bold text-lg">{option}</span>
                      {isSubmitted && isThisCorrect && <Check className="w-6 h-6 text-green-600 dark:text-green-400" />}
                      {isSubmitted && isThisSelected && !isThisCorrect && <X className="w-6 h-6 text-red-600 dark:text-red-400" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <input
                  type="text"
                  value={writtenAnswer}
                  onChange={(e) => setWrittenAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && writtenAnswer && handleSubmit(writtenAnswer)}
                  placeholder="Type the English meaning..."
                  disabled={isSubmitted}
                  className={`w-full p-6 text-xl font-bold rounded-2xl border-2 outline-none transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-8 focus:ring-primary/5"
                  }`}
                  autoFocus
                />
                {isSubmitted && !isCorrect && (
                  <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                    <p className="text-xs text-primary font-bold uppercase mb-2 tracking-widest">Correct Answer:</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{question.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={() => (question.type === 'multiple-choice' ? selectedOption && handleSubmit(selectedOption) : writtenAnswer && handleSubmit(writtenAnswer))}
                disabled={question.type === 'multiple-choice' ? !selectedOption : !writtenAnswer}
                className="px-10 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-bold hover:bg-black dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 dark:shadow-none"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
