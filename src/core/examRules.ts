
/**
 * Vocariox GCSE Exam Central Rules
 * SINGLE SOURCE OF TRUTH for all exam constraints and validation logic.
 */

export const EXAM_RULES = {
  /**
   * Writing Exam Constraints
   */
  WRITING: {
    STRUCTURE: {
      TASK_90_WORD_COUNT: 1,
      TASK_150_WORD_COUNT: 1,
      TRANSLATION_COUNT: 1,
    },
    TIMER_MINUTES: {
      FOUNDATION: 60,
      HIGHER: 75,
    },
    // Prep time for Speaking (12 minutes standard)
    PREP_SECONDS: 720,
    // Rules for languages
    INSTRUCTION_LANGUAGE: {
      SPANISH: 'ENGLISH',
      FRENCH: 'ENGLISH',
      GERMAN: 'NATIVE',
      ARABIC: 'NATIVE',
      HEBREW: 'NATIVE',
    }
  },

  /**
   * Speaking Exam Constraints
   */
  SPEAKING: {
    PREP_SECONDS: 720,
    SEQUENCE: [
      "READ_ALOUD",
      "READ_ALOUD_FOLLOWUPS",
      "ROLEPLAY",
      "PHOTO_CARD_CHOICE",
      "PHOTO_CARD_FOLLOWUPS",
      "FREE_CONVERSATION"
    ],
    PHOTO_CARD: {
      FALLBACK_CHAIN: ['PRIMARY', 'SECONDARY', 'SVG_FALLBACK']
    },
    PACING_MODES: {
      FAST: { delay: 400, rate: 1.0 },
      STANDARD: { delay: 800, rate: 0.9 },
      DELIBERATE: { delay: 1200, rate: 0.75 }
    },
    EXAMINER: {
      STRICTNESS_RANGE: { MIN: -5, MAX: 5 },
      TONES: ['formal', 'encouraging', 'strict'] as const,
      PACINGS: ['fast', 'standard', 'deliberate'] as const
    }
  },

  SUPPORTED_LANGUAGES: ['Spanish', 'French', 'German', 'Arabic', 'Modern Hebrew'],

  /**
   * Global Difficulty & Pacing Model (Unified v3.8.6)
   */
  DIFFICULTY_MODEL: {
    STAGES: {
      EARLY: { 
        id: 'early', 
        name: 'Foundation & Scanning', 
        weight: 0.2, // First 20%
        cognitiveLoad: 'Low', 
        pressure: 'Low',
        description: 'Direct extraction and high-frequency vocabulary verification.'
      },
      MID: { 
        id: 'mid', 
        name: 'Application & Inference', 
        weight: 0.5, // Next 50%
        cognitiveLoad: 'Medium', 
        pressure: 'Medium',
        description: 'Low-inference tasks requiring connection of ideas and basic reasoning.'
      },
      FINAL: { 
        id: 'final', 
        name: 'Analysis & Persistence', 
        weight: 0.3, // Last 30%
        cognitiveLoad: 'High', 
        pressure: 'Extreme',
        description: 'Deep inference, ambiguous structures, and complex detail extraction under high fatigue.'
      }
    },
    // Cognitive mappings for equivalent effort calibration
    COGNITIVE_WEIGHTS: {
      READING: 'Inference + Detail Extraction',
      WRITING: 'Idea Generation + Grammatical Precision',
      SPEAKING: 'Real-time Fluency + Spontaneous Response',
      LISTENING: 'Auditory Recall + Deciphering Under Speed'
    }
  },

  /**
   * Reading & Listening Paper Constraints
   */
  PAPERS: {
    MAX_SECTIONS: 4,
    VALID_SECTIONS: [1, 2, 3, 4],
    MODES: {
      practice: { limit: 5, time: 0 },
      test: { limit: 15, time: 600 }, // 10 mins
      full: { limit: 30, time: 1800 } // 30 mins
    },
    LISTENING: {
      MAX_PLAYS: 2
    }
  },

  /**
   * Cross-Modal Marking Equilibrium (v3.8.7)
   */
  MARKING_EQUILIBRIUM: {
    EQUATION: 'FINAL GRADE = (COMPREHENSION + COMMUNICATION + ACCURACY + INFERENCE) NORMALISED ACROSS MODES',
    WEIGHTING: {
      READING: { comprehension: 0.7, inference: 0.3 },
      LISTENING: { comprehension: 0.7, inference: 0.3 },
      WRITING: { communication: 0.6, accuracy: 0.3, relevance: 0.1 },
      SPEAKING: { communication: 0.5, fluency: 0.2, accuracy: 0.3 }
    },
    CONSTRAINTS: {
       WRITING_COMMUNICATION_FLOOR: 4, 
       SPEAKING_ACCURACY_PENALTY: true, 
       LISTENING_DISTRACTOR_PARITY: true, 
       TRANSLATION_MEANING_FOCUS: true, 
    }
  },

  /**
   * Exam Integrity & Anti-Pattern Immunity (v3.8.8)
   */
  INTEGRITY_LAYER: {
    IMMUNITY_RULES: [
      'No structural phrasing repetition across sessions',
      'Non-linear question ordering relative to source material',
      'Semantically plausible distractors only',
      'Meaning prioritization over formulaic template usage'
    ],
    MODE_HARDENING: {
      READING: 'Question order must NOT mirror passage order. Use synonyms across papers.',
      LISTENING: 'Distractors must be distributed across the entire duration.',
      WRITING: 'Rotate bullet point cognitive demand (narrative/evaluative/reflective).',
      SPEAKING: 'Follow-up questions must dynamically shift direction based on response.'
    }
  },

  /**
   * Long-Term Stability & Calibration Mode (v3.8.9)
   */
  STABILITY_MODEL: {
    DECAY_PERIOD_MS: 7 * 24 * 60 * 60 * 1000, // 7 days decay focus
    TOPIC_EXPOSURE_GOAL: 0.20, // 20% per major theme group as target
    CALIBRATION_TOLERANCE: 0.15, // +/- 15% variance boundary
    THEMES: {
      IDENTITY: 'Identity & Culture',
      LOCAL: 'Local Area, Holiday & Travel',
      SCHOOL: 'School & Education',
      FUTURE: 'Future Aspirations & Career',
      GLOBAL: 'Global & Environmental Issues'
    },
    PACING_VARIANCE_LOCK: true
  },

  /**
   * Grading & Moderation Boundaries
   */
  GRADING: {
    BOUNDARIES: {
      '9': 90,
      '8': 80,
      '7': 70,
      '6': 60,
      '5': 50,
      '4': 40,
    },
    MODERATION_TOLERANCE: 1.01,   // +/- 1% tolerance for borderline cases
  }
};

