import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ExternalLink, 
  Calculator, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { PastPaper, GradeBoundaries, UserPaperResult } from '../types/pastPapers';
import { INITIAL_PAST_PAPERS, INITIAL_GRADE_BOUNDARIES } from '../data/pastPapersData';
import { PastPapersService } from '../services/pastPapersService';

interface PastPaperSystemProps {
  userId: string;
}

const PastPaperSystem: React.FC<PastPaperSystemProps> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedPaperNum, setSelectedPaperNum] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [inputScore, setInputScore] = useState<string>('');
  const [results, setResults] = useState<Record<string, UserPaperResult>>({});

  const subjects = useMemo(() => ['All', ...new Set(INITIAL_PAST_PAPERS.map(p => p.subject))], []);
  const boards = useMemo(() => ['All', ...new Set(INITIAL_PAST_PAPERS.map(p => p.examBoard))], []);
  const years = useMemo(() => ['All', ...new Set(INITIAL_PAST_PAPERS.map(p => p.year.toString()))].sort((a, b) => b.localeCompare(a)), []);
  const paperNums = useMemo(() => ['All', ...new Set(INITIAL_PAST_PAPERS.map(p => p.paperNumber.toString()))].sort(), []);

  const filteredPapers = useMemo(() => {
    return INITIAL_PAST_PAPERS.filter(paper => {
      const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
      const matchesBoard = selectedBoard === 'All' || paper.examBoard === selectedBoard;
      const matchesYear = selectedYear === 'All' || paper.year.toString() === selectedYear;
      const matchesPaperNum = selectedPaperNum === 'All' || paper.paperNumber.toString() === selectedPaperNum;
      const matchesSearch = paper.paperId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesBoard && matchesYear && matchesPaperNum && matchesSearch;
    });
  }, [selectedSubject, selectedBoard, selectedYear, selectedPaperNum, searchQuery]);

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

    return PastPapersService.calculateGrade(scoreNum, currentBoundaries.boundaries);
  }, [selectedPaper, currentBoundaries, inputScore]);

  const handleSaveResult = () => {
    if (!selectedPaper || !calculationResult || !inputScore) return;

    const result: UserPaperResult = {
      userId,
      paperId: selectedPaper.paperId,
      score: parseInt(inputScore),
      percentage: (parseInt(inputScore) / selectedPaper.totalMarks) * 100,
      grade: calculationResult.grade,
      timestamp: Date.now()
    };

    setResults(prev => ({ ...prev, [selectedPaper.paperId]: result }));
    // In a real app, this would be saved to Firestore
  };

  return (
    <div id="past-paper-system" className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-600" />
          Past Paper Intelligence
        </h2>
        <p className="text-slate-500">Official metadata-driven grade tracking and performance analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Filters and List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">Subject: All</option>
                {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">Board: All</option>
                {boards.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">Year: All</option>
                {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select 
                value={selectedPaperNum}
                onChange={(e) => setSelectedPaperNum(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">Paper: All</option>
                {paperNums.filter(n => n !== 'All').map(n => <option key={n} value={n}>Paper {n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredPapers.map((paper) => (
              <motion.button
                key={paper.paperId}
                layoutId={paper.paperId}
                onClick={() => {
                  setSelectedPaper(paper);
                  setInputScore(results[paper.paperId]?.score.toString() || '');
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                  selectedPaper?.paperId === paper.paperId 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white border-slate-100 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedPaper?.paperId === paper.paperId ? 'bg-white/20' : 'bg-slate-50'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">{paper.subject} {paper.year}</h3>
                      <div className={`text-xs flex items-center gap-2 ${
                        selectedPaper?.paperId === paper.paperId ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        <span>{paper.examBoard}</span>
                        <span>•</span>
                        <span>Tier: {paper.tier}</span>
                        <span>•</span>
                        <span>Paper {paper.paperNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={paper.markSchemeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedPaper?.paperId === paper.paperId 
                          ? 'bg-white/10 hover:bg-white/20 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title="Quick Mark Scheme Access"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </a>
                    {results[paper.paperId] && (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedPaper?.paperId === paper.paperId
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-500/20 text-emerald-600'
                      }`}>
                        Grade {results[paper.paperId].grade}
                      </div>
                    )}
                    <ChevronRight className={`w-4 h-4 opacity-50 ${selectedPaper?.paperId === paper.paperId ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Details and Calculator */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {!selectedPaper ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center"
              >
                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-sm font-medium">Select a past paper to view details and calculate your grade.</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedPaper.paperId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-indigo-300">
                      ID: {selectedPaper.paperId.toUpperCase()}
                    </span>
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-1">{selectedPaper.subject}</h3>
                  <p className="text-slate-400 text-sm">{selectedPaper.examBoard} • {selectedPaper.tier} • {selectedPaper.year}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* External Links */}
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={selectedPaper.paperUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-600">Question Paper</span>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </a>
                    <a 
                      href={selectedPaper.markSchemeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-600">Mark Scheme</span>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                    </a>
                  </div>

                  {/* Calculator */}
                  <div className="pt-6 border-t border-slate-100">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">
                      Grade Intelligence Engine
                    </label>
                    <div className="flex items-end gap-4 mb-6">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-2">Total Score (max {selectedPaper.totalMarks})</p>
                        <input 
                          type="number"
                          value={inputScore}
                          onChange={(e) => setInputScore(e.target.value)}
                          max={selectedPaper.totalMarks}
                          min={0}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold focus:border-indigo-500 outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <button 
                        onClick={handleSaveResult}
                        disabled={!calculationResult}
                        className="h-[56px] px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-colors flex items-center gap-2"
                      >
                        <Calculator className="w-5 h-5" />
                        Save
                      </button>
                    </div>

                    {calculationResult ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 rounded-2xl p-6 text-white"
                      >
                        <div className="flex items-center gap-6 mb-6">
                          <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex flex-col items-center justify-center shadow-xl shadow-indigo-500/20">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Grade</span>
                            <span className="text-4xl font-black">{calculationResult.grade}</span>
                          </div>
                          <div>
                            <p className="text-2xl font-black">{((parseInt(inputScore) / selectedPaper.totalMarks) * 100).toFixed(1)}%</p>
                            <p className="text-slate-400 text-sm">Deterministic Calculation</p>
                          </div>
                        </div>

                        {calculationResult.nextGrade && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">To Grade {calculationResult.nextGrade}</span>
                              <span className="font-bold text-indigo-300">+{calculationResult.marksToNext} marks</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-400" 
                                style={{ width: `${Math.max(0, 100 - (calculationResult.marksToNext || 0) * 5)}%` }}
                              />
                            </div>
                            {calculationResult.marksToGradeAboveNext && (
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                {calculationResult.marksToGradeAboveNext} marks to next tier
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <p className="text-xs text-amber-700 leading-relaxed">
                          {currentBoundaries 
                            ? `Enter a valid score between 0 and ${selectedPaper.totalMarks} to see your estimated grade based on official ${selectedPaper.year} boundaries.`
                            : 'Boundary data for this specific paper is currently unavailable in the local database.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PastPaperSystem;
