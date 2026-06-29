import { ReadingPaper, ReadingAnswer, ReadingQuestion } from '../../types/reading';
import { aiExaminer } from '../../services/aiExaminer';

export class ReadingPaperEngine {
  /**
   * Deterministic marking for rule-based questions
   */
  static markQuestion(question: ReadingQuestion, userAnswer: string): { 
    marks: number; 
    isCorrect: boolean; 
    feedback?: string 
  } {
    if (!userAnswer || !userAnswer.trim()) {
      return { marks: 0, isCorrect: false, feedback: "No answer provided." };
    }

    const cleanAnswer = userAnswer.trim().toLowerCase();
    
    // Most reading questions are exact matches or contain keywords
    if (question.acceptedAnswers && question.acceptedAnswers.length > 0) {
      const match = question.acceptedAnswers.some(accepted => 
        cleanAnswer.includes(accepted.toLowerCase()) || 
        accepted.toLowerCase().includes(cleanAnswer)
      );

      if (match) {
        return { marks: question.marks, isCorrect: true };
      }
    }

    // Fallback for simple exact match validation
    return { 
      marks: 0, 
      isCorrect: false, 
      feedback: question.explanation ? `Suggested answer: ${question.explanation}` : undefined 
    };
  }

  /**
   * Evaluates a full paper attempt
   * Questions of type 'translation_passage' are left for AI evaluation
   */
  static async evaluateAttempt(
    paper: ReadingPaper, 
    answers: Record<string, string>
  ): Promise<ReadingAnswer[]> {
    const results: ReadingAnswer[] = [];

    for (const section of paper.sections) {
      for (const question of section.questions) {
        const userAnswer = answers[question.id] || '';
        
        if (question.type === 'translation_passage') {
          // AI will handle this later in the flow
          results.push({
            questionId: question.id,
            sectionId: section.id,
            answer: userAnswer,
            marksAwarded: 0, // Placeholder
            feedback: "Marking by AI Examiner..."
          });
        } else {
          // Rule-based marking for all other types including transition_sentence (Foundation)
          const marking = this.markQuestion(question, userAnswer);
          results.push({
            questionId: question.id,
            sectionId: section.id,
            answer: userAnswer,
            marksAwarded: marking.marks,
            isCorrect: marking.isCorrect,
            feedback: marking.feedback
          });
        }
      }
    }

    return results;
  }
}
