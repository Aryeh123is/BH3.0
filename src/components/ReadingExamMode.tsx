import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Send, Sparkles, AlertCircle, CheckCircle2, ChevronRight, FileText, Lock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface ReadingExamModeProps {
  language: string;
  onBack: () => void;
}

const PAPERS = {
  higher: {
    title: 'Paper 3: Reading (Higher Tier) - 2024 SAMs',
    url: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2024/specification-and-sample-assessments/3-collated-gcse-spanish-sams-paper-3-higher.pdf',
    totalMarks: 50
  },
  foundation: {
    title: 'Paper 3: Reading (Foundation Tier) - 2024 SAMs',
    url: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Spanish/2024/specification-and-sample-assessments/5-collated-gcse-spanish-sams-paper-3-foundation.pdf',
    totalMarks: 50
  }
};

export function ReadingExamMode({ language, onBack }: ReadingExamModeProps) {
  const [tier, setTier] = useState<'higher' | 'foundation' | null>(null);
  const [answers, setAnswers] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!answers.trim() || !tier) return;
    setIsSubmitting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

      const prompt = `
        You are an official GCSE Spanish Examiner for Pearson Edexcel.
        The student has completed the ${PAPERS[tier].title}.
        
        PDF URL for questions and mark scheme (hidden from student): ${PAPERS[tier].url}
        
        Student Answers:
        "${answers}"
        
        Task:
        1. Using the mark scheme at the end of the PDF at that URL, grade the student's answers.
        2. Provide a score out of ${PAPERS[tier].totalMarks}.
        3. Give detailed feedback for each section, explaining why marks were awarded or lost.
        4. Be strict but fair, following the official Edexcel marking criteria.
        
        Return your response in Markdown format. Start with a header "Exam Results" and then "Total Score: X/${PAPERS[tier].totalMarks}".
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const text = response.text || "";
      
      setFeedback(text);
      
      // Try to extract score
      const scoreMatch = text.match(/Total Score:\s*(\d+)/i);
      if (scoreMatch) setScore(parseInt(scoreMatch[1]));
      
    } catch (error) {
      console.error("Error grading:", error);
      alert("There was an error grading your exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tier) {
    return (
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Simulator</span>
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Spanish Reading Exam</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Select your tier to begin the simulated past paper practice.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button 
            onClick={() => setTier('foundation')}
            className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">Grades 1-5</span>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Foundation Tier</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
              Perfect for securing your pass. Includes targeted questions on core topics with clear instructions.
            </p>
          </button>

          <button 
            onClick={() => setTier('higher')}
            className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest">Grades 4-9</span>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Higher Tier</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
              Challenge yourself with complex texts and literary passages. Required for top grades (7-9).
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-black overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setTier(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 dark:text-white" />
          </button>
          <div>
            <h2 className="font-black text-slate-900 dark:text-white leading-none mb-1">{PAPERS[tier].title}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Restricted Practice</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-3 h-3" />
            AI EXAMINER ACTIVE
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !answers.trim() || !!feedback}
            className={`px-6 py-2 rounded-xl font-black transition-all flex items-center gap-2 ${
              isSubmitting || !answers.trim() || !!feedback
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {feedback ? 'GRADED' : 'SUBMIT EXAM'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 relative border-r border-slate-200 dark:border-slate-800">
          <iframe 
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(PAPERS[tier].url)}&embedded=true`}
            className="w-full h-full border-none"
            title="Exam Paper"
          />
        </div>

        {/* Answer Panel */}
        <div className="w-[400px] bg-white dark:bg-slate-900 flex flex-col shadow-2xl relative z-10 overflow-y-auto">
          {feedback ? (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">AI Grade Report</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marked against official criteria</p>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-[2rem] p-8 text-center text-white mb-8 shadow-xl shadow-indigo-600/20">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total Result</p>
                <div className="text-5xl font-black mb-2">{score !== null ? score : '?'}<span className="text-xl opacity-60">/{PAPERS[tier].totalMarks}</span></div>
                <div className="px-4 py-1.5 bg-white/20 rounded-full inline-block text-[10px] font-black uppercase tracking-widest">
                  {score !== null && score >= PAPERS[tier].totalMarks * 0.8 ? 'Grade 9 Equivalent' : score !== null && score >= PAPERS[tier].totalMarks * 0.7 ? 'Grade 7-8 Equivalent' : 'Pass Secured'}
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-bold text-sm">
                <Markdown>{feedback}</Markdown>
              </div>

              <button 
                onClick={() => {
                  setFeedback(null);
                  setScore(null);
                  setAnswers('');
                }}
                className="w-full mt-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-sans"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="p-8 flex flex-col h-full font-sans">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white">Digital Answer Booklet</h3>
              </div>
              
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-500 shrink-0" />
                <p className="text-xs text-indigo-800 dark:text-indigo-400 font-bold leading-relaxed">
                  Scroll the paper on the left. Type your answers here. Use question numbers (e.g., Q1, 2a) so the AI can mark accurately.
                </p>
              </div>

              <textarea 
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                placeholder="TYPE ANSWERS HERE:&#10;Q1: Higher&#10;Q2: A, C, E&#10;Q3: Students study more effectively..."
                className="flex-1 w-full p-6 bg-slate-50 dark:bg-slate-950 border-none rounded-[2rem] text-sm font-bold resize-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-slate-400"
              />

              <div className="mt-6 flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
                <Target className="w-3 h-3" />
                AI Grading Ready
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
