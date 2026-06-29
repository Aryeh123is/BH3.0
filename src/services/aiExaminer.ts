import { EXAM_RULES, getEstimatedGrade } from "../core/examRules";

export type ExamType = 'speaking' | 'writing' | 'reading' | 'listening' | 'grammar';

export interface AIResponsePayload {
  examType: ExamType;
  language: string;
  tier: 'foundation' | 'higher' | string;
  examinerProfile?: {
    tone: string;
    strictnessOffset: number;
  };
  responses: Array<{
    questionId: string;
    questionText: string;
    userResponse: string;
    targetContext?: string;
    marksAvailable?: number;
    audioUrl?: string; // Optional for speaking
  }>;
  overallScore?: number;
  totalMarks?: number;
}

export interface AIFeedbackReport {
  overallGrade: string;
  overallComments: string;
  sectionBreakdown: Array<{
    sectionName: string;
    score: number;
    total: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  estimatedGCSEGrade: string;
  nextSteps: string[];
  moderation?: {
    originalPercentage: number;
    finalPercentage: number;
    applied: boolean;
    note: string;
  };
}

export class AIExaminer {
  static async generateFeedback(payload: AIResponsePayload): Promise<AIFeedbackReport> {
    try {
      const response = await fetch('/api/grade-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || `API error: ${response.statusText}`;
        if (errData.code === "API_KEY_EXPIRED" || errMsg.includes("expired") || errMsg.includes("API key") || errMsg.includes("API_KEY_INVALID")) {
          window.dispatchEvent(new CustomEvent('ai-studio-api-key-expired', { 
            detail: { error: errMsg } 
          }));
        }
        throw new Error(errMsg);
      }
      return await response.json();
    } catch (e) {
      console.warn("Server AI evaluation failed, falling back to local:", e);
      return this.getFallbackFeedback(payload);
    }
  }

  static getFallbackFeedback(payload: AIResponsePayload): AIFeedbackReport {
    // Basic offline logic
    const score = payload.overallScore || 0;
    const total = payload.totalMarks || payload.responses.length;
    const pct = (score / total) * 100;

    return {
      overallGrade: getEstimatedGrade(pct),
      overallComments: "This is an automated offline report. Your accuracy has been checked, but qualitative feedback (fluency/expression) requires an AI connection.",
      sectionBreakdown: [
        {
          sectionName: "Overall Accuracy",
          score: score,
          total: total,
          feedback: "You correctly answered most technical components.",
          strengths: ["Task completion", "Accuracy"],
          weaknesses: ["Fluency analysis (requires AI)"]
        }
      ],
      estimatedGCSEGrade: getEstimatedGrade(pct),
      nextSteps: ["Try again with an active internet connection for detailed AI marking.", "Review your vocabulary in the vocab trainer."]
    };
  }

  static async gradeWritingPaper(language: string, submission: any[], isPremium: boolean, examinerProfile?: { tone: string; strictnessOffset: number }): Promise<any> {
    try {
      const response = await fetch('/api/grade-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language, submission, isPremium, examinerProfile })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || `Grade writing request failed status ${response.status}`;
        if (errData.code === "API_KEY_EXPIRED" || errMsg.includes("expired") || errMsg.includes("API key") || errMsg.includes("API_KEY_INVALID")) {
          window.dispatchEvent(new CustomEvent('ai-studio-api-key-expired', { 
            detail: { error: errMsg } 
          }));
        }
        throw new Error(errMsg);
      }
      return await response.json();
    } catch (error) {
      console.error("Writing marking failed:", error);
      throw error;
    }
  }
}

export const aiExaminer = AIExaminer;
