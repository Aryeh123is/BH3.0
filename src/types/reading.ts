export type ExamEnvironment = 'TRAINING' | 'EXAM';

export type ReadingQuestionType = 
  | 'multiple_choice' 
  | 'match_up' 
  | 'short_answer' 
  | 'gap_fill' 
  | 'true_false' 
  | 'translation_sentence'
  | 'translation_passage'
  | 'heading_match' 
  | 'multi_select'
  | 'sequence_ordering'
  | 'word_bank'
  | 'table_completion';

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  prompt: string;
  marks: number;
  acceptedAnswers?: string[]; // For rule-based marking
  options?: string[]; // For multiple choice / match-up / multi-select / word bank
  pairs?: Record<string, string>; // For matching
  explanation?: string;
  sentenceNumber?: number; // For Foundation Section C
  context?: string; // Additional context or extract for sub-questions
  subQuestions?: ReadingQuestion[]; // For grouped tasks (Q3, Q5, Q6)
}

export interface ReadingSection {
  id: string;
  type: 'reading' | 'translation_sentences' | 'translation_passage';
  title: string;
  instructions: string;
  passage?: string; // Markdown supported
  passageSource?: string;
  questions: ReadingQuestion[];
  isDivider?: boolean; // For visual pacing
}

export interface ReadingPaper {
  id: string;
  language: string;
  tier: 'foundation' | 'higher';
  theme?: string;
  title: string;
  totalMarks: number;
  estimatedTime: number; // minutes
  sections: ReadingSection[];
  paperCode: string; // e.g. 1SP0/3H
}

export interface ReadingAnswer {
  questionId: string;
  sectionId: string;
  answer: string;
  marksAwarded: number;
  feedback?: string;
  isCorrect?: boolean;
}

export interface ReadingAttempt {
  paperId: string;
  language: string;
  tier: 'foundation' | 'higher';
  answers: Record<string, string>; // questionId -> answer
  results: ReadingAnswer[];
  totalScore: number;
  percentage: number;
  grade: string;
  startTime: number;
  endTime: number;
  environment: ExamEnvironment;
}
