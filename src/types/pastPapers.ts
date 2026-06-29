export interface PastPaper {
  paperId: string; // {examBoard}_{subject}_{tier}_{year}_{paperNumber}
  examBoard: string;
  subject: string;
  tier: 'Foundation' | 'Higher';
  year: number;
  paperNumber: number;
  totalMarks: number;
  paperUrl: string;
  markSchemeUrl: string;
  examinerReportUrl?: string;
  boundaries?: Record<string, number>;
}

export interface GradeBoundaries {
  boundaryId: string; // {examBoard}_{subject}_{tier}_{year}
  examBoard: string;
  subject: string;
  tier: string;
  year: number;
  boundaries: Record<string, number>; // Grade -> Mix Marks
}

export interface UserPaperResult {
  userId: string;
  paperId: string;
  score: number;
  percentage: number;
  grade: string;
  timestamp: number;
}

export interface SubjectAnalytics {
  subject: string;
  averageGrade: string;
  targetGrade?: string;
  gradeGap?: number;
  trend: 'improving' | 'stable' | 'declining';
  readinessScore: number;
  consistencyScore: number;
  totalAttempts: number;
  recentScores: number[];
  weakTopics: string[];
}

export interface PaperBreakdownRow {
  paperId: string;
  examBoard: string;
  subject: string;
  year: number;
  paperNumber: number;
  score: number;
  totalMarks: number;
  calculatedGrade: string;
  targetGrade: string;
  gradeGap: number;
  marksToNextGrade: number;
  priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export interface RedoQueueItem {
  paperId: string;
  subject: string;
  reason: string;
  priorityScore: number;
  externalUrl: string;
}

export interface GlobalAnalytics {
  overallReadiness: number;
  latestResult: UserPaperResult | null;
  averageGrade: string;
  subjectBreakdown: Record<string, SubjectAnalytics>;
  performanceBreakdown: PaperBreakdownRow[];
  redoQueue: RedoQueueItem[];
  nextBestAction?: {
    action: string;
    description: string;
    priority: 'URGENT' | 'HIGH' | 'STABLE';
    paperId?: string;
  };
  examCountdown?: {
    daysRemaining: number;
    label: string;
  };
}
