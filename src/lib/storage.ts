export const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e instanceof DOMException && (
        e.code === 22 || 
        e.code === 1014 || 
        e.name === 'QuotaExceededError' || 
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        console.warn('LocalStorage quota exceeded. Attempting to clear non-essential data...');
        // Clear session states but keep progress
        Object.keys(localStorage).forEach(k => {
          if (k.includes('session-state') || k.includes('flashcard-session')) {
            localStorage.removeItem(k);
          }
        });
        // Try again once
        try {
          localStorage.setItem(key, value);
        } catch (retryError) {
          console.error('Failed to save to localStorage even after clearing session data:', retryError);
        }
      } else {
        console.error('Error saving to localStorage:', e);
      }
    }
  },
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};
