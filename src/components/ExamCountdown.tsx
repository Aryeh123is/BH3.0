import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  Clock, 
  AlertTriangle,
  Lock
} from 'lucide-react';

export interface SavedExam {
  id: string;
  subject: string;
  examBoard: string;
  paperName: string;
  date: string; // ISO string format 'YYYY-MM-DDTHH:mm:ss'
  isCustom?: boolean;
}

export interface SavedCountdownSettings {
  selectedExamIds: string[];
  customExams: SavedExam[];
}

interface ExamCountdownProps {
  onBack: () => void;
  user: any; // User object from Firebase
  countdownSettings: SavedCountdownSettings;
  onUpdateCountdownSettings: (settings: SavedCountdownSettings) => void;
  currentLanguage?: string;
}

// Full pre-populated database for GCSE 2026 Spanish, French, German, Arabic, Modern Hebrew, Biblical Hebrew (Languages) 
// and core British GCSE subjects to make the revision tool cohesive.
export const PREDEFINED_EXAMS: SavedExam[] = [
  // --- FRENCH ---
  { id: 'french_aqa_p1_3', subject: 'French', examBoard: 'AQA', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-11T09:00:00' },
  { id: 'french_aqa_p4', subject: 'French', examBoard: 'AQA', paperName: 'Writing (Paper 4)', date: '2026-05-15T13:30:00' },
  { id: 'french_edexcel_p1_3', subject: 'French', examBoard: 'Edexcel', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-11T09:00:00' },
  { id: 'french_edexcel_p4', subject: 'French', examBoard: 'Edexcel', paperName: 'Writing (Paper 4)', date: '2026-05-15T13:30:00' },

  // --- SPANISH ---
  { id: 'spanish_aqa_p1_3', subject: 'Spanish', examBoard: 'AQA', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-18T09:00:00' },
  { id: 'spanish_aqa_p4', subject: 'Spanish', examBoard: 'AQA', paperName: 'Writing (Paper 4)', date: '2026-05-22T13:30:00' },
  { id: 'spanish_edexcel_p1_3', subject: 'Spanish', examBoard: 'Edexcel', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-18T09:00:00' },
  { id: 'spanish_edexcel_p4', subject: 'Spanish', examBoard: 'Edexcel', paperName: 'Writing (Paper 4)', date: '2026-05-22T13:30:00' },

  // --- GERMAN ---
  { id: 'german_aqa_p1_3', subject: 'German', examBoard: 'AQA', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-14T09:00:00' },
  { id: 'german_aqa_p4', subject: 'German', examBoard: 'AQA', paperName: 'Writing (Paper 4)', date: '2026-05-19T13:30:00' },
  { id: 'german_edexcel_p1_3', subject: 'German', examBoard: 'Edexcel', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-05-14T09:00:00' },
  { id: 'german_edexcel_p4', subject: 'German', examBoard: 'Edexcel', paperName: 'Writing (Paper 4)', date: '2026-05-19T13:30:00' },

  // --- ARABIC ---
  { id: 'arabic_edexcel_p1_3', subject: 'Arabic', examBoard: 'Edexcel', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-06-01T09:00:00' },
  { id: 'arabic_edexcel_p4', subject: 'Arabic', examBoard: 'Edexcel', paperName: 'Writing (Paper 4)', date: '2026-06-05T13:30:00' },

  // --- MODERN HEBREW ---
  { id: 'mhebrew_aqa_p1_3', subject: 'Modern Hebrew', examBoard: 'AQA', paperName: 'Listening & Reading (Paper 1 & 3)', date: '2026-06-08T09:00:00' },
  { id: 'mhebrew_aqa_p4', subject: 'Modern Hebrew', examBoard: 'AQA', paperName: 'Writing (Paper 4)', date: '2026-06-12T13:30:00' },

  // --- BIBLICAL HEBREW ---
  { id: 'bhebrew_edexcel_p1', subject: 'Biblical Hebrew', examBoard: 'Edexcel', paperName: 'Language (Paper 1)', date: '2026-06-15T09:00:00' },
  { id: 'bhebrew_edexcel_p2', subject: 'Biblical Hebrew', examBoard: 'Edexcel', paperName: 'Literature (Paper 2)', date: '2026-06-22T09:00:00' },

  // --- CORE SUBJECTS ---
  { id: 'math_aqa_p1', subject: 'Mathematics', examBoard: 'AQA', paperName: 'Non-Calculator (Paper 1)', date: '2026-05-12T09:00:00' },
  { id: 'math_aqa_p2', subject: 'Mathematics', examBoard: 'AQA', paperName: 'Calculator (Paper 2)', date: '2026-06-04T09:00:00' },
  { id: 'math_aqa_p3', subject: 'Mathematics', examBoard: 'AQA', paperName: 'Calculator (Paper 3)', date: '2026-06-11T09:00:00' },

  { id: 'english_lang_aqa_p1', subject: 'English Language', examBoard: 'AQA', paperName: 'Paper 1: Creative Reading & Writing', date: '2026-05-13T09:00:00' },
  { id: 'english_lang_aqa_p2', subject: 'English Language', examBoard: 'AQA', paperName: 'Paper 2: Writers\' Viewpoints & Perspectives', date: '2026-06-05T09:00:00' },

  { id: 'english_lit_aqa_p1', subject: 'English Literature', examBoard: 'AQA', paperName: 'Paper 1: Shakespeare & 19th-Century Novel', date: '2026-05-08T09:00:00' },
  { id: 'english_lit_aqa_p2', subject: 'English Literature', examBoard: 'AQA', paperName: 'Paper 2: Modern Texts & Poetry', date: '2026-05-20T09:00:00' },

  { id: 'biology_aqa_p1', subject: 'Biology', examBoard: 'AQA', paperName: 'Paper 1 (Standard/Triple)', date: '2026-05-12T13:30:00' },
  { id: 'chemistry_aqa_p1', subject: 'Chemistry', examBoard: 'AQA', paperName: 'Paper 1 (Standard/Triple)', date: '2026-05-15T13:30:00' },
  { id: 'physics_aqa_p1', subject: 'Physics', examBoard: 'AQA', paperName: 'Paper 1 (Standard/Triple)', date: '2026-05-19T13:30:00' }
];

export function ExamCountdown({
  onBack,
  user,
  countdownSettings,
  onUpdateCountdownSettings,
  currentLanguage = 'french'
}: ExamCountdownProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 flex flex-col justify-center items-center">
      {/* Back button */}
      <div className="w-full max-w-2xl flex justify-start mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main locked screen container */}
      <div className="w-full max-w-2xl flex flex-col items-center justify-center p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>

        {/* Lock / Clock icon badge */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl flex items-center justify-center border border-indigo-200/10 dark:border-indigo-800/20 shadow-lg shadow-indigo-500/5 animate-bounce" style={{ animationDuration: '4s' }}>
            <Clock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900 shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase">
          GCSE Countdown Locked
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed mb-6 max-w-lg">
          We are waiting for the 2027 GCSE exam dates to be released.
        </p>

        {/* Informative message */}
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-md">
          Official exam timetables are traditionally compiled and shared by AQA and Pearson Edexcel later in the academic cycle. This interactive countdown module will unlock automatically once schedules for the 2027 season are finalised.
        </p>

        {/* Badge status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/20 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-8 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
          Inaccessible — Awaiting 2027 Specs
        </div>

        {/* Action Button */}
        <button
          onClick={onBack}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
