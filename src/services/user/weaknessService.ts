
import { ExamEnvironment } from '../../types';

export type WeaknessTag = 
  | 'TENSE_ACCURACY' 
  | 'OPINION_JUSTIFICATION' 
  | 'VOCAB_RANGE' 
  | 'GRAMMAR_AGREEMENT' 
  | 'BULLET_POINT_COVERAGE' 
  | 'TRANSLATION_ACCURACY'
  | 'SENTENCE_COMPLEXITY'
  | 'LISTENING_COMPREHENSION'
  | string;

export interface AcademicInsight {
  tag: WeaknessTag;
  count: number;
  lastDetected: number;
  improvementTrend: number; // 0 to 1
}

export interface AcademicProfile {
  insights: Record<WeaknessTag, AcademicInsight>;
  sessionCount: number;
  gradeConfidence: number; // 0 to 1
  lastGrade: string;
  trainingGrades: number[];
  examGrades: number[];
  realismGap: number; // Discrepancy between training and exam grades
}

const STORAGE_KEY = 'vocariox-academic-profile';

export class WeaknessService {
  static getProfile(): AcademicProfile {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaults: AcademicProfile = {
      insights: {} as any,
      sessionCount: 0,
      gradeConfidence: 0,
      lastGrade: '1',
      trainingGrades: [],
      examGrades: [],
      realismGap: 0
    };
    return saved ? JSON.parse(saved) : defaults;
  }

  static trackFeedback(tags: WeaknessTag[], currentGrade: string, environment: ExamEnvironment = 'TRAINING') {
    const profile = this.getProfile();
    profile.sessionCount += 1;
    profile.lastGrade = currentGrade;
    
    // Parse grade to numeric for calculation
    const gradeNum = parseInt(currentGrade) || 1;
    if (environment === 'EXAM') {
      profile.examGrades.push(gradeNum);
    } else {
      profile.trainingGrades.push(gradeNum);
    }

    // Calculate Realism Gap
    if (profile.examGrades.length > 0 && profile.trainingGrades.length > 0) {
      const avgTraining = profile.trainingGrades.reduce((a, b) => a + b, 0) / profile.trainingGrades.length;
      const avgExam = profile.examGrades.reduce((a, b) => a + b, 0) / profile.examGrades.length;
      profile.realismGap = avgTraining - avgExam;
    }

    // Confidence grows with session count, but is penalized by a large realism gap
    const baseConfidence = Math.min(0.95, profile.sessionCount / 10);
    const gapPenalty = Math.max(0, profile.realismGap * 0.1);
    profile.gradeConfidence = Math.max(0.1, baseConfidence - gapPenalty);

    tags.forEach(tag => {
      if (!profile.insights[tag]) {
        profile.insights[tag] = { tag, count: 0, lastDetected: Date.now(), improvementTrend: 0 };
      }
      profile.insights[tag].count += 1;
      profile.insights[tag].lastDetected = Date.now();
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  static getTargetedPrompts(): string[] {
    const profile = this.getProfile();
    if (Object.keys(profile.insights).length === 0) return ["Complete your first writing exam to see insights."];

    const sorted = Object.values(profile.insights).sort((a, b) => b.count - a.count);
    const top = sorted[0];

    const recommendations: Record<WeaknessTag, string> = {
      TENSE_ACCURACY: "Your grades are limited by past/future tense errors. Practice mixed-tense prompts.",
      OPINION_JUSTIFICATION: "You often miss 'porque' justifications. Focus on 'Why' in your next 150-word task.",
      VOCAB_RANGE: "Try using synonyms for basic words like 'bueno' or 'muy'.",
      GRAMMAR_AGREEMENT: "Check your adjective-noun endings carefully in the 90-word task.",
      BULLET_POINT_COVERAGE: "You frequently lose 4-8 marks by skipping bullet points. Use a checklist approach.",
      TRANSLATION_ACCURACY: "Focus on exact phrasing in the translation task.",
      SENTENCE_COMPLEXITY: "Try joining two sentences with 'y', 'pero', or 'porque' more often."
    };

    return [recommendations[top.tag] || recommendations.TENSE_ACCURACY];
  }
}
