import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Target, 
  Trophy, 
  Zap, 
  ChevronRight, 
  Lock, 
  Activity,
  Star,
  Crown,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ProgressService } from '../../services/user/progressService';
import { WeaknessService } from '../../services/user/weaknessService';
import { PlannerService } from '../../services/plannerService';
import { MissionService } from '../../services/user/missionService';
import { SubscriptionService } from '../../services/monetization/subscriptionService';
import { UserProgress, DailyMission, SubscriptionStatus } from '../../types/retention';
import { RevisionPlanner } from '../RevisionPlanner';

import { PricingPage } from './PricingPage';

interface DashboardProps {
  onNavigate?: (view: any) => void;
  onStartSession?: () => void;
  isPremium?: boolean;
  language?: string;
  devMode?: boolean;
  onStartExam?: (type: string, mode?: 'practice' | 'test' | 'full') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate = () => {}, 
  onStartSession = () => {},
  isPremium,
  language = 'spanish',
  devMode = false,
  onStartExam
}) => {
  const [view, setView] = useState<'status' | 'pricing'>('status');
  const [progress, setProgress] = useState<UserProgress>(ProgressService.getProgress());
  const [missions, setMissions] = useState<DailyMission[]>(MissionService.getDailyMissions());
  const [status, setStatus] = useState<SubscriptionStatus>(SubscriptionService.getStatus());

  const handleMissionClick = (mission: DailyMission) => {
    if (mission.isCompleted) return;
    if (mission.type === 'EXAM') {
      if (onStartExam) {
        onStartExam('reading', 'full');
      } else {
        onNavigate('examSimulator');
      }
    } else {
      if (onStartSession) {
        onStartSession();
      }
    }
  };

  useEffect(() => {
    const handleSync = () => {
      setProgress(ProgressService.getProgress());
      setMissions(MissionService.getDailyMissions());
      setStatus(SubscriptionService.getStatus());
    };
    window.addEventListener('vocariox_progress_sync', handleSync);
    window.addEventListener('bh-analytics-sync', handleSync);
    window.addEventListener('bh-history-sync', handleSync);
    return () => {
      window.removeEventListener('vocariox_progress_sync', handleSync);
      window.removeEventListener('bh-analytics-sync', handleSync);
      window.removeEventListener('bh-history-sync', handleSync);
    };
  }, []);

  const isBH = language.toLowerCase().includes('biblical');

  const handleUpdate = () => {
    setStatus(SubscriptionService.getStatus());
    setView('status');
  };

  if (view === 'pricing') {
    return <PricingPage currentStatus={status} onUpdate={handleUpdate} devMode={devMode} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Current Streak</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{progress.streak.count} Days</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Overall Mastery</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{progress.overallMastery}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Trophy className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Usage Guidance</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{progress.examCount.today} / {status.tier === 'FREE' ? '2' : '∞'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg ${status.isPremium ? 'bg-amber-100' : 'bg-slate-100'}`}>
              <Star className={`w-6 h-6 ${status.isPremium ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Your Tier</p>
              <div className="flex items-center gap-1.5">
                <p className={`text-sm font-black uppercase tracking-widest ${status.isPremium ? 'text-amber-600' : 'text-slate-500'}`}>
                  {status.tier}
                </p>
                {status.isTrialing && (
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase rounded tracking-tighter">Trial</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Missions Column */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
                Daily Missions
              </h2>
              <div className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest w-fit">
                <Trophy className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/10" />
                <span>{progress.xp || 0} XP Earned</span>
              </div>
            </div>
            <div className="space-y-4 font-sans">
              {missions.map((mission) => {
                const canComplete = !mission.isCompleted;
                return (
                  <motion.div 
                    key={mission.id}
                    whileHover={canComplete ? { y: -4, scale: 1.01 } : {}}
                    onClick={() => handleMissionClick(mission)}
                    className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border bg-white dark:bg-slate-900 relative overflow-hidden flex items-center justify-between shadow-sm transition-all focus:outline-none ${
                      mission.isCompleted 
                        ? 'opacity-60 border-slate-100 dark:border-slate-800' 
                        : 'border-slate-150 dark:border-slate-800 cursor-pointer hover:border-indigo-500/55 dark:hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className={`mt-0.5 p-1.5 sm:p-2 rounded-lg shrink-0 ${mission.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {mission.type === 'EXAM' ? <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> : <Target className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-tight text-slate-950 dark:text-slate-50">{mission.title}</h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-450 font-medium leading-tight">{mission.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <div className="text-[10px] sm:text-xs font-black px-2 py-0.5 bg-amber-100 text-amber-600 rounded">
                        +{mission.rewardPoints} XP
                      </div>
                      {mission.isCompleted ? (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600">Completed</span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 px-2.5 py-1 rounded-md transition-all group-hover:bg-indigo-500/30">
                          Start Task
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section>
            <RevisionPlanner 
              isPremium={status.tier === 'PREMIUM'} 
              onSelectTask={(type) => {
                if (onStartExam) {
                  if (type === 'speaking') onStartExam('speaking', 'practice');
                  else if (type === 'writing') onStartExam('writing', 'practice');
                  else if (type === 'translation') onStartExam('writing', 'practice'); // maps to writing exam
                  else if (type === 'reading') onStartExam('reading', 'practice');
                  else if (type === 'grammar') onStartExam('reading', 'practice'); // default to reading or grammar simulation
                  else if (onStartSession) onStartSession();
                } else {
                  if (type === 'speaking') onNavigate('speakingMode');
                  else if (type === 'writing') onNavigate('writingExam');
                  else if (type === 'translation') onNavigate('writingExam'); // Both in writing exam
                  else if (type === 'grammar') onNavigate('grammarMastery');
                  else if (onStartSession) onStartSession();
                }
              }}
            />
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest mb-4">Skill Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(progress.skills).map(([skill, value]) => (
                <div key={skill} className="p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{skill}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-indigo-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Crown className="w-16 h-16 rotate-12" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-400/30">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div className="px-2 py-1 bg-amber-400/20 rounded-md text-[10px] font-black uppercase tracking-widest text-amber-200 border border-amber-400/20">Growth Pathway</div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight relative z-10">Go further with Premium</h3>
            
            <div className="mb-4 relative z-10 flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 line-through font-bold">£49.99/yr</span>
                <span className="text-lg font-black text-white">£24.99/yr</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 line-through font-bold">£4.99/mo</span>
                <span className="text-lg font-black text-white">£2.49/mo</span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-300 mb-6 leading-relaxed relative z-10">
              {isBH 
                ? "Unlock the ultimate toolkit for Tanakh mastery. Get Archaeology Insignts, Set Text Modules, and AI Marking."
                : "Unlock the ultimate toolkit to guarantee your target grade. Get Spanish & French Audio, Grammar Modules, and AI Marking."}
            </p>
            
            {status.tier === 'PREMIUM' && (
              <div className="mb-4 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Premium System Active</p>
                </div>
                <p className="text-[9px] font-medium text-slate-500">Target Grade 8-9 Pathways unlocked.</p>
              </div>
            )}


            {status.tier === 'FREE' && status.isTrialing && (
              <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/10 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1 flex items-center gap-1.5">
                  <Flame className="w-3 h-3" />
                  Trial active
                </p>
                <p className="text-[9px] font-medium text-slate-400 leading-tight">Your 7-day Premium trial is currently active. Upgrade now to lock in your lifetime discount.</p>
              </div>
            )}
            <button 
              onClick={() => setView('pricing')}
              className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:bg-indigo-700 active:translate-y-0.5 transition-all relative z-10 border border-indigo-400/30"
            >
              Examine Growth Pathways
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-widest mb-1 flex items-center gap-2">
              Performance Index
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 italic tracking-tight">System Confidence: {Math.round(WeaknessService.getProfile().gradeConfidence * 100)}%</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Grade Prediction</p>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{WeaknessService.getProfile().lastGrade}</p>
                </div>
                {status.tier === 'PREMIUM' && (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">9</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Weakness Areas</p>
                {Object.values(WeaknessService.getProfile().insights)
                  .sort((a,b) => b.count - a.count)
                  .slice(0, 2)
                  .map(insight => (
                    <div key={insight.tag} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{insight.tag.replace('_', ' ')}</span>
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                    </div>
                  ))}
                {Object.keys(WeaknessService.getProfile().insights).length === 0 && (
                  <p className="text-[10px] font-medium text-slate-400 italic">No data collected yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-2">Revision Support</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 italic tracking-tight">Academic Guidance Enabled</p>
            <div className="space-y-4">
              {Object.values(progress.topics).length === 0 ? (
                <p className="text-xs text-slate-400 font-medium italic">Complete an exam to see your topic mastery...</p>
              ) : (
                Object.values(progress.topics)
                  .sort((a,b) => b.score - a.score)
                  .slice(0, 5)
                  .map((topic) => (
                    <div key={topic.topicId} className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate uppercase">{topic.topicId.split('-').slice(2).join(' ')}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{topic.totalAttempts} attempts</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${topic.score > 70 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                           {topic.score}%
                         </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
