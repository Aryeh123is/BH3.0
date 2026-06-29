
export type ExamBoard = 'AQA' | 'Edexcel';
export type Tier = 'Foundation' | 'Higher';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type QuestionType = 'vocab' | 'grammar' | 'translation' | 'tense' | 'reading' | 'listening' | 'speaking' | 'photo_card' | 'roleplay';

export interface GCSEQuestion {
  id: string;
  examBoard: ExamBoard;
  tier: Tier;
  topic: string;
  subtopic?: string;
  difficulty?: Difficulty;
  type: QuestionType;
  question: string;
  answer: string;
  acceptableAnswers?: string[];
  explanation?: string;
  image?: string;
  audio?: string;
  marks: number;
  tags: string[];
}

export interface TopicWeakness {
  topic: string;
  accuracy: number;
  averageTime: number;
  timesSeen: number;
}

export interface ExamHistoryItem {
  id: string;
  date: number;
  language: string;
  type: string;
  score: number;
  total: number;
  avgTime: number;
  grade?: string;
  topics: string[];
}
