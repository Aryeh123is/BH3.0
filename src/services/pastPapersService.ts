import { PastPaper, GradeBoundaries, UserPaperResult } from '../types/pastPapers';

export class PastPapersService {
  /**
   * Generates a deterministic Paper ID
   * Format: {examBoard}_{subject}_{tier}_{year}_P{paperNumber}
   */
  static generatePaperId(board: string, subject: string, tier: string, year: number, number: number): string {
    return `${board}_${subject}_${tier}_${year}_P${number}`.replace(/\s+/g, '_').toUpperCase();
  }

  /**
   * Generates a deterministic Boundary ID
   * Format: {examBoard}_{subject}_{tier}_{year}
   */
  static generateBoundaryId(board: string, subject: string, tier: string, year: number): string {
    return `${board}_${subject}_${tier}_${year}`.replace(/\s+/g, '_').toUpperCase();
  }

  /**
   * Calculates the grade based on boundaries
   */
  static calculateGrade(score: number, boundaries: Record<string, number>): {
    grade: string;
    nextGrade: string | null;
    marksToNext: number | null;
    marksToGradeAboveNext: number | null;
  } {
    // Sort boundaries by marks descending (e.g. 9, 8, 7...)
    const sortedGrades = Object.entries(boundaries).sort((a, b) => b[1] - a[1]);
    
    let currentGrade = 'U';
    let nextGradeIdx = -1;

    for (let i = 0; i < sortedGrades.length; i++) {
      const [grade, minMarks] = sortedGrades[i];
      if (score >= minMarks) {
        currentGrade = grade;
        nextGradeIdx = i - 1; // The one better than current
        break;
      }
      // If we haven't found a grade yet, the lowest grade is still ahead
      nextGradeIdx = i;
    }

    const nextGradeEntry = nextGradeIdx >= 0 ? sortedGrades[nextGradeIdx] : null;
    const gradeAboveNextEntry = (nextGradeIdx - 1) >= 0 ? sortedGrades[nextGradeIdx - 1] : null;

    return {
      grade: currentGrade,
      nextGrade: nextGradeEntry ? nextGradeEntry[0] : null,
      marksToNext: nextGradeEntry ? nextGradeEntry[1] - score : null,
      marksToGradeAboveNext: gradeAboveNextEntry ? gradeAboveNextEntry[1] - score : null
    };
  }
}
