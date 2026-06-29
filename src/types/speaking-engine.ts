import { EXAM_RULES } from '../core/examRules';

export type TaskType = 'read_aloud' | 'photo_card' | 'roleplay' | 'conversation';

// ---------------------------------------------------------
// 1. SCHEMA MODELS (The rules engine)
// Defines logic and flow, NOT content.
// ---------------------------------------------------------

export interface ExamSectionSchema {
  id: string;
  type: TaskType;
  title: string;
  activeSeconds: number; // Active recording/interacting time
  showInPrep: boolean; // Whether the student can see this in the global 12m prep
  config: Record<string, any>; // Task specific configuration
}

export interface ExamBoardSchema {
  id: string;
  board: 'Edexcel' | 'AQA' | 'WJEC';
  level: 'GCSE' | 'A-Level';
  language: string;
  tier: 'Foundation' | 'Higher';
  globalPrepSeconds: number; // e.g., 720s for the whole prep phase
  sections: ExamSectionSchema[];
}

// ---------------------------------------------------------
// 2. CONTENT MODELS (The Content Bank)
// Flat structure with relation IDs for easy mapping.
// ---------------------------------------------------------

export interface BaseContent {
  id: string;
  themeId: string;
  language: string;
}

export interface ReadAloudContent extends BaseContent {
  passageText: string;
  followUpQuestionIds: string[]; // Refer to ConversationQuestion IDs
}

export interface PhotoCardContent extends BaseContent {
  imageUrl: string;
  imageUrls?: string[]; // Supporting variations
  studentPrompts: string[];
  examinerPrompts: string[]; 
  followUpQuestionIds: string[];
}

export interface RoleplayPrompt {
  id: string;
  text: string;
  isUnpredictable: boolean;
  isQuestionToExaminer: boolean;
}

export interface RoleplayContent extends BaseContent {
  scenarioPrompt: string;
  studentRole: string;
  examinerRole: string;
  prompts: RoleplayPrompt[];
}

export interface ConversationQuestion extends BaseContent {
  questionText: string;
  expectedKeywords?: string[]; // For future AI marking
}

export type AnyTaskContent = ReadAloudContent | PhotoCardContent | RoleplayContent | ConversationQuestion;

// ---------------------------------------------------------
// 3. ATTEMPT/SUBMISSION MODELS
// ---------------------------------------------------------

export interface TaskAnswer {
  sectionId: string;
  audioBlobUrl: string; // MVP: local object URL
  timestamp: string;
}

export const SPEAKING_FLOW = EXAM_RULES.SPEAKING.SEQUENCE;

export interface ResolvedTaskSnapshot {
  sectionId: string;
  type: TaskType;
  linkedSteps: string[];
  title: string;
  showInPrep: boolean;
  activeSeconds: number;
  content: any; // The locked content for the exam
  options?: any[]; // Used for photo card prep options
}

export interface SpeakingPaper {
  id: string;
  language: string;
  title: string;
  tier: 'Foundation' | 'Higher';
  schemaId: string;
  items: {
    readAloudId: string;
    roleplayId: string;
    photoCardOptionIds: string[]; // Usually 2 options for student to choose
    conversationThemes: string[]; // e.g. ["theme-1", "theme-2"]
  };
}

export type ExamEvent =
  | { type: 'TASK_RENDERED'; taskId: string; timestamp: string }
  | { type: 'RECORDING_STARTED'; taskId: string; timestamp: string }
  | { type: 'RECORDING_STOPPED'; taskId: string; timestamp: string; audioRef: string }
  | { type: 'FOLLOWUP_REVEALED'; taskId: string; questions: string[]; timestamp: string }
  | { type: 'ANSWER_SAVED'; taskId: string; audioBlobId: string; timestamp: string }
  | { type: 'PHASE_CHANGED'; from: string; to: string; timestamp: string };

