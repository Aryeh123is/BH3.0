import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Target, 
  Zap, 
  TrendingUp,
  Clock,
  Sparkles,
  Crown
} from 'lucide-react';
import { PlannerService, WeeklyRevisionPlan } from '../services/plannerService';

interface RevisionPlannerProps {
  isPremium: boolean;
  onSelectTask: (type: string) => void;
}

export function RevisionPlanner({ isPremium, onSelectTask }: RevisionPlannerProps) {
  const plan = useMemo(() => PlannerService.generateWeeklyPlan(isPremium), [isPremium]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Active Revision Plan</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Personalised Strategy</p>
          </div>
        </div>
        {isPremium && (
          <div className="px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center gap-1.5">
            <Crown className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Pro Insights</span>
          </div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Target className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Weekly Focus</span>
          </div>
          <h4 className="text-2xl font-black mb-4">{plan.weeklyFocus}</h4>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">Est. Lift: {plan.estimatedGradeLift}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <Clock className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">Intensity: {plan.projectedIntensity}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3">
        {plan.items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onSelectTask(item.type)}
            className="w-full text-left p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all group flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                item.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                item.category === 'growth' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    item.category === 'weakness_repair' ? 'bg-rose-500/10 text-rose-500' :
                    item.category === 'growth' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.estimatedTime}</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{item.title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {isPremium && (
        <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <TrendingUp className="w-24 h-24 text-white" />
          </div>
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Progression Forecast
          </h5>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Weekly Momentum</p>
                <p className="text-2xl font-black text-white">+12% Velocity</p>
              </div>
              <div className="flex gap-1 items-end h-12">
                {[4, 7, 5, 8, 10, 12].map((h, i) => (
                  <div key={i} className="w-3 bg-indigo-500 rounded-t-sm" style={{ height: `${h * 4}px` }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
              "Your Tense Accuracy focus is yielding 15% higher accuracy in recent mock papers. Keep this intensity to lock in your Grade 8 prediction."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
