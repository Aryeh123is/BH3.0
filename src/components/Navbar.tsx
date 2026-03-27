import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'dashboard') => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-extrabold text-slate-900 tracking-tight cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          BH <span className="text-primary">Keywords</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <button 
            onClick={() => onNavigate('home')}
            className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </nav>
  );
}
