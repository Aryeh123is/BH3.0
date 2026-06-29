
import { EXAM_RULES } from '../core/examRules';

interface PaperUsage {
  paperId: string;
  lastUsed: number;
  useCount: number;
  theme: string;
}

export class CalibrationService {
  private static STORAGE_KEY = 'vocariox_paper_usage';
  
  static getUsageHistory(): Record<string, PaperUsage> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  static trackUsage(paperId: string, theme: string) {
    const history = this.getUsageHistory();
    const now = Date.now();
    
    if (!history[paperId]) {
      history[paperId] = {
        paperId,
        lastUsed: now,
        useCount: 1,
        theme
      };
    } else {
      history[paperId].lastUsed = now;
      history[paperId].useCount += 1;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Selection Logic: Difficulty Equilibrium & Decay Control
   */
  static getWeightedSelection<T extends { id: string, theme?: string }>(items: T[]): T[] {
    const history = this.getUsageHistory();
    const now = Date.now();
    const decayThreshold = EXAM_RULES.STABILITY_MODEL.DECAY_PERIOD_MS;

    // Calculate theme frequencies
    const themeCounts: Record<string, number> = {};
    Object.values(history).forEach(usage => {
      themeCounts[usage.theme] = (themeCounts[usage.theme] || 0) + usage.useCount;
    });

    const sorted = [...items].sort((a, b) => {
      const usageA = history[a.id];
      const usageB = history[b.id];

      // 1. Absolute Freshness: Never used items come first
      if (!usageA && usageB) return -1;
      if (usageA && !usageB) return 1;

      // 2. Decay State: If used within the decay period, deprioritize heavily
      if (usageA && usageB) {
        const isDecayedA = (now - usageA.lastUsed) < decayThreshold;
        const isDecayedB = (now - usageB.lastUsed) < decayThreshold;

        if (isDecayedA && !isDecayedB) return 1;
        if (!isDecayedA && isDecayedB) return -1;

        // 3. Frequency Balancing: Least used items first
        if (usageA.useCount !== usageB.useCount) {
          return usageA.useCount - usageB.useCount;
        }

        // 4. Topic Fatigue: Deprioritize overexposed themes
        if (a.theme && b.theme) {
          const themeExpA = themeCounts[a.theme] || 0;
          const themeExpB = themeCounts[b.theme] || 0;
          if (themeExpA !== themeExpB) return themeExpA - themeExpB;
        }
      }

      // Final shuffle jitter
      return Math.random() - 0.5;
    });

    return sorted;
  }

  /**
   * Variance Guard: Ensures session difficulty doesn't swing too much
   */
  static applyVarianceLock(baseScore: number): number {
    if (!EXAM_RULES.STABILITY_MODEL.PACING_VARIANCE_LOCK) return baseScore;
    
    // Clamp variance within controlled boundaries
    const tolerance = EXAM_RULES.STABILITY_MODEL.CALIBRATION_TOLERANCE;
    const lower = 1 - tolerance;
    const upper = 1 + tolerance;
    
    // Logic to prevent "Unintended Difficulty Creep"
    // (Essentially a damping function for outlier performance)
    return Math.min(Math.max(baseScore, lower), upper);
  }
}
