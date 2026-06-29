import React, { Suspense } from 'react';
import { AnimatePresence } from 'motion/react';

export const componentMeta = {
  mobileSafe: true,
  desktopOnly: false,
  studyModeSafe: false
};

interface MobileLayoutProps {
  navbar: React.ReactNode;
  bottomNav: React.ReactNode;
  view: string;
  renderActiveViews: () => React.ReactNode;
  footer?: React.ReactNode;
}

export function MobileLayout({
  navbar,
  bottomNav,
  view,
  renderActiveViews,
  footer
}: MobileLayoutProps) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/10 transition-colors duration-300">
      {navbar}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pt-16 pb-24 touch-pan-y">
        <main className="flex-1 flex flex-col px-0 sm:px-4">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center py-12">Loading...</div>}>
            <AnimatePresence mode="wait">
              {renderActiveViews()}
            </AnimatePresence>
          </Suspense>
        </main>
        {footer && <div className="border-t border-slate-100 dark:border-slate-800/50 bg-white/30 dark:bg-slate-950/30">{footer}</div>}
      </div>
      {bottomNav}
    </div>
  );
}
