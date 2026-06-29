import { UserPaperResult, GlobalAnalytics, SubjectAnalytics, PaperBreakdownRow, RedoQueueItem } from '../types/pastPapers';
import { INITIAL_PAST_PAPERS, INITIAL_GRADE_BOUNDARIES } from '../data/pastPapersData';

export class ProgressionService {
  private static readonly GRADE_VALUES: Record<string, number> = {
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, 'U': 0
  };

  private static readonly REVERSE_GRADE_VALUES: Record<number, string> = {
    9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2', 1: '1', 0: 'U'
  };

  /**
   * Calculates global and subject-specific analytics from user results, including target comparison.
   */
  static calculateAnalytics(results: UserPaperResult[], targetGrades: Record<string, string> = {}): GlobalAnalytics {
    try {
      if (!results || results.length === 0) {
        return {
          overallReadiness: 0,
          latestResult: null,
          averageGrade: 'U',
          subjectBreakdown: {},
          performanceBreakdown: [],
          redoQueue: []
        };
      }

      const safeTargetGrades = targetGrades || {};
      const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp);
      const resultsBySubject: Record<string, UserPaperResult[]> = {};

      results.forEach(res => {
        if (!res || !res.paperId) return;
        const subject = this.extractSubjectFromId(res.paperId);
        if (!resultsBySubject[subject]) resultsBySubject[subject] = [];
        resultsBySubject[subject].push(res);
      });

      const subjectBreakdown: Record<string, SubjectAnalytics> = {};
      let totalReadiness = 0;
      let totalGradeValue = 0;

      const subjects = Object.entries(resultsBySubject);
      if (subjects.length === 0) {
        return {
          overallReadiness: 0,
          latestResult: sortedResults[0] || null,
          averageGrade: 'U',
          subjectBreakdown: {},
          performanceBreakdown: [],
          redoQueue: []
        };
      }

      subjects.forEach(([subject, subjectResults]) => {
        const sortedSubjectResults = [...subjectResults].sort((a, b) => a.timestamp - b.timestamp);
        const targetGrade = safeTargetGrades[subject];
        const analytics = this.calculateSubjectAnalytics(subject, sortedSubjectResults, targetGrade);
        subjectBreakdown[subject] = analytics;
        totalReadiness += analytics.readinessScore;
        totalGradeValue += this.GRADE_VALUES[analytics.averageGrade] || 0;
      });

      const performanceBreakdown = results.map(res => this.generateBreakdownRow(res, safeTargetGrades));
      const redoQueue = this.generateRedoQueue(performanceBreakdown);
      const nextBestAction = this.generateRecommendation(redoQueue, subjectBreakdown);
      const examCountdown = this.getExamCountdown();

      const subjectCount = subjects.length;

      return {
        overallReadiness: Math.round(totalReadiness / subjectCount),
        latestResult: sortedResults[0],
        averageGrade: this.REVERSE_GRADE_VALUES[Math.round(totalGradeValue / subjectCount)] || 'U',
        subjectBreakdown,
        performanceBreakdown,
        redoQueue,
        nextBestAction,
        examCountdown
      };
    } catch (error) {
      console.error("Progression Engine Error:", error);
      return {
        overallReadiness: 0,
        latestResult: null,
        averageGrade: 'U',
        subjectBreakdown: {},
        performanceBreakdown: [],
        redoQueue: []
      };
    }
  }

  private static calculateSubjectAnalytics(subject: string, results: UserPaperResult[], targetGrade?: string): SubjectAnalytics {
    const grades = results.map(r => this.GRADE_VALUES[r.grade] || 0);
    const avgGradeValue = grades.reduce((a, b) => a + b, 0) / grades.length;
    
    // Trend logic
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (results.length >= 2) {
      const recent = grades[grades.length - 1];
      const previous = grades[grades.length - 2];
      if (recent > previous) trend = 'improving';
      else if (recent < previous) trend = 'declining';
    }

    // Consistency (Variance)
    const variance = grades.length > 1 
      ? grades.reduce((a, b) => a + Math.pow(b - avgGradeValue, 2), 0) / grades.length
      : 0;
    const consistencyScore = Math.max(0, 100 - (variance * 20));

    // Readiness Score (Weighted)
    const recentGrade = grades[grades.length - 1] || 0;
    const readinessScore = Math.round(
      ((avgGradeValue / 9) * 40) + 
      ((recentGrade / 9) * 40) + 
      ((consistencyScore / 100) * 20)
    );

    const averageGrade = this.REVERSE_GRADE_VALUES[Math.round(avgGradeValue)] || 'U';
    
    let gradeGap: number | undefined;
    if (targetGrade) {
      gradeGap = (this.GRADE_VALUES[targetGrade] || 0) - (this.GRADE_VALUES[averageGrade] || 0);
    }

    return {
      subject,
      averageGrade,
      targetGrade,
      gradeGap,
      trend,
      readinessScore,
      consistencyScore: Math.round(consistencyScore),
      totalAttempts: results.length,
      recentScores: results.slice(-5).map(r => r.percentage),
      weakTopics: results.filter(r => (this.GRADE_VALUES[r.grade] || 0) < 5).length >= 3 ? ['Grammar', 'Vocabulary'] : []
    };
  }

  private static generateBreakdownRow(res: UserPaperResult, targetGrades: Record<string, string>): PaperBreakdownRow {
    const paper = INITIAL_PAST_PAPERS.find(p => p.paperId === res.paperId);
    const targetGrade = targetGrades[paper?.subject || ''] || '7'; // Default to 7 if not set
    const subject = paper?.subject || 'Unknown';

    const achievedValue = this.GRADE_VALUES[res.grade] || 0;
    const targetValue = this.GRADE_VALUES[targetGrade] || 0;
    const gradeGap = targetValue - achievedValue;

    // Calculate marks to next
    let marksToNextGrade = 0;
    const boundaryId = res.paperId.split('_').slice(0, 4).join('_');
    const boundaries = INITIAL_GRADE_BOUNDARIES.find(b => b.boundaryId === boundaryId);
    
    if (boundaries && res.grade !== '9') {
      const numericGrade = parseInt(res.grade);
      if (!isNaN(numericGrade)) {
        const nextGrade = (numericGrade + 1).toString();
        const nextThreshold = boundaries.boundaries[nextGrade];
        if (nextThreshold !== undefined) {
          marksToNextGrade = Math.max(0, nextThreshold - res.score);
        }
      }
    }

    // Priority Engine
    let priorityLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let recommendedAction = 'Maintain';

    if (gradeGap >= 3) {
      priorityLevel = 'HIGH';
      recommendedAction = 'Redo Immediately';
    } else if (gradeGap >= 1) {
      priorityLevel = 'MEDIUM';
      recommendedAction = 'Review Mistakes';
    }

    return {
      paperId: res.paperId,
      examBoard: paper?.examBoard || 'Unknown',
      subject,
      year: paper?.year || 2022,
      paperNumber: paper?.paperNumber || 1,
      score: res.score,
      totalMarks: paper?.totalMarks || 100,
      calculatedGrade: res.grade,
      targetGrade,
      gradeGap,
      marksToNextGrade,
      priorityLevel,
      recommendedAction
    };
  }

  private static generateRedoQueue(rows: PaperBreakdownRow[]): RedoQueueItem[] {
    return rows
      .filter(row => row.priorityLevel !== 'LOW')
      .sort((a, b) => {
        // 1. Largest grade gap
        if (b.gradeGap !== a.gradeGap) return b.gradeGap - a.gradeGap;
        // 2. Lowest relative score (percentage)
        return (a.score / a.totalMarks) - (b.score / b.totalMarks);
      })
      .map(row => {
        const paper = INITIAL_PAST_PAPERS.find(p => p.paperId === row.paperId);
        return {
          paperId: row.paperId,
          subject: row.subject,
          reason: row.gradeGap >= 3 ? 'Critical Gap detected' : 'Under Target Grade',
          priorityScore: row.gradeGap * 10,
          externalUrl: paper?.paperUrl || ''
        };
      });
  }

  private static generateRecommendation(redoQueue: RedoQueueItem[], breakdown: Record<string, SubjectAnalytics>): any {
    if (redoQueue.length > 0) {
      const urgent = redoQueue[0];
      return {
        action: `Redo ${urgent.subject} Paper`,
        description: `Your Grade Gap in ${urgent.subject} is critical. Re-attempting ${this.extractSubjectFromId(urgent.paperId)} will boost your readiness score fastest.`,
        priority: urgent.priorityScore >= 30 ? 'URGENT' : 'HIGH',
        paperId: urgent.paperId
      };
    }

    const weakestSubject = Object.entries(breakdown).sort((a, b) => a[1].readinessScore - b[1].readinessScore)[0];
    if (weakestSubject) {
      return {
        action: `Practice ${weakestSubject[0]}`,
        description: `${weakestSubject[0]} is currently your lowest performance area. Focus on structured topic review before another past paper.`,
        priority: 'STABLE'
      };
    }

    return {
      action: "Maintain Momentum",
      description: "You're consistently meeting or exceeding targets. Continue with regular review sessions.",
      priority: 'STABLE'
    };
  }

  private static getExamCountdown() {
    const examDate = new Date('2026-06-01T09:00:00Z');
    const today = new Date();
    const diff = examDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return {
      daysRemaining: Math.max(0, days),
      label: days <= 0 ? 'Exams Underway' : `${days} Days to GCSEs`
    };
  }

  public static extractSubjectFromId(paperId: string): string {
    const parts = paperId.split('_');
    return parts[1] || 'Unknown';
  }
}
