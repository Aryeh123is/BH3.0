import React, { Suspense } from 'react';
import { AnimatePresence } from 'motion/react';

export const componentMeta = {
  mobileSafe: false,
  desktopOnly: true,
  studyModeSafe: false
};

interface DesktopLayoutProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  view: string;
  renderActiveViews: () => React.ReactNode;
}

export function DesktopLayout({
  navbar,
  footer,
  view,
  renderActiveViews
}: DesktopLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/10 transition-colors duration-300">
      {navbar}
      <main className="pt-16 flex-1 flex flex-col">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center py-12">Loading...</div>}>
          <AnimatePresence mode="wait">
            {renderActiveViews()}
          </AnimatePresence>
        </Suspense>
      </main>
      {footer}
    </div>
  );
}
