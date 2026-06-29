/**
 * Automated Layout Test Contract Runner
 * 
 * Verifies key layout constraints of the Mobile-First Hard Override system.
 */

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message: string;
}

export function runLayoutContractTests(isMobile: boolean, view: string): TestResult[] {
  const results: TestResult[] = [];

  const assert = (suite: string, name: string, condition: boolean, failMessage: string) => {
    results.push({
      suite,
      name,
      passed: condition,
      message: condition ? 'Assertion passed successfully.' : failMessage
    });
  };

  // 1. MOBILE MODE TEST
  if (isMobile) {
    const suiteName = 'MOBILE_MODE_TEST';
    
    // Assert no DesktopLayout nodes or desktop-only flagged components exist in DOM
    const hasDesktopOnly = document.querySelector('[data-desktop-only="true"]') !== null;
    assert(suiteName, 'Assert no desktop-only elements exist', !hasDesktopOnly, 'Found desktop-only elements mounted inside mobile DOM.');

    // Assert Sidebar does not exist
    const hasSidebar = document.querySelector('[data-role="sidebar"]') !== null || 
                         document.querySelector('.sidebar') !== null || 
                         document.getElementById('sidebar') !== null;
    assert(suiteName, 'Assert Sidebar is unmounted', !hasSidebar, 'Sidebar element leaked and was found inside mobile render tree!');

    // Assert BottomNav exists
    const bottomNav = document.getElementById('bottom-nav') || document.querySelector('[data-role="bottom-nav"]');
    // BottomNav might only render on specific views (not flashcards)
    if (view !== 'flashcards') {
      assert(suiteName, 'Assert BottomNav exists on mobile views', bottomNav !== null, 'Bottom navigation bar is missing from mobile view.');
    }
  }

  // 2. STUDY MODE TEST
  if (view === 'flashcards') {
    const suiteName = 'STUDY_MODE_TEST';

    // Assert only FlashcardMode root is mounted (using #study-mode-root wrapper)
    const studyRoot = document.getElementById('study-mode-root');
    assert(suiteName, 'Assert only FlashcardMode root is mounted', studyRoot !== null, 'FlashcardMode root wrapper is not detected or mounted.');

    // Assert Navbar is unmounted
    const navbar = document.getElementById('navbar') || document.querySelector('nav');
    assert(suiteName, 'Assert Navbar is unmounted in Study Mode', navbar === null, 'Universal Navbar remained mounted during focal Study Mode.');

    // Assert Footer is unmounted
    const footer = document.querySelector('footer');
    assert(suiteName, 'Assert Footer is unmounted in Study Mode', footer === null, 'Universal Footer remained mounted during focal Study Mode.');

    // Assert fixed full-screen layout active
    const isFullscreen = studyRoot?.classList.contains('fixed') && studyRoot?.classList.contains('inset-0');
    assert(suiteName, 'Assert fixed full-screen layout is active', isFullscreen === true, 'Study Mode root container is not set to a modal fixed full-screen layout wrapper.');
  }

  return results;
}
