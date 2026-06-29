import React, { useEffect, useState, lazy, Suspense } from 'react';

const MobileLayout = lazy(() => import('../mobile/MobileLayout').then(m => ({ default: m.MobileLayout })));
const DesktopLayout = lazy(() => import('./desktop/DesktopLayout').then(m => ({ default: m.DesktopLayout })));

export const componentMeta = {
  mobileSafe: true,
  desktopOnly: false,
  studyModeSafe: true
};

export const FEATURE_FLAGS = {
  mobileHardOverride: true,
  studyModeIsolation: true,
  mobileCompressionV2: true
};

interface AppLayoutControllerProps {
  isMobile: boolean;
  isFlashcardForceMobile: boolean;
  view: string;
  isTransitioning: boolean;
  onResetSystem: () => void;
  renderActiveViews: () => React.ReactNode;
  navbar: React.ReactNode;
  bottomNav: React.ReactNode;
  footer: React.ReactNode;
  flashcardNode: React.ReactNode;
}

export function AppLayoutController({
  isMobile,
  isFlashcardForceMobile,
  view,
  isTransitioning,
  onResetSystem,
  renderActiveViews,
  navbar,
  bottomNav,
  footer,
  flashcardNode
}: AppLayoutControllerProps) {
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const isProd = process.env.NODE_ENV === 'production' || !(import.meta as any).env?.DEV;

  // Runtime DOM Validation Layer (CRITICAL)
  useEffect(() => {
    let timer: any;
    
    const scanDOM = () => {
      // If the mobile override flag is disabled, we bypass checks to facilitate zero-loss emergency rollback
      if (!FEATURE_FLAGS.mobileHardOverride) {
        return;
      }

      let violationDetected = false;
      let reason = '';

      if (isMobile) {
        // Assert no DesktopLayout or Sidebar exists
        const sidebar = document.querySelector('[data-role="sidebar"]') || 
                        document.querySelector('.sidebar') || 
                        document.getElementById('sidebar');
        if (sidebar) {
          violationDetected = true;
          reason = "Sidebar detected in mobile mode!";
        }

        // Assert no desktop-only tagged components leaked
        const desktopOnly = document.querySelector('[data-desktop-only="true"]');
        if (desktopOnly) {
          violationDetected = true;
          reason = "Desktop component leaked into mobile runtime!";
        }

        // Assert that no DesktopGrid layouts exist (e.g. grid-cols-4 or grid-cols-5 raw desktop leaks)
        // Standard compact mobile layout grids (cols <= 3) are perfectly safe and intentional under mobile-first guidelines
        const allGridElements = document.querySelectorAll('[class*="grid-cols-"]');
        allGridElements.forEach((el) => {
          const classList = Array.from(el.classList);
          classList.forEach((cls) => {
            const match = cls.match(/^grid-cols-(\d+)$/);
            if (match) {
              const cols = parseInt(match[1], 10);
              if (cols > 3) {
                // Large desktop grids matched without screen media-query suffixes
                violationDetected = true;
                reason = `Desktop multi-column grid layout (${cls}) detected in mobile mode!`;
              }
            }
          });
        });
      }

      // Handle custom checks (e.g., strict exam mode vs nav)
      const isStrictExamMode = ['listeningExam', 'speakingMode', 'readingExam', 'writingExam', 'genericExam'].includes(view);
      if (isStrictExamMode) {
        const hasNavbar = document.getElementById('navbar') || document.querySelector('nav');
        if (hasNavbar) {
          violationDetected = true;
          reason = "Universal navigation detected during focused GCSE Mock Exam Conditions!";
        }
      }

      if (violationDetected) {
        if (!isProd) {
          console.error(`[DEV ARCHITECTURE WARNING]: ${reason}`);
        } else {
          console.warn(`[PRODUCTION LAYOUT MONITOR]: ${reason}`);
        }
      }
    };

    // Perform validation check slightly post-mount/transition
    timer = setTimeout(scanDOM, 150);

    const observer = new MutationObserver(() => {
      scanDOM();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isMobile, view, isProd, onResetSystem]);

  // If fallback mode is triggered, render null/minimal to thoroughly unmount old trees
  if (isFallbackMode || isTransitioning) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-950 text-white min-h-screen w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Synchronizing Viewports...</p>
        </div>
      </div>
    );
  }

  // Priority 1: Study Mode Override Priority (CRITICAL UX RULE)
  // When study mode is active:
  // - ALL navigation is removed
  // - ALL layout wrapper classes/components are bypassed
  // - ONLY the study/exam component renders at root level
  // - 100dvh full-screen fixed layout
  const isStudyMode = [
    'listeningExam',
    'speakingMode',
    'readingExam',
    'writingExam',
    'genericExam',
    'setTextStudy'
  ].includes(view);
  
  if (isStudyMode) {
    return (
      <div 
        id="study-mode-root"
        className="fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white z-50 overflow-hidden flex flex-col md:relative md:h-screen"
        data-study-mode-safe="true"
        style={{ height: '100dvh' }}
      >
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center bg-slate-950 text-white min-h-screen">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        }>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderActiveViews()}
          </div>
        </Suspense>
      </div>
    );
  }

  // Priority 2: Device-Based Layout Branching
  // Zero dual-layout rendering, completely unmount inactive layout with lazy loading Suspense guard for bundle isolation
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {isMobile && FEATURE_FLAGS.mobileHardOverride ? (
        <MobileLayout 
          navbar={navbar}
          bottomNav={bottomNav}
          view={view}
          renderActiveViews={renderActiveViews}
          footer={footer}
        />
      ) : (
        <DesktopLayout 
          navbar={navbar}
          footer={footer}
          view={view}
          renderActiveViews={renderActiveViews}
        />
      )}
    </Suspense>
  );
}
