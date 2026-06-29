import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, X, Coffee, BookOpen, Settings2 } from 'lucide-react';

export function StudyTimer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [studyMinutes, setStudyMinutes] = useState(50);
  const [breakMinutes, setBreakMinutes] = useState(10);
  
  const [timeLeft, setTimeLeft] = useState(studyMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playBeep();
      if (mode === 'study') {
        setMode('break');
        setTimeLeft(breakMinutes * 60);
      } else {
        setMode('study');
        setTimeLeft(studyMinutes * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, studyMinutes, breakMinutes]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
  };

  const handleRatioChange = (studyMin: number) => {
    const breakMin = 60 - studyMin;
    setStudyMinutes(studyMin);
    setBreakMinutes(breakMin);
    if (!isActive) {
      setTimeLeft(mode === 'study' ? studyMin * 60 : breakMin * 60);
    }
  };

  const switchMode = (newMode: 'study' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-20 md:bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 border-indigo-200/20"
      >
        <Clock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-20 md:bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans"
    >
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {mode === 'study' ? (
            <BookOpen className="w-5 h-5 text-indigo-500" />
          ) : (
            <Coffee className="w-5 h-5 text-amber-500" />
          )}
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">
            {mode === 'study' ? 'Focus Session' : 'Break Time'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsSettings(!isSettings)} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsExpanded(false)} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {isSettings ? (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest mb-1">Session Ratio (1 Hour)</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Study to Break (minutes)</p>
            </div>
            
            <div className="flex items-center justify-between font-black text-3xl">
              <div className="text-indigo-600 dark:text-indigo-400">{studyMinutes}m</div>
              <div className="text-amber-600 dark:text-amber-400">{breakMinutes}m</div>
            </div>

            <div className="py-4">
              <input 
                type="range" 
                min="10" 
                max="50" 
                step="5"
                value={studyMinutes}
                onChange={(e) => handleRatioChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mb-6"
              />
            </div>
            
            <div className="mb-6 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest text-center">
                Break timer starts automatically when focus session ends
              </p>
            </div>
            
            <button 
              onClick={() => setIsSettings(false)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-colors text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-6">
              <button 
                onClick={() => switchMode('study')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'study' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Study
              </button>
              <button 
                onClick={() => switchMode('break')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'break' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Break
              </button>
            </div>

            <div className={`text-7xl font-black mb-8 font-mono tracking-tighter tabular-nums ${mode === 'study' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${isActive ? 'bg-rose-500 shadow-rose-500/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
              >
                {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              
              <button 
                onClick={resetTimer}
                className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isSettings && (
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ${mode === 'study' ? 'bg-indigo-600' : 'bg-amber-500'}`}
            style={{ width: `${((mode === 'study' ? (studyMinutes * 60) - timeLeft : (breakMinutes * 60) - timeLeft) / (mode === 'study' ? studyMinutes * 60 : breakMinutes * 60)) * 100}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}
