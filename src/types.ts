export interface Word {
  id: string;
  hebrew: string;
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
