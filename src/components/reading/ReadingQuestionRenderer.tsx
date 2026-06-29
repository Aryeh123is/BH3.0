import React from 'react';
import { ReadingQuestion } from '../../types/reading';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ReadingQuestionRendererProps {
  question: ReadingQuestion;
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
}

export const ReadingQuestionRenderer: React.FC<ReadingQuestionRendererProps> = ({
  question,
  answers,
  onChange,
  disabled
}) => {
  const containerClass = "p-10 bg-white dark:bg-slate-900 border-b-4 border-slate-100 dark:border-slate-800 last:border-b-0";

  const renderSingleInput = (q: ReadingQuestion, val: string, onUpdate: (v: string) => void) => {
    switch (q.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2 mt-4">
            {q.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onUpdate(option)}
                className={`w-full text-left p-4 rounded border-2 flex items-center justify-between transition-all ${
                  val === option 
                    ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded border-2 border-slate-900 dark:border-white text-[10px] font-black italic">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold text-sm">{option}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${val === option ? 'border-slate-900 bg-slate-900 dark:border-white dark:bg-white' : 'border-slate-200'}`}>
                   {val === option && <div className="w-1.5 h-1.5 bg-white dark:bg-slate-900 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multi_select':
        const selected = val ? val.split('||') : [];
        return (
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {q.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => {
                  const newSelected = selected.includes(option) 
                    ? selected.filter(o => o !== option)
                    : [...selected, option];
                  onUpdate(newSelected.join('||'));
                }}
                className={`text-left p-4 rounded border-2 flex items-center gap-3 transition-all ${
                  selected.includes(option)
                    ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected.includes(option) ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white' : 'border-slate-300'}`}>
                  {selected.includes(option) && <div className="w-2 h-2 bg-white dark:bg-slate-900" />}
                </div>
                <span className="font-bold text-sm">{option}</span>
              </button>
            ))}
          </div>
        );

      case 'short_answer':
      case 'gap_fill':
        return (
          <input
            type="text"
            disabled={disabled}
            value={val}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Type your answer in English..."
            className="w-full mt-4 p-4 border-b-2 border-slate-900 dark:border-white bg-transparent focus:bg-slate-50 dark:focus:bg-slate-800/20 outline-none font-bold italic text-slate-900 dark:text-white"
          />
        );

      case 'translation_passage':
        return (
          <textarea
            disabled={disabled}
            value={val}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Translate the passage into English..."
            rows={6}
            className="w-full mt-6 p-6 border-2 border-slate-900 dark:border-white bg-transparent focus:bg-slate-50 dark:focus:bg-slate-800/20 outline-none font-bold italic leading-relaxed resize-none text-slate-900 dark:text-white"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black">QUESTION {question.id.toUpperCase()}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{question.type.replace('_', ' ')}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
            {question.prompt}
          </h3>
        </div>
        
        <div className="shrink-0 space-y-1">
          <div className="w-14 h-14 border-4 border-slate-900 dark:border-white flex items-center justify-center text-xl font-black">
            {question.marks}
          </div>
          <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-tighter">MARKS</p>
        </div>
      </div>

      {question.context && (
        <div className="mb-8 p-8 bg-slate-50 dark:bg-slate-800/50 border-l-8 border-slate-200 dark:border-slate-700 font-serif italic text-lg text-slate-800 dark:text-slate-200 leading-relaxed shadow-inner">
           {question.context}
        </div>
      )}

      {question.type === 'word_bank' && (
        <div className="mb-8 p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg flex flex-wrap gap-2 justify-center">
          {question.options?.map((opt, i) => (
             <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded font-black text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">{opt}</span>
          ))}
        </div>
      )}

      <div className="space-y-10">
        {question.subQuestions && question.subQuestions.length > 0 ? (
          question.subQuestions.map((subQ, idx) => (
            <div key={subQ.id} className="space-y-3">
              <div className="flex gap-4 items-center">
                <span className="text-lg font-black italic text-slate-900 dark:text-white">({String.fromCharCode(97 + idx)})</span>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{subQ.prompt}</p>
              </div>
              <div className="pl-8">
                {renderSingleInput(subQ, answers[subQ.id] || '', (v) => onChange(subQ.id, v))}
              </div>
            </div>
          ))
        ) : (
          renderSingleInput(question, answers[question.id] || '', (v) => onChange(question.id, v))
        )}
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          <span>End of Question {question.id.toUpperCase()}</span>
      </div>
    </div>
  );
};
