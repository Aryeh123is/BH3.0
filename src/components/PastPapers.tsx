import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, CheckCircle2, ChevronDown, Check, TrendingUp, Info, Upload, FileText, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PastPapersProps {
  language: string;
  onBack: () => void;
  onViewPdf: (url: string, title: string) => void;
}

interface PaperRecord {
  id: string; // e.g., '2023-p1'
  year: string;
  paperName: string;
  paperUrl?: string;
  markSchemeUrl?: string;
  score?: string; 
  grade?: string; 
  tier?: 'F' | 'H'; // F for Foundation, H for Higher
  status: 'todo' | 'in-progress' | 'completed';
}

// Official AQA Grade Boundaries for Modern Hebrew (8678)
// Note: These are simplified per-paper estimates derived from total grade boundaries
const GRADE_BOUNDARIES: Record<string, any> = {
  'modern': {
    '2023': {
      'H': { '9': 46, '8': 40, '7': 35, '6': 30, '5': 25, '4': 21, '3': 16 },
      'F': { '5': 38, '4': 33, '3': 26, '2': 19, '1': 12 }
    },
    '2022': {
      'H': { '9': 44, '8': 38, '7': 33, '6': 28, '5': 23, '4': 19, '3': 14 },
      'F': { '5': 36, '4': 31, '3': 24, '2': 17, '1': 10 }
    },
    '2021': {
      'H': { '9': 45, '8': 39, '7': 34, '6': 29, '5': 24, '4': 20, '3': 15 },
      'F': { '5': 37, '4': 32, '3': 25, '2': 18, '1': 11 }
    },
    '2019': {
      'H': { '9': 47, '8': 41, '7': 36, '6': 31, '5': 26, '4': 22, '3': 17 },
      'F': { '5': 39, '4': 34, '3': 27, '2': 20, '1': 13 }
    }
  }
};

const calculateGrade = (scoreStr: string, year: string, language: string, tier: 'F' | 'H'): string => {
  const score = parseInt(scoreStr.split('/')[0]);
  if (isNaN(score)) return '';

  // Get specification-specific boundaries
  const specBoundaries = GRADE_BOUNDARIES[language === 'biblical' ? 'biblical' : 'modern'];
  let boundaries = specBoundaries?.[year]?.[tier];

  // Fallback to average boundaries if specific year/paper data isn't hardcoded
  if (!boundaries) {
    if (tier === 'H') {
      // Standard AQA Higher Paper Boundaries (out of 60)
      boundaries = { '9': 46, '8': 40, '7': 35, '6': 30, '5': 25, '4': 21, '3': 16 };
    } else {
      // Standard AQA Foundation Paper Boundaries (out of 50 or pro-rata)
      boundaries = { '5': 38, '4': 33, '3': 26, '2': 19, '1': 12 };
    }
  }

  // Find the highest grade achieved
  const grades = Object.keys(boundaries).sort((a, b) => b.localeCompare(a));
  for (const grade of grades) {
    if (score >= boundaries[grade]) return grade;
  }

  return tier === 'H' ? 'U' : 'U';
};

interface LanguageSpec {
  board: 'AQA' | 'Edexcel';
  specification: string;
  startYear: number;
  papers: { id: string; name: string; type: string }[];
  directLinks: Record<string, { qp: string; ms: string }>;
}

