import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Word } from '../types';
import { Check, X, ArrowRight } from 'lucide-react';

interface LearnCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export function LearnCard({ question, onAnswer }: LearnCardProps) {
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

  const handleSubmit = (answer: string) => {
    if (isSubmitted) return;

    const correct = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
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
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          <div className="mb-8 text-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">
              {question.type === 'multiple-choice' ? 'Choose the correct meaning' : 'Type the meaning'}
            </span>
            <h2 className="text-6xl font-serif font-bold text-gray-900 mb-4" dir="rtl">
              {question.word.hebrew}
            </h2>
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 font-mono text-sm italic"
              >
                {question.word.transliteration}
              </motion.p>
            )}
          </div>

          <div className="space-y-4">
            {question.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 gap-3">
                {question.options?.map((option, idx) => {
                  const isThisCorrect = option === question.correctAnswer;
                  const isThisSelected = selectedOption === option;

                  let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
                  if (!isSubmitted) {
                    buttonClass += isThisSelected ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-blue-200 hover:bg-gray-50";
                  } else {
                    if (isThisCorrect) buttonClass += "border-green-500 bg-green-50 text-green-700";
                    else if (isThisSelected) buttonClass += "border-red-500 bg-red-50 text-red-700";
                    else buttonClass += "border-gray-100 opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isSubmitted && setSelectedOption(option)}
                      disabled={isSubmitted}
                      className={buttonClass}
                    >
                      <span className="font-medium">{option}</span>
                      {isSubmitted && isThisCorrect && <Check className="w-5 h-5 text-green-600" />}
                      {isSubmitted && isThisSelected && !isThisCorrect && <X className="w-5 h-5 text-red-600" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={writtenAnswer}
                  onChange={(e) => setWrittenAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && writtenAnswer && handleSubmit(writtenAnswer)}
                  placeholder="Type the English meaning..."
                  disabled={isSubmitted}
                  className={`w-full p-4 text-lg rounded-xl border-2 outline-none transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  autoFocus
                />
                {isSubmitted && !isCorrect && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Correct Answer:</p>
                    <p className="text-lg font-medium text-blue-900">{question.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={() => (question.type === 'multiple-choice' ? selectedOption && handleSubmit(selectedOption) : writtenAnswer && handleSubmit(writtenAnswer))}
                disabled={question.type === 'multiple-choice' ? !selectedOption : !writtenAnswer}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black flex items-center gap-2 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
