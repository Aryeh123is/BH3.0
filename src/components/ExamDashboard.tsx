import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  History as HistoryIcon, 
  TrendingUp, 
  AlertCircle, 
  Award, 
  Calendar,
  Clock,
  ArrowRight,
  Flame,
  Target,
  Sparkles
} from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';

interface ExamDashboardProps {
  onStartExam: (type: string, mode: 'practice' | 'test' | 'full') => void;
  onStartDrill: (topic: string) => void;
}

export function ExamDashboard({ onStartExam, onStartDrill }: ExamDashboardProps) {
  const [history, setHistory] = useState<ReturnType<typeof AnalyticsService.getHistory>>(() => AnalyticsService.getHistory());
  const [analytics, setAnalytics] = useState<ReturnType<typeof AnalyticsService.getAnalytics>>(() => AnalyticsService.getAnalytics());
  
  useEffect(() => {
    const sync = () => {
      setHistory(AnalyticsService.getHistory());
      setAnalytics(AnalyticsService.getAnalytics());
    };
    window.addEventListener('bh-analytics-sync', sync);
    window.addEventListener('bh-history-sync', sync);
    return () => {
      window.removeEventListener('bh-analytics-sync', sync);
      window.removeEventListener('bh-history-sync', sync);
    };
  }, []);

  const weakestTopics = useMemo(() => AnalyticsService.getWeakestTopics(3), [analytics]);

  const stats = useMemo(() => {
    const values = Object.values(analytics);
    if (values.length === 0) return null;
    
    const avgAccuracy = values.reduce((acc, v) => acc + v.accuracy, 0) / values.length;
    const totalSeen = values.reduce((acc, v) => acc + v.timesSeen, 0);
    
    return {
      avgAccuracy: Math.round(avgAccuracy),
      totalSeen,
      bestTopic: [...values].sort((a, b) => b.accuracy - a.accuracy)[0]?.topic || 'N/A'
    };
  }, [analytics]);

  if (history.length === 0 && Object.keys(analytics).length === 0) {
    return (
      <div className="w-full text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <HistoryIcon className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Intelligence Required</h3>
        <p className="text-slate-500 font-bold max-w-sm mx-auto mb-12 italic leading-relaxed text-lg">Complete your first exam simulation to generate your performance profile and examiner risk tags.</p>
        <button 
          onClick={() => onStartExam('reading', 'practice')}
          className="px-12 py-4 bg-indigo-600 text-white rounded-xl font-black shadow-2xl shadow-indigo-500/30 uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
        >
          Initialize Academy Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{stats?.avgAccuracy || 0}%</div>
          <div className="text-xs font-bold text-slate-500 mt-1 relative z-10">Average across all topics</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Award className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Topic</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white truncate relative z-10">{stats?.bestTopic}</div>
          <div className="text-xs font-bold text-slate-500 mt-1 relative z-10">Your strongest area</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Target className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attempts</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{stats?.totalSeen || 0}</div>
          <div className="text-xs font-bold text-slate-500 mt-1 relative z-10">Total questions answered</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Flame className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
              <Flame className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">5 Days</div>
          <div className="text-xs font-bold text-slate-500 mt-1 relative z-10">Keep the momentum!</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HistoryIcon className="w-6 h-6 text-indigo-600" />
              Exam History
            </h3>
            <span className="text-xs font-bold text-slate-400">Last 10 simulations</span>
          </div>

          <div className="space-y-4">
            {history.slice(0, 10).map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                    Number(item.grade) >= 7 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 
                    Number(item.grade) >= 5 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                    'bg-slate-50 text-slate-600 dark:bg-slate-800'
                  }`}>
                    {item.grade}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white capitalize">{item.language} {item.type}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.avgTime}s avg.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{item.score}/{item.total}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weakness Drills */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Weakness Drills</h3>
          </div>

          <div className="space-y-4">
            {weakestTopics.map((topic, idx) => (
              <motion.div 
                key={topic.topic}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-rose-50/10 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl relative overflow-hidden group hover:bg-rose-50/20 transition-colors shadow-sm"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <AlertCircle className="w-20 h-20 text-rose-600" />
                </div>
                
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{topic.topic}</h4>
                <p className="text-sm text-slate-500 font-bold mb-6 italic">Current Performance: {Math.round(topic.accuracy)}%</p>
                
                <button 
                  onClick={() => onStartDrill(topic.topic)}
                  className="flex items-center gap-2 text-rose-600 font-black text-xs group-hover:gap-3 transition-all uppercase tracking-widest"
                >
                  <span>Start Targeted Drill</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 rotate-12" />
              </div>
              <Sparkles className="w-8 h-8 mb-6 text-amber-300 relative z-10" />
              <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter relative z-10">Adaptive Sync</h4>
              <p className="text-slate-400 text-sm font-bold mb-8 italic leading-relaxed relative z-10">AI-powered revision schedules based on your biometric performance tokens.</p>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all relative z-10 shadow-lg shadow-indigo-500/20">
                Unlock with Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
