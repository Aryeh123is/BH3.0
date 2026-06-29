
import { GradeEntry, GRADE_BOUNDARIES_DB, ComponentBoundary } from '../data/gradeBoundaries';

export interface HigherGradeTarget {
  grade: string;
  marksNeeded: number;
}

export interface GradeResult {
  grade: string;
  isEstimated: boolean;
  marks: number;
  maxMarks: number;
  percentage: number;
  boundaryType: 'component' | 'qualification';
  marksAboveBoundary: number;
  nextGrade: HigherGradeTarget | null;
  higherGrades: HigherGradeTarget[];
  progressToNext: number; // Percent progress towards next grade (0-100)
}

export const getGradeBoundaries = (subject: string, year: string, paperId: string, tier: string): GradeEntry | undefined => {
  const normalizedTier = tier === 'H' ? 'Higher' : tier === 'F' ? 'Foundation' : 'Not Tiered';
  
  // Year Fallbacks for COVID years (all subjects)
  let lookupYear = year;
  if (year === '2021') lookupYear = '2022';
  if (year === '2020') lookupYear = '2019';

  return GRADE_BOUNDARIES_DB.find(entry => 
    entry.subject.toLowerCase() === subject.toLowerCase() &&
    entry.year === lookupYear &&
    entry.tier === normalizedTier &&
    (entry.id.includes(paperId.toLowerCase()) || entry.name.includes(paperId))
  );
};

export const calculateGrade = (mark: number, entry: GradeEntry): GradeResult => {
  const { boundaries, gradingScale, maxMarks, type } = entry;
  const { grades } = gradingScale;
  
  const percentage = Math.round((mark / maxMarks) * 100);
  let currentGrade = 'U';
  let marksAboveBoundary = 0;

  // Find current grade (loop high to low)
  for (const grade of grades) {
    const boundary = boundaries[grade];
    if (boundary !== undefined && mark >= boundary) {
      currentGrade = grade;
      marksAboveBoundary = mark - boundary;
      break;
    }
  }

  const higherGrades: HigherGradeTarget[] = [];
  let nextGrade: HigherGradeTarget | null = null;

  // Find all higher grades (loop low to high starting from current)
  // Actually easier to just filter the scale's grades
  const currentGradeIndex = grades.indexOf(currentGrade);
  const gradesToEvaluate = currentGradeIndex === -1 
    ? [...grades].reverse() // If U, check all
    : grades.slice(0, currentGradeIndex).reverse(); // If 4, check 5,6,7,8,9

  for (const grade of gradesToEvaluate) {
    const boundary = boundaries[grade];
    if (boundary !== undefined && boundary > mark) {
      const marksNeeded = boundary - mark;
      higherGrades.unshift({ grade, marksNeeded });
      
      if (!nextGrade) {
        nextGrade = { grade, marksNeeded };
      }
    }
  }

  // Calculate progress to next grade
  let progressToNext = 0;
  if (nextGrade) {
    const nextGradeBoundary = boundaries[nextGrade.grade] || 0;
    const currentGradeBoundary = currentGrade === 'U' ? 0 : (boundaries[currentGrade] || 0);
    const range = nextGradeBoundary - currentGradeBoundary;
    if (range > 0) {
      progressToNext = Math.min(100, Math.round(((mark - currentGradeBoundary) / range) * 100));
    }
  } else if (currentGrade === grades[0]) {
    progressToNext = 100; // Already at top grade
  }

  return {
    grade: currentGrade,
    isEstimated: type === 'component',
    marks: mark,
    maxMarks,
    percentage,
    boundaryType: type,
    marksAboveBoundary,
    nextGrade,
    higherGrades,
    progressToNext
  };
};