const LANGUAGE_SPECS: Record<string, LanguageSpec> = {
  modern: {
    board: 'AQA',
    specification: 'GCSE Modern Hebrew (8678)',
    startYear: 2019,
    papers: [
      { id: 'p1', name: 'Paper 1: Listening', type: 'listening' },
      { id: 'p2', name: 'Paper 2: Speaking', type: 'speaking' },
      { id: 'p3', name: 'Paper 3: Reading', type: 'reading' },
      { id: 'p4', name: 'Paper 4: Writing', type: 'writing' }
    ],
    directLinks: {
      '2022-p1': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86781H-QP-JUN22.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86781H-W-MS-JUN22.PDF' },
      '2022-p3': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86783H-QP-JUN22.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86783H-W-MS-JUN22.PDF' },
      '2022-p4': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86784H-QP-JUN22.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-86784H-W-MS-JUN22.PDF' },
      '2021-p1': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86781H-QP-NOV21.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86781H-W-MS-NOV21.PDF' },
      '2021-p3': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86783H-QP-NOV21.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86783H-W-MS-NOV21.PDF' },
      '2021-p4': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86784H-QP-NOV21.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2021/november/AQA-86784H-W-MS-NOV21.PDF' },
      '2020-p1': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2020/november/AQA-86781H-QP-NOV20.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2020/november/AQA-86781H-W-MS-NOV20.PDF' },
      '2020-p3': { qp: 'https://www.aqa.org.uk/files/sample-papers-and-mark-schemes.2020.november.AQA-86783H-QP-NOV20_PDF/65fab405cec0ed6b0ad9ea219d80b8e5f4e78ea8.pdf', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2020/november/AQA-86783H-W-MS-NOV20.PDF' },
      '2020-p4': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2020/november/AQA-86784H-QP-NOV20.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2020/november/AQA-86784H-W-MS-NOV20.PDF' },
      '2019-p1': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86781H-QP-JUN19.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86781H-W-MS-JUN19.PDF' },
      '2019-p3': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86783H-QP-JUN19.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86783H-W-MS-JUN19.PDF' },
      '2019-p4': { qp: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86784H-QP-JUN19.PDF', ms: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2019/june/AQA-86784H-W-MS-JUN19.PDF' },
    }
  },
  biblical: {
    board: 'Edexcel',
    specification: 'GCSE Biblical Hebrew (1BH0)',
    startYear: 2019,
    papers: [
      { id: 'p1', name: 'Paper 1: Set Texts', type: 'reading' },
      { id: 'p2', name: 'Paper 2: Translation & Composition', type: 'writing' }
    ],
    directLinks: {
      '2022-p1': { qp: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-01-que-20221110.pdf', ms: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-01-rms-20221110.pdf' },
      '2022-p2': { qp: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-02-que-20221115.pdf', ms: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-02-rms-20221115.pdf' },
      '2021-p1': { qp: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-01-que-20211110.pdf', ms: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-01-rms-20211110.pdf' },
      '2021-p2': { qp: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-02-que-20211115.pdf', ms: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/Exam-materials/1bh0-02-rms-20211115.pdf' },
      '2019-p1': { qp: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/specification-and-sample-assessments/GCSE_Bib_Hebrew_SAMs_Booklet.pdf', ms: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/Biblical%20Hebrew/2018/specification-and-sample-assessments/GCSE_Bib_Hebrew_SAMs_Booklet.pdf' },
    }
  },
  spanish: {
    board: 'Edexcel',
    specification: 'GCSE Spanish (1SP0)',
    startYear: 2018,
    papers: [
      { id: 'p1', name: 'Paper 1: Listening', type: 'listening' },
      { id: 'p2', name: 'Paper 2: Speaking', type: 'speaking' },
      { id: 'p3', name: 'Paper 3: Reading', type: 'reading' },
      { id: 'p4', name: 'Paper 4: Writing', type: 'writing' }
    ],
    directLinks: {} 
  },
  french: {
    board: 'Edexcel',
    specification: 'GCSE French (1FR0)',
    startYear: 2018,
    papers: [
      { id: 'p1', name: 'Paper 1: Listening', type: 'listening' },
      { id: 'p2', name: 'Paper 2: Speaking', type: 'speaking' },
      { id: 'p3', name: 'Paper 3: Reading', type: 'reading' },
      { id: 'p4', name: 'Paper 4: Writing', type: 'writing' }
    ],
    directLinks: {}
  },
  german: {
    board: 'AQA',
    specification: 'GCSE German (8668)',
    startYear: 2018,
    papers: [
      { id: 'p1', name: 'Paper 1: Listening', type: 'listening' },
      { id: 'p2', name: 'Paper 2: Speaking', type: 'speaking' },
      { id: 'p3', name: 'Paper 3: Reading', type: 'reading' },
      { id: 'p4', name: 'Paper 4: Writing', type: 'writing' }
    ],
    directLinks: {}
  }
};

export function PastPapers({ language, onBack, onViewPdf }: PastPapersProps) {
  const spec = LANGUAGE_SPECS[language as keyof typeof LANGUAGE_SPECS] || LANGUAGE_SPECS.spanish;
  // Cap at 2025 as 2026 papers are not yet released
  const latestAvailableYear = Math.min(new Date().getFullYear(), 2025);
  const RECENT_YEARS = Array.from({ length: latestAvailableYear - spec.startYear + 1 }, (_, i) => (latestAvailableYear - i).toString());

  const [records, setRecords] = useState<PaperRecord[]>([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem(`vocariox_past_papers_v2_${language}`);
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error('Failed to parse past papers', e);
      }
    } else {
      const initialRecords: PaperRecord[] = [];
      for (const year of RECENT_YEARS) {
        for (const paper of spec.papers) {
          const links = spec.directLinks[`${year}-${paper.id}`];
          initialRecords.push({
            id: `${year}-${paper.id}`,
            year,
            paperName: paper.name,
            paperUrl: links?.qp || '',
            markSchemeUrl: links?.ms || '',
            status: 'todo'
          });
        }
      }
      setRecords(initialRecords);
    }
  }, [language]);

  const handleOpenPaper = (record: PaperRecord) => {
    if (record.paperUrl) {
      window.open(record.paperUrl, '_blank');
    }
  };

  const saveRecords = (newRecords: PaperRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(`vocariox_past_papers_v2_${language}`, JSON.stringify(newRecords));
  };

  const updateRecord = (id: string, updates: Partial<PaperRecord>) => {
    const newRecords = records.map(r => r.id === id ? { ...r, ...updates } : r);
    saveRecords(newRecords);
  };

  const completedCount = records.filter(r => r.status === 'completed').length;
  const progressPercent = records.length > 0 ? Math.round((completedCount / records.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronDown className="w-6 h-6 rotate-90 text-slate-500" />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            Official Paper Tracker
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-[10px] font-black uppercase tracking-widest">{spec.board}</span>
             <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                {spec.specification}
             </span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Series Completion</h2>
            <div className="text-6xl font-black mb-2 tracking-tighter tabular-nums flex items-baseline gap-2">
              {progressPercent}<span className="text-2xl text-slate-500">%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
               {completedCount} of {records.length} tasks finished
            </div>
          </div>
          <div className="w-full md:w-64 relative z-10">
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Humble Beginnings</span>
              <span>Mastery</span>
            </div>
          </div>
          <BookOpen className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-800/50 -rotate-12 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-12">
        {RECENT_YEARS.map(year => {
          const yearRecords = records.filter(r => r.year === year);
          if (yearRecords.length === 0) return null;

          return (
            <div key={year} className="relative">
              <div className="absolute left-6 top-16 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
              <h3 className="text-2xl font-black mb-8 flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                   {year.slice(-2)}
                 </div>
                 <span className="text-slate-900 dark:text-white">{year} Exam Series</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-12">
                {yearRecords.map(record => (
                  <div key={record.id} className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-sm flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">
                          {record.id.split('-')[1].toUpperCase()}
                        </div>
                        <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                          {record.paperName}
                        </h4>
                      </div>
                      <select
                        value={record.status}
                        onChange={(e) => updateRecord(record.id, { status: e.target.value as any })}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shrink-0 ${
                          record.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 
                          record.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 
                          'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Done</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                       <button 
                          onClick={() => handleOpenPaper(record)}
                          className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                             record.paperUrl
                                ? 'bg-slate-900 text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 font-black' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border-dashed border-2 border-slate-200'
                          }`}
                          disabled={!record.paperUrl}
                       >
                          <BookOpen className="w-4 h-4" />
                          {record.paperUrl ? 'Question Paper' : 'Paper Not Found'}
                          {record.paperUrl && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
                       </button>

                       <button 
                          onClick={() => record.markSchemeUrl && window.open(record.markSchemeUrl, '_blank')}
                          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                            record.markSchemeUrl 
                            ? 'border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-400 font-bold'
                            : 'border-slate-100 text-slate-300 cursor-not-allowed'
                          }`}
                          disabled={!record.markSchemeUrl}
                       >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Official Mark Scheme
                       </button>
                    </div>

                    {record.status === 'completed' && (
                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tier & Result</span>
                          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {(['F', 'H'] as const).map((t) => (
                              <button
                                key={t}
                                onClick={() => {
                                  const newTier = t;
                                  const newGrade = calculateGrade(record.score || '', record.year, language, newTier);
                                  updateRecord(record.id, { tier: newTier, grade: newGrade });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                  (record.tier || 'H') === t 
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {t === 'F' ? 'FOUNDATION' : 'HIGHER'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              placeholder="Raw Mark (e.g. 45)"
                              value={record.score || ''}
                              onChange={(e) => {
                                const newScore = e.target.value;
                                const newGrade = calculateGrade(newScore, record.year, language, record.tier || 'H');
                                updateRecord(record.id, { score: newScore, grade: newGrade });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 pointer-events-none">
                              / 60
                            </div>
                          </div>
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-all shadow-lg ${
                            record.grade && record.grade !== 'U'
                              ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                              : record.grade === 'U'
                              ? 'bg-rose-500 text-white shadow-rose-500/30'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            <span className="text-[10px] leading-none mb-0.5 opacity-70">GRADE</span>
                            <span className="text-xl leading-none">{record.grade || '?'}</span>
                          </div>
                        </div>
                        {record.grade && (
                          <p className="text-[10px] font-bold text-slate-500 text-center italic">
                            Calculated using official {record.year} {spec.board} boundaries.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-20 p-10 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-4">Official Exam Board Hubs</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto mb-8">
           We prioritize direct links, but you can also browse the full archives on the board websites.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://www.aqa.org.uk/find-past-papers-and-mark-schemes" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl font-black text-sm shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all">AQA GCSE Hub</a>
          <a href="https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl font-black text-sm shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all">Edexcel GCSE Hub</a>
        </div>
      </div>
    </div>
  );
}
