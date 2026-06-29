import React from 'react';
import { 
  Users, 
  School, 
  Globe, 
  Laptop,
  Plane,
  Building2,
  TreePine,
  ShoppingBag,
  Bus,
  Utensils,
  Camera,
  MessageCircle,
  Sticker
} from 'lucide-react';

interface ThemeVisualProps {
  themeId: string;
  className?: string;
}

/**
 * GCSE Exam Style Visual Fallback.
 * Provides deterministic, high-fidelity SVG "sketches" that mimic 
 * standard GCSE speaking exam paper illustrations.
 */
export const ThemeVisual: React.FC<ThemeVisualProps> = ({ themeId, className = "" }) => {
  const baseClasses = `relative flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-inner ${className}`;
  
  const renderGCSEScene = () => {
    const strokeColor = "currentColor";
    const sketchOpacity = "0.7";
    
    switch (themeId) {
      case 'theme-1-my-personal-world':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full text-slate-800 dark:text-slate-300 p-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 250 L350 250" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" opacity={sketchOpacity} />
            <rect x="100" y="200" width="200" height="40" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <circle cx="150" cy="140" r="25" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <path d="M120 180 Q150 160 180 180" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <circle cx="250" cy="140" r="25" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <path d="M220 180 Q250 160 280 180" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <text x="200" y="280" textAnchor="middle" className="text-[12px] font-mono font-bold opacity-40">EXAM REF: FAMILY_01</text>
          </svg>
        );
      case 'theme-2-leisure':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full text-slate-800 dark:text-slate-300 p-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="180" y="60" width="40" height="120" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <circle cx="200" cy="220" r="20" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} strokeDasharray="5 5" />
            <path d="M100 250 L300 250" stroke={strokeColor} strokeWidth="3" opacity={sketchOpacity} />
            <text x="200" y="280" textAnchor="middle" className="text-[12px] font-mono font-bold opacity-40">EXAM REF: LEISURE_02</text>
          </svg>
        );
      case 'theme-3-school':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full text-slate-800 dark:text-slate-300 p-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="40" width="280" height="120" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <path d="M80 70 L140 70 M80 100 L200 100" stroke={strokeColor} strokeWidth="2" opacity="0.3" />
            <rect x="140" y="190" width="120" height="50" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <text x="200" y="280" textAnchor="middle" className="text-[12px] font-mono font-bold opacity-40">EXAM REF: CLASS_03</text>
          </svg>
        );
      case 'theme-6-travel':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full text-slate-800 dark:text-slate-300 p-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 120 L360 120 L360 180 L40 180 Z" stroke={strokeColor} strokeWidth="2" opacity={sketchOpacity} />
            <circle cx="80" cy="150" r="15" stroke={strokeColor} strokeWidth="1" opacity="0.3" />
            <circle cx="120" cy="150" r="15" stroke={strokeColor} strokeWidth="1" opacity="0.3" />
            <text x="200" y="280" textAnchor="middle" className="text-[12px] font-mono font-bold opacity-40">EXAM REF: TRAVEL_06</text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full text-slate-400 p-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="360" height="260" x="20" y="20" stroke={strokeColor} strokeWidth="1" strokeDasharray="10 10" opacity="0.2" />
            <text x="200" y="150" textAnchor="middle" className="text-[12px] font-mono font-bold opacity-40">IMAGE REF: GENERAL_CONTEXT</text>
          </svg>
        );
    }
  };

  return (
    <div className={baseClasses} id={`theme-visual-${themeId}`}>
      {renderGCSEScene()}
      <div className="absolute top-2 right-2 px-3 py-1 bg-slate-900/10 text-slate-900 dark:text-white text-[10px] font-bold border border-slate-900/20 rounded">
        SKETCH_MODE
      </div>
    </div>
  );
};

