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
}

export type QuestionType = 'multiple-choice' | 'written';

export interface Question {
  word: Word;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}
