import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserProgress } from '../types';

interface ProgressChartProps {
  progress: UserProgress[];
}

export function ProgressChart({ progress }: ProgressChartProps) {
  const data = useMemo(() => {
    // Generate data for the current week (Sunday to Saturday)
    const currentWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      const day = d.getDay(); // 0 (Sun) to 6 (Sat)
      d.setDate(d.getDate() - day + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });

    return currentWeek.map(date => {
      const timestamp = date.getTime();
      const nextDayTimestamp = timestamp + 24 * 60 * 60 * 1000;
      
      const masteredOnDay = progress.filter(p => 
        p.mastery === 'mastered' && 
        p.lastStudied >= timestamp && 
        p.lastStudied < nextDayTimestamp
      ).length;

      const learningOnDay = progress.filter(p => 
        p.mastery === 'learning' && 
        p.lastStudied >= timestamp && 
        p.lastStudied < nextDayTimestamp
      ).length;

      return {
        name: date.getDay() === 6 ? 'שבת' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        mastered: masteredOnDay,
        learning: learningOnDay,
        total: masteredOnDay + learningOnDay
      };
    });
  }, [progress]);

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 30 }}>
          <defs>
            <linearGradient id="colorMastered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLearning" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="opacity-50 dark:opacity-20" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            dy={0}
            interval={0}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tooltip-bg, #fff)', 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              padding: '12px 16px'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: '700' }}
            labelStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', color: '#94a3b8' }}
          />
          <Area 
            type="monotone" 
            dataKey="mastered" 
            stroke="#10b981" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorMastered)" 
            name="Mastered"
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="learning" 
            stroke="#f59e0b" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorLearning)" 
            name="Learning"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
      <style dangerouslySetInnerHTML={{ __html: `
        .dark {
          --tooltip-bg: #0f172a;
        }
      `}} />
    </div>
  );
}
