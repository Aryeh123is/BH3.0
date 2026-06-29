
export type MasterySkill = 'speaking' | 'fluency' | 'pronunciation' | 'vocabulary' | 'grammar';

export interface TopicMastery {
  topicId: string;
  score: number; // 0-100
  lastPracticed: string;
  totalAttempts: number;
}

export interface UserProgress {
  overallMastery: number;
  skills: Record<MasterySkill, number>;
  topics: Record<string, TopicMastery>;
  streak: {
    count: number;
    lastActive: string;
    milestones: number[];
    freezes: number;
    lastFreezeEarned?: string;
  };
  examCount: {
    today: number;
    weekly: number;
    lastReset: string;
    lastWeeklyReset: string;
    total: number;
  };
  xp?: number;
}

export interface DailyMission {
  id: string;
  type: 'EXAM' | 'DRILL' | 'THEME_PRACTICE';
  title: string;
  description: string;
  targetTopicId?: string;
  isCompleted: boolean;
  rewardPoints: number;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  tier: 'FREE' | 'PREMIUM';
  expiryDate?: string;
  isEarlyAdopter?: boolean;
  isTrialing?: boolean;
  trialEndsAt?: string;
}
