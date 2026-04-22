export interface Word {
  id: string;
  hebrew?: string;
  spanish?: string;
  french?: string;
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
}

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
