export interface Word {
  id: string;
  hebrew?: string;
  spanish?: string;
  french?: string;
  german?: string;
  arabic?: string;
  english: string;
  transliteration?: string;
  category: string;
  frequency?: number;
}

export type MasteryLevel = 'new' | 'learning' | 'mastered';

export interface UserProgress {
  wordId: string;
  mastery: MasteryLevel;
  correctCount: number;
  incorrectCount: number;
  lastStudied: number;
  interval: number; // in days
  nextReview: number; // timestamp
}

export type QuestionType = 'multiple-choice' | 'written' | 'matching' | 'true-false';

export interface Question {
  word: Word;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

export interface CustomDeck {
  id: string;
  title: string;
  description?: string;
  words: Word[];
  createdAt: number;
  updatedAt: number;
}

export interface SRSSettings {
  algorithm: 'leitner' | 'sm2' | 'custom';
  newInterval: number; // in hours
  learningInterval: number; // in hours
  masteredInterval: number; // in hours
  dailyGoal?: number;
  advancedMode?: boolean; // Premium advanced spaced repetition mode
}

export interface UserPreferences {
  animationsEnabled: boolean;
  reducedMotion: boolean;
  extraTime?: boolean;
  flashcardBatchSize?: number;
  flashcardFrontSide?: 'hebrew' | 'english' | 'foreign';
  lastLanguage?: string;
  theme?: 'light' | 'dark';
  microphoneAlwaysOn?: boolean;
  audioAutoplay?: boolean;
  preferredVoices?: Record<string, string>;
  useCloudVoices?: boolean;
  cloudVoices?: Record<string, string>;
  ttsVolume?: number;
}

export interface SetTextWord {
  text: string;
  translation: string;
  notes?: string;
  lemma?: string;
}

export interface SetTextVerse {
  id: string;
  verseNumber: number;
  hebrewText: string;
  englishTranslation: string;
  words: SetTextWord[];
}

export interface SetTextChapter {
  id: string;
  title: string;
  verses: SetTextVerse[];
}

export interface SetText {
  id: string;
  title: string;
  language: string;
  chapters: SetTextChapter[];
}

export type ExamEnvironment = 'TRAINING' | 'EXAM';

export interface ShopDocument {
  id: string;
  title: string;
  description: string;
  content?: string; // Optional Markdown content
  pages?: string[]; // Array of image URLs for "PDF" style viewing
  language: string;
  price: number;
  createdAt: number;
  authorId?: string;
  bought?: boolean;
}