/**
 * Utility to get the instruction language for a specific language
 * Edexcel Spanish/French instructions MUST be in English.
 */
export const getInstructionLanguage = (language: string): 'ENGLISH' | 'NATIVE' => {
  const lang = language.toLowerCase();
  if (lang === 'spanish' || lang === 'french') return 'ENGLISH';
  return 'NATIVE';
};

/**
 * Validates if a Writing paper meets the strict structure requirements
 * Exactly 1x90, 1x150, 1xTranslation
 */
export const validateWritingStructure = (tasks: any[]) => {
  const tasks90 = tasks.filter(t => t.type === '90-word').slice(0, EXAM_RULES.WRITING.STRUCTURE.TASK_90_WORD_COUNT);
  const tasks150 = tasks.filter(t => t.type === '150-word').slice(0, EXAM_RULES.WRITING.STRUCTURE.TASK_150_WORD_COUNT);
  const tasksTrans = tasks.filter(t => t.type === 'translation').slice(0, EXAM_RULES.WRITING.STRUCTURE.TRANSLATION_COUNT);
  return [...tasks90, ...tasks150, ...tasksTrans];
};

/**
 * Standard grade calculation based on percentage
 */
export const getEstimatedGrade = (percentage: number): string => {
  const b = EXAM_RULES.GRADING.BOUNDARIES;
  if (percentage >= b['9']) return '9';
  if (percentage >= b['8']) return '8';
  if (percentage >= b['7']) return '7';
  if (percentage >= b['6']) return '6';
  if (percentage >= b['5']) return '5';
  if (percentage >= b['4']) return '4';
  return '3';
};
