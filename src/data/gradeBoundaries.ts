
export type GradeSystem = '9-1' | 'A*-G' | 'Pass-Fail';

export type BoundaryData = Record<string, number>;

export interface GradingScale {
  system: GradeSystem;
  grades: string[]; // Ordered high to low, e.g. ["9", "8", ..., "1"]
}

export interface BaseBoundaryEntry {
  id: string;
  examBoard: 'Edexcel' | 'AQA' | 'OCR' | 'WJEC';
  subject: string;
  year: string;
  tier: 'Foundation' | 'Higher' | 'Not Tiered';
  name: string;
  maxMarks: number;
  boundaries: BoundaryData;
  gradingScale: GradingScale;
}

export interface ComponentBoundary extends BaseBoundaryEntry {
  type: 'component';
  componentCode?: string;
  weighting?: number; // e.g. 0.5 for 50%
  parentQualificationId?: string;
}

export interface QualificationBoundary extends BaseBoundaryEntry {
  type: 'qualification';
  components: string[]; // List of component IDs
}

export type GradeEntry = ComponentBoundary | QualificationBoundary;

const GCSE_91_SCALE: GradingScale = {
  system: '9-1',
  grades: ['9', '8', '7', '6', '5', '4', '3', '2', '1']
};

export const GRADE_BOUNDARIES_DB: GradeEntry[] = [
  {
    id: 'biblical-hebrew-2022-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Paper 1: Reading & Writing',
    maxMarks: 100,
    weighting: 0.5,
    boundaries: {
      '9': 68, '8': 62, '7': 56, '6': 48, '5': 41, '4': 34, '3': 25
    },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'biblical-hebrew-2022-p2-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Paper 2: Translation & Composition',
    maxMarks: 100,
    weighting: 0.5,
    boundaries: {
      '9': 70, '8': 64, '7': 58, '6': 50, '5': 42, '4': 35, '3': 26
    },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'biblical-hebrew-2022-overall-H',
    type: 'qualification',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Overall Qualification',
    maxMarks: 200,
    boundaries: {
      '9': 138, '8': 126, '7': 114, '6': 98, '5': 83, '4': 69, '3': 51
    },
    gradingScale: GCSE_91_SCALE,
    components: ['biblical-hebrew-2022-p1-H', 'biblical-hebrew-2022-p2-H']
  },
  // Edexcel Spanish (1SP0) 2025 (Estimates)
  {
    id: 'spanish-2025-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 21, '4': 16, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2025-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 27, '5': 22, '4': 17, '3': 12 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2025-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 51, '8': 45, '7': 40, '6': 34, '5': 29, '4': 24, '3': 19 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel French (1FR0) 2025 (Estimates)
  {
    id: 'french-2025-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 26, '5': 20, '4': 14, '3': 9 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2025-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 44, '8': 39, '7': 34, '6': 28, '5': 22, '4': 16, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2025-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 53, '8': 47, '7': 42, '6': 36, '5': 31, '4': 26, '3': 21 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel Spanish (1SP0) 2024
  {
    id: 'spanish-2024-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 26, '5': 21, '4': 16, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2024-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 27, '5': 22, '4': 17, '3': 12 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2024-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 51, '8': 45, '7': 40, '6': 34, '5': 29, '4': 24, '3': 19 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel Spanish (1SP0) 2023
  {
    id: 'spanish-2023-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 40, '8': 35, '7': 30, '6': 25, '5': 20, '4': 15, '3': 10 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2023-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 43, '8': 38, '7': 33, '6': 27, '5': 21, '4': 16, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'spanish-2023-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 52, '8': 46, '7': 41, '6': 35, '5': 30, '4': 25, '3': 20 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel French (1FR0) 2024 Higher
  {
    id: 'french-2024-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 42, '8': 37, '7': 32, '6': 26, '5': 20, '4': 14, '3': 9 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2024-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 44, '8': 39, '7': 34, '6': 28, '5': 22, '4': 16, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2024-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 53, '8': 47, '7': 42, '6': 36, '5': 31, '4': 26, '3': 21 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel French (1FR0) 2023 Higher
  {
    id: 'french-2023-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 41, '8': 36, '7': 31, '6': 25, '5': 19, '4': 13, '3': 8 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2023-p3-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 50,
    boundaries: { '9': 45, '8': 40, '7': 35, '6': 29, '5': 23, '4': 17, '3': 12 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'french-2023-p4-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 54, '8': 48, '7': 43, '6': 37, '5': 32, '4': 27, '3': 22 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA German (8668) 2024 Estimates
  {
    id: 'german-2024-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'German',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 39, '8': 34, '7': 29, '6': 24, '5': 19, '4': 15, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA German (8668) 2023
  {
    id: 'german-2023-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'German',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 38, '8': 33, '7': 28, '6': 23, '5': 18, '4': 14, '3': 10 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel Spanish (1SP0) 2019 (For 2020 Fallback)
  {
    id: 'spanish-2019-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Spanish',
    year: '2019',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 38, '8': 33, '7': 28, '6': 23, '5': 18, '4': 13, '3': 8 },
    gradingScale: GCSE_91_SCALE
  },
  // Edexcel French (1FR0) 2019 (For 2020 Fallback)
  {
    id: 'french-2019-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'French',
    year: '2019',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 39, '8': 34, '7': 29, '6': 24, '5': 19, '4': 14, '3': 9 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA Modern Hebrew (8658) 2025 Estimates (Baseline 2024)
  {
    id: 'modern-hebrew-2025-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 38, '8': 33, '7': 28, '6': 24, '5': 20, '4': 16, '3': 12 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2025-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 52, '8': 46, '7': 40, '6': 33, '5': 27, '4': 21, '3': 15 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2025-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2025',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 48, '8': 42, '7': 36, '6': 31, '5': 26, '4': 21, '3': 16 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA Modern Hebrew (8658) 2024 Higher Estimates
  {
    id: 'modern-hebrew-2024-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 38, '8': 33, '7': 28, '6': 24, '5': 20, '4': 16, '3': 12 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2024-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 52, '8': 46, '7': 40, '6': 33, '5': 27, '4': 21, '3': 15 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2024-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2024',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 48, '8': 42, '7': 36, '6': 31, '5': 26, '4': 21, '3': 16 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA Modern Hebrew (8658) 2023 Higher Estimates
  {
    id: 'modern-hebrew-2023-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 37, '8': 32, '7': 27, '6': 23, '5': 19, '4': 15, '3': 11 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2023-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 51, '8': 45, '7': 39, '6': 34, '5': 29, '4': 24, '3': 19 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2023-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2023',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 49, '8': 43, '7': 37, '6': 32, '5': 27, '4': 22, '3': 17 },
    gradingScale: GCSE_91_SCALE
  },
  // 2022 (Used for 2021)
  {
    id: 'modern-hebrew-2022-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 35, '8': 30, '7': 25, '6': 21, '5': 17, '4': 13, '3': 9 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2022-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 48, '8': 42, '7': 36, '6': 30, '5': 24, '4': 19, '3': 14 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2022-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2022',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 44, '8': 38, '7': 33, '6': 28, '5': 23, '4': 18, '3': 13 },
    gradingScale: GCSE_91_SCALE
  },
  // 2019 (Used for 2020)
  {
    id: 'modern-hebrew-2019-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2019',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 39, '8': 34, '7': 29, '6': 23, '5': 18, '4': 13, '3': 8 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2019-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2019',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 51, '8': 45, '7': 39, '6': 33, '5': 27, '4': 21, '3': 15 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2019-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2019',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 48, '8': 42, '7': 36, '6': 31, '5': 26, '4': 21, '3': 16 },
    gradingScale: GCSE_91_SCALE
  },
  // AQA Modern Hebrew (8658) 2018 Estimates
  {
    id: 'modern-hebrew-2018-p1-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2018',
    tier: 'Higher',
    name: 'Paper 1: Listening',
    maxMarks: 50,
    boundaries: { '9': 38, '8': 33, '7': 28, '6': 23, '5': 18, '4': 13, '3': 8 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2018-p3-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2018',
    tier: 'Higher',
    name: 'Paper 3: Reading',
    maxMarks: 60,
    boundaries: { '9': 50, '8': 44, '7': 39, '6': 33, '5': 27, '4': 21, '3': 15 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'modern-hebrew-2018-p4-H',
    type: 'component',
    examBoard: 'AQA',
    subject: 'Modern Hebrew',
    year: '2018',
    tier: 'Higher',
    name: 'Paper 4: Writing',
    maxMarks: 60,
    boundaries: { '9': 47, '8': 41, '7': 35, '6': 30, '5': 25, '4': 20, '3': 15 },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'biblical-hebrew-2020-p1-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    year: '2020',
    tier: 'Higher',
    name: 'Paper 1: Reading & Writing',
    maxMarks: 100,
    weighting: 0.5,
    boundaries: {
      '9': 65, '8': 59, '7': 53, '6': 45, '5': 38, '4': 31, '3': 22
    },
    gradingScale: GCSE_91_SCALE
  },
  {
    id: 'biblical-hebrew-2020-p2-H',
    type: 'component',
    examBoard: 'Edexcel',
    subject: 'Biblical Hebrew',
    year: '2020',
    tier: 'Higher',
    name: 'Paper 2: Translation & Composition',
    maxMarks: 100,
    weighting: 0.5,
    boundaries: {
      '9': 67, '8': 61, '7': 55, '6': 47, '5': 40, '4': 33, '3': 24
    },
    gradingScale: GCSE_91_SCALE
  }
];
