import React, { useState, useEffect } from "react";
import { ChevronLeft, Brain, Target, Activity, Clock, Trophy, LineChart, CheckCircle2, Sparkles, Loader2, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { UserPreferences, ExamEnvironment } from "../types";
import { SpeakingExamFlow } from "./speaking-engine/SpeakingExamFlow";
import { getSchemaForLanguage } from "../data/speaking-schemas/registry";
import { StudentMode, StudentProgress, ExamAttempt } from "../types/speaking-engine";
import { getStandardLanguageName } from "../lib/utils";
import { WeaknessService } from "../services/user/weaknessService";
import { CalibrationService } from "../services/calibrationService";
import { AIExaminer, AIFeedbackReport } from "../services/aiExaminer";

interface SpeakingExamModeProps {
  language: string;
  onBack: () => void;
  preferences?: UserPreferences;
  environment?: ExamEnvironment;
}

export function SpeakingExamMode({
  language,
  onBack,
  preferences,
  environment = 'TRAINING',
}: SpeakingExamModeProps) {
  const [selectedMode, setSelectedMode] = useState<StudentMode | null>(null);
  const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);
  const [feedback, setFeedback] = useState<AIFeedbackReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Auto-select exam mode if environment is EXAM
  useEffect(() => {
    if (environment === 'EXAM') {
      setSelectedMode('exam');
    }
  }, [environment]);
  
  const currentLanguage = getStandardLanguageName(language || preferences?.lastLanguage || "Spanish");
  const schema = getSchemaForLanguage(currentLanguage);

  const progress: StudentProgress = {
    userId: "student-1",
    totalAttempts: 12,
    examReadinessPercentage: 72,
    estimatedGrade: "7",
    coreMetrics: {
      fluencyScore: 65,
      accuracyScore: 80,
      vocabularyRangeScore: 55
    },
    nextBestTask: {
      taskId: "photo_card_vocab_builder",
      themeId: "Theme 1: Identity & culture",
      reason: "Your vocabulary range was the weakest area. Practice using more descriptive, varied adjectives."
    },
    spacedRepetitionQueue: [],
    recentGradeTrend: ["5", "6", "6", "7"]
  };

  const handleAiEvaluation = async () => {
    if (!lastAttempt) return;
    setIsEvaluating(true);
    try {
      // 1. Package responses for AI feedback
      const payload = {
        examType: 'speaking' as const,
        language: currentLanguage,
        tier: 'higher',
        examinerProfile: lastAttempt.profile ? {
          tone: lastAttempt.profile.examinerTone,
          strictnessOffset: lastAttempt.profile.strictnessOffset
        } : undefined,
        responses: lastAttempt.answers.map(r => ({
          questionId: r.sectionId,
          questionText: "Speaking Task",
          userResponse: "[Audio Data Processed]",
          marksAvailable: 15
        }))
      };

      try {
        const report = await AIExaminer.generateFeedback(payload);
        setFeedback(report);
        
        // Track results for weakness detection
        if (report.estimatedGCSEGrade) {
          const weaknessTags = report.sectionBreakdown.flatMap(s => s.weaknesses);
          WeaknessService.trackFeedback(weaknessTags, report.estimatedGCSEGrade, environment);
        }
      } catch (e) {
        console.warn("AI marking failed, using fallback:", e);
        setFeedback(AIExaminer.getFallbackFeedback(payload));
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  if (feedback) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12">
           <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Speaking Grade Report</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-[0.2em]">Verified by AI Examiner • Edexcel Standard</p>
                 </div>
              </div>

              {feedback.moderation && (
                <div className="mb-10 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start gap-4">
                   <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                   <div>
                      <h5 className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-1">Board Moderation Verified</h5>
                      <p className="text-xs font-bold text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                        {feedback.moderation.note}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                         <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">AI Component Score: {feedback.moderation.originalPercentage.toFixed(1)}%</div>
                         <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">•</div>
                         <div className="text-[10px] font-medium text-amber-600 dark:text-amber-500">Final Moderated Score: {feedback.moderation.finalPercentage.toFixed(1)}%</div>
                      </div>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="md:col-span-1 bg-indigo-600 rounded-[2.5rem] p-8 text-center text-white shadow-xl shadow-indigo-600/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Final Grade</p>
                    <div className="text-7xl font-black mb-2">{feedback.estimatedGCSEGrade}</div>
                    <div className="px-4 py-1.5 bg-white/20 rounded-full inline-block text-[10px] font-black uppercase tracking-widest">
                       Speaking Profile
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-6 flex flex-col justify-center">
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                         <LineChart className="w-4 h-4 text-indigo-500" />
                         Performance Insights
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-sm leading-relaxed mb-6">
                        {feedback.overallComments}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {feedback.sectionBreakdown[0]?.strengths.slice(0, 2).map((s, i) => (
                           <div key={i} className="flex gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight">{s}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 mb-12">
                 <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    Targeted Next Steps
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedback.nextSteps.map((step, i) => (
                       <div key={i} className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 flex gap-3">
                          <span className="text-indigo-500">•</span>
                          {step}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                   onClick={() => { setFeedback(null); setLastAttempt(null); setSelectedMode(null); }}
                   className="flex-1 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                   Return to Hub
                </button>
                <button
                   className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                >
                   Review Recordings
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (lastAttempt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
        <div className="max-w-4xl mx-auto pt-12 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-2xl border border-indigo-100 dark:border-indigo-900/30 text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Exam Submitted</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">
              Your speaking session for <strong>{currentLanguage}</strong> has been saved. 
              The recordings are ready for review.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <button
                onClick={handleAiEvaluation}
                disabled={isEvaluating}
                className="flex flex-col items-center gap-4 p-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-3xl transition-all group overflow-hidden relative"
              >
                {isEvaluating && (
                  <div className="absolute inset-0 bg-indigo-600/90 backdrop-blur-sm flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
                <Sparkles className="w-8 h-8 opacity-50 group-hover:scale-125 transition-transform" />
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">Request AI Marking</h3>
                  <p className="text-indigo-100/70 text-sm">Professional grade feedback based on Edexcel criteria.</p>
                </div>
              </button>

              <button
                onClick={() => { setLastAttempt(null); setSelectedMode(null); }}
                className="flex flex-col items-center gap-4 p-8 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-3xl transition-all"
              >
                <ChevronLeft className="w-8 h-8 opacity-50" />
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">Back to Dashboard</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">View your overall progress and other languages.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMode) {
    if (!schema) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Speaking Exam Not Available</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
            Speaking exams are not supported for {currentLanguage}.
          </p>
          <button onClick={() => setSelectedMode(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Go Back</button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-900/50 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setSelectedMode(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Exit {environment === 'EXAM' ? 'EXAM' : selectedMode} mode</span>
            </button>
            <div className={`text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2 ${
              environment === 'EXAM' ? 'bg-rose-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {environment === 'EXAM' && <ShieldCheck className="w-4 h-4" />}
              {environment === 'EXAM' ? 'EXAM MODE' : `${selectedMode} MODE`}
            </div>
          </div>
        </div>

        <div className={`max-w-5xl mx-auto mt-8 px-4 ${environment === 'EXAM' ? 'border-l-4 border-rose-500 pl-8' : ''}`}>
          {environment === 'EXAM' && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-black text-rose-900 dark:text-rose-400 uppercase tracking-widest">
                Realism Calibration Active • Strictly Exam Board Structure Only
              </span>
            </div>
          )}
          <SpeakingExamFlow
            schema={schema}
            extraTime={preferences?.extraTime}
            microphoneAlwaysOn={preferences?.microphoneAlwaysOn}
            audioAutoplay={preferences?.audioAutoplay}
            preferredVoices={preferences?.preferredVoices}
            useCloudVoices={preferences?.useCloudVoices}
            cloudVoices={preferences?.cloudVoices}
            onComplete={(attempt) => {
              // v3.8.9: Track theme usage for rotation
              if (attempt.sessionId) {
                // Find theme if possible, or use GENERAL
                const themeId = (attempt as any).selectedThemeId || 'GENERAL';
                CalibrationService.trackUsage(attempt.sessionId, themeId);
              }
              setLastAttempt(attempt);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-900/50 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            GCSE Speaking Revision
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Train your fluency, master grammar accuracy, and track your progress against real Edexcel examiner standards.
          </p>
        </div>

        {/* Modes Selection */}
        <div className="space-y-12 mb-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
               <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">Training Environments</h2>
               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Practice Mode */}
              <button 
                onClick={() => setSelectedMode("practice")}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-2 border-transparent hover:border-emerald-500 shadow-xl hover:shadow-2xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Practice Mode</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Take your time. Get instant feedback after each task. Hints are allowed. Perfect for building confidence.
                </p>
                <span className="text-emerald-600 font-bold flex items-center gap-2">
                  Start Practice <ChevronLeft className="w-4 h-4 rotate-180" />
                </span>
              </button>

              {/* Weakness Mode */}
              <button 
                onClick={() => setSelectedMode("weakness")}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-2 border-transparent hover:border-amber-500 shadow-xl hover:shadow-2xl transition-all text-left relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  AI RECOMMENDED
                </div>
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Target Weakness</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  AI-selected tasks based on your historical mistakes. Focus specifically on your weakest themes and grammar.
                </p>
                <span className="text-amber-600 font-bold flex items-center gap-2">
                  Start Targeted <ChevronLeft className="w-4 h-4 rotate-180" />
                </span>
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
               <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">Official Simulation</h2>
               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Exam Mode */}
            <button 
              onClick={() => setSelectedMode("exam")}
              className="w-full bg-slate-900 dark:bg-slate-950 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-500 shadow-xl hover:shadow-2xl transition-all text-left group flex flex-col md:flex-row items-center gap-8"
            >
              <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-black text-white italic lowercase tracking-tight">Full Mock Exam</h3>
                  <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">Edexcel Calibration</div>
                </div>
                <p className="text-indigo-200/70 leading-relaxed max-w-2xl font-medium">
                  Full timed simulation under strict exam conditions. No hints. Professional AI marking and deterministic board moderation at the end.
                </p>
              </div>
              <div className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 group-hover:bg-indigo-50 transition-colors">
                Begin Simulation <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </section>
        </div>

        {/* Progress Dashboard */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <LineChart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Progress</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard Stats */}
            <div className="col-span-1 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="text-sm font-bold text-slate-500 mb-1">Exam Readiness</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white flex items-end gap-2">
                  {progress.examReadinessPercentage}<span className="text-lg text-slate-400 font-medium pb-1">%</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="text-sm font-bold text-slate-500 mb-1">Estimated Grade</div>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-end gap-2">
                  Band {progress.estimatedGrade}
                </div>
              </div>
            </div>

            {/* AI Insights & Simplified Metrics */}
            <div className="col-span-2 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Core Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <div className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-1">Fluency</div>
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-300">{progress.coreMetrics.fluencyScore}%</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="text-blue-700 dark:text-blue-400 text-xs font-bold uppercase mb-1">Accuracy</div>
                    <div className="text-2xl font-black text-blue-900 dark:text-blue-300">{progress.coreMetrics.accuracyScore}%</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <div className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase mb-1">Vocab Range</div>
                    <div className="text-2xl font-black text-amber-900 dark:text-amber-300">{progress.coreMetrics.vocabularyRangeScore}%</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Next Best Task</h4>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800/50 rounded-full flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">{progress.nextBestTask.themeId}</h5>
                    <p className="text-indigo-700 dark:text-indigo-400 text-sm leading-relaxed">
                      {progress.nextBestTask.reason} Let's focus your effort exactly here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
