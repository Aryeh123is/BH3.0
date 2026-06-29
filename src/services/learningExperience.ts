import { TaskMark, ExamMarkingResult, ExamCoachSummary, SimplifiedMetrics, ReviewScheduleItem } from '../types/speaking-engine';

/**
 * Provides a unified, single coaching summary to reduce cognitive overload.
 */
export function generateExamCoachSummary(result: ExamMarkingResult): ExamCoachSummary {
  // Extract all strengths and weaknesses from tasks
  const allStrengths = result.taskResults.flatMap(t => t.strengths);
  const allWeaknesses = result.taskResults.flatMap(t => t.improvements);
  const allErrors = result.taskResults.flatMap(t => t.repeatedErrors || []);

  const strength = allStrengths.length > 0 ? allStrengths[0] : "Good effort attempting all parts of the tasks.";
  
  // Prioritize repeated errors, otherwise general improvements
  const keyWeakness = allErrors.length > 0 ? allErrors[0] : (allWeaknesses.length > 0 ? allWeaknesses[0] : "Spontaneity in unpredicted questions.");
  
  const explanation = "Focusing on this one area will yield the biggest improvement to your grade with the least amount of effort.";

  // The next action task id would be generated from the content schema in a real app
  const nextActionTaskId = "photo_card_theme_1"; 
  
  return {
    strength,
    keyWeakness,
    explanation,
    nextActionTaskId
  };
}

/**
 * Reduces grading to 3 core metrics for simplicity.
 */
export function calculateSimplifiedMetrics(taskResults: TaskMark[]): SimplifiedMetrics {
  let totalFluency = 0;
  let totalAccuracy = 0;
  let gapVocabulary = 0;
  
  let maxPossible = taskResults.length * 4;
  if (maxPossible === 0) return { fluencyScore: 0, accuracyScore: 0, vocabularyRangeScore: 0 };

  taskResults.forEach(task => {
    totalFluency += task.criteria.fluency;
    totalAccuracy += task.criteria.accuracy;
    gapVocabulary += task.criteria.range; // Using 'range' as proxy for Vocabulary Range
  });

  return {
    fluencyScore: Math.round((totalFluency / maxPossible) * 100),
    accuracyScore: Math.round((totalAccuracy / maxPossible) * 100),
    vocabularyRangeScore: Math.round((gapVocabulary / maxPossible) * 100),
  };
}

/**
 * Calculates a unified Exam Readiness Score mapped to GCSE grades.
 */
export function calculateExamReadiness(averageScore: number): { percentage: number, estimatedGrade: string } {
  // Assuming a max average score per task of about ~40 or so. Let's scale it.
  // 40 max per task. Suppose total score out of 60.
  const percentage = Math.min(100, Math.round((averageScore / 60) * 100));
  
  let estimatedGrade = "U";
  if (percentage >= 90) estimatedGrade = "9";
  else if (percentage >= 80) estimatedGrade = "8";
  else if (percentage >= 70) estimatedGrade = "7";
  else if (percentage >= 60) estimatedGrade = "6";
  else if (percentage >= 50) estimatedGrade = "5";
  else if (percentage >= 40) estimatedGrade = "4";

  return {
    percentage,
    estimatedGrade
  };
}

/**
 * Next Best Task Engine logic
 * Determines the absolute best next task to complete based on the weakest metric.
 */
export function determineNextBestTask(metrics: SimplifiedMetrics): { taskId: string, themeId: string, reason: string } {
  const minScore = Math.min(metrics.fluencyScore, metrics.accuracyScore, metrics.vocabularyRangeScore);

  if (minScore === metrics.accuracyScore) {
    return {
      taskId: "role_play_accuracy_drill",
      themeId: "theme_2", // Local/National area
      reason: "Your accuracy score needs attention. This role play focuses heavily on using correct tenses without needing long spontaneous answers."
    };
  } else if (minScore === metrics.vocabularyRangeScore) {
    return {
      taskId: "photo_card_vocab_builder",
      themeId: "theme_1", // Identity & Culture
      reason: "Your vocabulary range was the weakest area. This photo card task requires descriptive, varied adjectives."
    };
  } else {
    return {
      taskId: "general_conversation_fluency",
      themeId: "theme_3", // Study / Employment
      reason: "Your fluency showed hesitation. This general conversation task will help you practice speaking naturally on familiar topics."
    };
  }
}

/**
 * Spaced Repetition Scheduling System
 * Resurfaces weak topics automatically at specific intervals.
 */
export function scheduleSpacedRepetition(failedTaskId: string, themeId: string, previousIntervalDays: number = 0): ReviewScheduleItem {
  const nextInterval = previousIntervalDays === 0 ? 2 : (previousIntervalDays === 2 ? 7 : 14);
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + nextInterval);

  return {
    taskId: failedTaskId,
    themeId,
    scheduledForDate: scheduledDate.toISOString(),
    intervalDays: nextInterval
  };
}
