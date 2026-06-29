import React from 'react';
import { motion } from 'motion/react';
import { Home, LayoutDashboard, Award, BookOpen, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
  devMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, devMode = false }) => {
  // We only show the bottom navigation for high-level hub views so sessions are immersive/focused
  const visibleViews = ['home', 'dashboard', 'examSimulator', 'pricing', 'pastPapers', 'checkout', 'premium-success', 'roadmap', 'examCountdown'];
  const baseView = currentView === 'pricing' || currentView === 'checkout' || currentView === 'premium-success' || currentView === 'roadmap' || currentView === 'examCountdown' ? 'dashboard' : currentView;

  if (!visibleViews.includes(currentView)) {
    return null;
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Decks', icon: LayoutDashboard },
    { id: 'examSimulator', label: 'Exam Hub', icon: Award },
    { id: 'pastPapers', label: 'Past Papers', icon: BookOpen },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between pb-[safe-area-inset-bottom]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = baseView === tab.id;

          return (
            <button
              id={`bottom-nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative py-1 focus:outline-none touch-manipulation min-h-[44px]"
            >
              <div className="relative flex flex-col items-center gap-1">
                <Icon 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 scale-110' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                  }`} 
                />
                
                <span 
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
                      : 'text-slate-400 dark:text-slate-500 font-medium'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeBottomTabIndicator"
                    className="absolute -top-1.5 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
