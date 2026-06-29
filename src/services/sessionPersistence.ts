
/**
 * Vocariox Session Persistence Service (v3.9.6)
 * Handles exam state recovery across refreshes, tab switches, and crashes.
 */

interface PersistedSession {
  examId: string;
  type: 'listening' | 'speaking' | 'reading' | 'writing';
  startTimestamp: number; // Date.now()
  totalDurationSeconds: number;
  userAnswers: Record<string, string>;
  currentSection?: string;
  currentIndex?: number;
  meta?: any;
}

export class SessionPersistence {
  private static STORAGE_KEY = 'vocariox_active_session';

  /**
   * Saves the current exam progress
   */
  static saveSession(session: PersistedSession) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error("Session Persistence Error:", e);
    }
  }

  /**
   * Retrieves the current exam session if it exists and hasn't expired
   */
  static getSession(type: string, maxAgeMinutes: number = 60): PersistedSession | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const session: PersistedSession = JSON.parse(data);
      
      // Check if it's the right type
      if (session.type !== type) return null;

      // Check expiry
      const ageMs = Date.now() - session.startTimestamp;
      if (ageMs > maxAgeMinutes * 60 * 1000) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clears the current session (on completion or explicit exit)
   */
  static clearSession() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Calculates the remaining time based on start timestamp
   */
  static calculateRemainingTime(session: PersistedSession): number {
    const elapsedSeconds = Math.floor((Date.now() - session.startTimestamp) / 1000);
    const remaining = session.totalDurationSeconds - elapsedSeconds;
    return Math.max(0, remaining);
  }
}