export interface SessionProfile {
  examinerTone: 'formal' | 'encouraging' | 'strict';
  pacing: 'fast' | 'standard' | 'deliberate';
  humanityJitter: number; // 0-1 for randomness in timing and feedback
  strictnessOffset: number; // -5 to +5 mark variation
}

export interface ExamSession {
  sessionId: string;
  schemaId: string;
  selectedThemeId: string;
  selectedPhotoCardId?: string;
  resolvedTasks: ResolvedTaskSnapshot[];
  profile: SessionProfile;
  examState: 'setup' | 'prep' | 'exam' | 'completed';
  timestamps: {
    start?: string;
    prepEnd?: string;
    examEnd?: string;
  };
  hasExtraTime: boolean;
  userAnswerBuffer: TaskAnswer[];
  eventLog: ExamEvent[];
  transcriptSegments?: TranscriptSegment[];
}

export interface TranscriptSegment {
  segmentId: string;
  taskId: string;
  startTimestamp: string;
  endTimestamp: string;
  text: string;
  linkedEventIds: string[];
}

export interface AIEvaluationPayload {
  taskId: string;
  transcript: string;
  eventContext: ExamEvent[];
  timestampedSegments: TranscriptSegment[];
}

export type StudentMode = 'practice' | 'exam' | 'weakness';

export interface SkillBreakdown {
  vocabulary: string[];
  grammar: string[];
  pronunciation: string[];
}

export interface ExamCoachSummary {
  strength: string;
  keyWeakness: string;
  explanation: string;
  nextActionTaskId: string;
}

export interface SimplifiedMetrics {
  fluencyScore: number; // 0-100
  accuracyScore: number; // 0-100
  vocabularyRangeScore: number; // 0-100
}

export interface ReviewScheduleItem {
  taskId: string;
  themeId: string;
  scheduledForDate: string;
  intervalDays: number; // 2, 7, 14
}

export interface StudentProgress {
  userId: string;
  totalAttempts: number;
  examReadinessPercentage: number;
  estimatedGrade: string;
  coreMetrics: SimplifiedMetrics;
  nextBestTask: {
    taskId: string;
    themeId: string;
    reason: string;
  };
  spacedRepetitionQueue: ReviewScheduleItem[];
  recentGradeTrend: string[];
}

export interface SpeechMetrics {
  hesitationCount: number;
  fillerWordCount: number;
  wordsPerMinute: number;
  silenceTotalSeconds: number;
  pronunciationConfidence: number; // 0-1
}

export interface TaskMark {
  taskId: string;
  totalScore: number;
  criteria: {
    communication: number;
    fluency: number;
    pronunciation: number;
    range: number;
    accuracy: number;
  };
  feedback: string[];
  strengths: string[];
  improvements: string[];
  skillInsights?: SkillBreakdown;
  repeatedErrors?: string[];
  personalisedTarget?: string;
  speechMetrics?: SpeechMetrics;
}

export interface BenchmarkScript {
  taskId: string;
  transcript: string;
  expectedBand: number;
  examinerRationale: string;
}

export interface GroundTruthExample {
  examBoard: string;
  language: string;
  taskType: string;
  transcript: string;
  officialScore: number;
  gradeBand: number;
  examinerCommentary: string;
}

export interface CalibrationReport {
  averageDeviation: number;
  biasFlags: string[];
  confidenceScore: number;
}

export interface ExamMarkingResult {
  sessionId: string;
  totalScore: number;
  gradeEstimate: string;
  taskResults: TaskMark[];
  globalFeedback: string;
  calibrationReport?: CalibrationReport;
}

export interface ExamAttempt {
  id: string;
  sessionId?: string;
  schemaId: string;
  timestamp: string;
  selectedThemeId?: string; // Theme chosen by student
  hasExtraTime: boolean;
  mode?: StudentMode;
  answers: TaskAnswer[];
  eventLog?: ExamEvent[];
  transcriptSegments?: TranscriptSegment[];
  status: 'setup' | 'prep' | 'in_progress' | 'submitted' | 'marked';
  profile?: SessionProfile;
}

