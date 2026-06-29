import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ExternalLink, 
  Calculator, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  TrendingUp,
  Award,
  BookOpen,
  ChevronDown,
  Target
} from 'lucide-react';
import { PastPaper, GradeBoundaries, UserPaperResult } from '../types/pastPapers';
import { INITIAL_PAST_PAPERS, INITIAL_GRADE_BOUNDARIES } from '../data/pastPapersData';
import { PastPapersService } from '../services/pastPapersService';
import { auth, db } from '../firebase';
import { collection, query, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface PastPapersProps {
  language: string;
  onBack: () => void;
  isMobile?: boolean;
  isPremium?: boolean;
  devMode?: boolean;
  onBlockPremiumFeature?: (featureName: string, description: string) => void;
}

export const PastPapers: React.FC<PastPapersProps> = ({ 
  language, 
  onBack, 
  isMobile = false,
  isPremium = false,
  devMode = false,
  onBlockPremiumFeature
}) => {
  const [step, setStep] = useState<'subjects' | 'papers' | 'result'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedPaperNum, setSelectedPaperNum] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [inputScore, setInputScore] = useState<string>('');
  const [results, setResults] = useState<Record<string, UserPaperResult>>({});
  const [loading, setLoading] = useState(true);

  const subjects = useMemo(() => [...new Set(INITIAL_PAST_PAPERS.map(p => p.subject))], []);

  const years = useMemo(() => {
    const relevant = INITIAL_PAST_PAPERS.filter(p => p.subject === selectedSubject);
    return ['All', ...new Set(relevant.map(p => p.year.toString()))].sort((a, b) => b.localeCompare(a));
  }, [selectedSubject]);

  const paperNums = useMemo(() => {
    const relevant = INITIAL_PAST_PAPERS.filter(p => p.subject === selectedSubject);
    return ['All', ...new Set(relevant.map(p => p.paperNumber.toString()))].sort();
  }, [selectedSubject]);

  const tiers = useMemo(() => {
    const relevant = INITIAL_PAST_PAPERS.filter(p => p.subject === selectedSubject);
    return ['All', ...new Set(relevant.map(p => p.tier))].sort();
  }, [selectedSubject]);

  // Sync results from Firestore
  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users', auth.currentUser.uid, 'paperResults'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newResults: Record<string, UserPaperResult> = {};
      snapshot.forEach((doc) => {
        newResults[doc.id] = doc.data() as UserPaperResult;
      });
      setResults(newResults);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore past papers sync warning (gracefully caught):", error.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPapers = useMemo(() => {
    return INITIAL_PAST_PAPERS.filter(p => {
      const matchesSubject = p.subject === selectedSubject;
      const matchesYear = selectedYear === 'All' || p.year.toString() === selectedYear;
      const matchesPaperNum = selectedPaperNum === 'All' || p.paperNumber.toString() === selectedPaperNum;
      const matchesTier = selectedTier === 'All' || p.tier === selectedTier;
      return matchesSubject && matchesYear && matchesPaperNum && matchesTier;
    });
  }, [selectedSubject, selectedYear, selectedPaperNum, selectedTier]);

  const currentBoundaries = useMemo(() => {
    if (!selectedPaper) return null;
    if (selectedPaper.boundaries) {
      return {
        boundaryId: selectedPaper.paperId,
        examBoard: selectedPaper.examBoard,
        subject: selectedPaper.subject,
        tier: selectedPaper.tier,
        year: selectedPaper.year,
        boundaries: selectedPaper.boundaries
      } as GradeBoundaries;
    }
    const boundaryId = PastPapersService.generateBoundaryId(
      selectedPaper.examBoard,
      selectedPaper.subject,
      selectedPaper.tier,
      selectedPaper.year
    );
    return INITIAL_GRADE_BOUNDARIES.find(b => b.boundaryId === boundaryId);
  }, [selectedPaper]);

  const calculationResult = useMemo(() => {
    if (!selectedPaper || !currentBoundaries || !inputScore) return null;
    const scoreNum = parseInt(inputScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > selectedPaper.totalMarks) return null;
    const gradeResult = PastPapersService.calculateGrade(scoreNum, currentBoundaries.boundaries);
    return {
      ...gradeResult,
      percentage: (scoreNum / selectedPaper.totalMarks) * 100
    };
  }, [selectedPaper, currentBoundaries, inputScore]);

  const handleSaveResult = async () => {
    if (!selectedPaper || !calculationResult || !inputScore) return;
    const result: UserPaperResult = {
      userId: auth.currentUser?.uid || 'guest',
      paperId: selectedPaper.paperId,
      score: parseInt(inputScore),
      percentage: (parseInt(inputScore) / selectedPaper.totalMarks) * 100,
      grade: calculationResult.grade,
      timestamp: Date.now()
    };
    if (auth.currentUser) {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'paperResults', selectedPaper.paperId), result);
    } else {
      setResults(prev => ({ ...prev, [selectedPaper.paperId]: result }));
    }
  };

  const openOfficialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="past-paper-intelligence" className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-32">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => {
            if (step === 'result') setStep('papers');
            else if (step === 'papers') setStep('subjects');
            else onBack();
          }} 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-500" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-1 flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            {step === 'subjects' ? 'Past Paper Selection' : step === 'papers' ? selectedSubject : 'Grading Engine'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Official GCSE Practice & Discovery.</p>
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {step === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}
            >
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setStep('papers');
                  }}
                  className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{subject}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{INITIAL_PAST_PAPERS.filter(p => p.subject === subject).length} Papers Available</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 'papers' && (
            <motion.div
              key="papers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter By</span>
                </div>
                
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="All">Year: All</option>
                  {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select 
                  value={selectedPaperNum}
                  onChange={(e) => setSelectedPaperNum(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="All">Paper: All</option>
                  {paperNums.filter(n => n !== 'All').map(n => <option key={n} value={n}>Paper {n}</option>)}
                </select>

                <select 
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="All">Tier: All</option>
                  {tiers.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t} Tier</option>)}
                </select>

                <button 
                  onClick={() => {
                    setSelectedYear('All');
                    setSelectedPaperNum('All');
                    setSelectedTier('All');
                  }}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                >
                  Reset
                </button>
              </div>

              <div className="grid gap-4">
                {filteredPapers.map(paper => (
                  <div 
                    key={paper.paperId}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <FileText className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-black text-slate-900 dark:text-white uppercase">Year {paper.year}</span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{paper.examBoard}</span>
                        </div>
                        <div className="text-slate-400 text-sm font-bold flex items-center gap-3">
                          <span>Paper {paper.paperNumber}</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>{paper.tier} Tier</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>{paper.totalMarks} Marks</span>
                        </div>
                        {paper.year === 2024 && (paper.subject === 'French' || paper.subject === 'Spanish') && (
                          <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Combined SAMs PDF (QP & MS together) • Scroll down for Mark Scheme
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openOfficialLink(paper.paperUrl)}
                          className="px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border border-slate-100 dark:border-slate-800"
                        >
                          <FileText className="w-4 h-4" /> QP
                        </button>
                        <button 
                          onClick={() => openOfficialLink(paper.markSchemeUrl)}
                          className="px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border border-slate-100 dark:border-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4" /> MS
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (isPremium || devMode) {
                            setSelectedPaper(paper);
                            setInputScore(results[paper.paperId]?.score.toString() || '');
                            setStep('result');
                          } else {
                            if (onBlockPremiumFeature) {
                              onBlockPremiumFeature(
                                "Score Entry & GCSE Grading",
                                "Unlock the ability to log your results, calculate official grades against real exam board boundaries, and monitor your progress trends."
                              );
                            }
                          }
                        }}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Calculator className="w-4 h-4" /> Input Score
                      </button>
                    </div>
                  </div>
                ))}
                {filteredPapers.length === 0 && (
                  <div className="p-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                    <Filter className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No papers found matching those filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'result' && selectedPaper && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-10 bg-slate-900 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
                      Metadata Verification Active
                    </span>
                    <TrendingUp className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-4xl font-black mb-2">{selectedPaper.subject}</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                    {selectedPaper.examBoard} • {selectedPaper.year} • Paper {selectedPaper.paperNumber}
                  </p>
                </div>

                <div className="p-10 space-y-10">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                      Performance Input
                    </label>
                    <div className="flex items-end gap-6 mb-8">
                      <div className="flex-1 relative">
                        <input 
                          type="number"
                          value={inputScore}
                          onChange={(e) => setInputScore(e.target.value)}
                          max={selectedPaper.totalMarks}
                          min={0}
                          className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl text-4xl font-black focus:border-indigo-500 outline-none transition-all pr-20"
                          placeholder="0"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">/ {selectedPaper.totalMarks}</span>
                      </div>
                      <button 
                        onClick={handleSaveResult}
                        disabled={!calculationResult}
                        className="h-[84px] px-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                      >
                        Calculate result
                      </button>
                    </div>

                    {calculationResult ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
                      >
                        <div className="flex items-center gap-10 mb-10 relative z-10">
                          <div className="w-32 h-32 rounded-[2rem] bg-indigo-500 flex flex-col items-center justify-center shadow-2xl">
                             <span className="text-6xl font-black leading-none">{calculationResult.grade}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">Grade</span>
                          </div>
                          <div>
                            <p className="text-4xl font-black mb-1">{calculationResult.percentage.toFixed(1)}%</p>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Deterministic Result</p>
                          </div>
                        </div>

                        {calculationResult.nextGrade && (
                          <div className="space-y-4 relative z-10">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-300">
                               <span>Next Grade: {calculationResult.nextGrade}</span>
                               <span>{calculationResult.marksToNext} marks remaining</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-indigo-500 rounded-full"
                                 style={{ width: `${Math.max(10, 100 - (calculationResult.marksToNext || 0) * 5)}%` }}
                               />
                            </div>
                          </div>
                        )}
                        <Target className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 pointer-events-none" />
                      </motion.div>
                    ) : (
                      <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400">Enter your marks to execute the grading engine.</p>
                      </div>
                    )}
                  </div>

                  {selectedPaper.year === 2024 && (selectedPaper.subject === 'French' || selectedPaper.subject === 'Spanish') && (
                     <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex flex-col gap-1">
                       <span className="font-black uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300">Combined SAMs Document Notice:</span>
                       <span>These 2024 papers are Sample Assessment Materials (SAMs). Both the Question Paper and Mark Scheme are combined in the same link. Please scroll down to the bottom of the PDF to access the Mark Scheme.</span>
                     </div>
                  )}

                  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                     <button 
                       onClick={() => openOfficialLink(selectedPaper.paperUrl)}
                       className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 border border-slate-100"
                     >
                       <FileText className="w-4 h-4" /> Paper PDF
                     </button>
                     <button 
                       onClick={() => openOfficialLink(selectedPaper.markSchemeUrl)}
                       className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 border border-slate-100"
                     >
                       <CheckCircle2 className="w-4 h-4" /> Mark Scheme
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

