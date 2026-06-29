import { UserProgress, TopicMastery, MasterySkill } from '../../types/retention';

const STORAGE_KEY = 'vocariox_user_progress';

export class ProgressService {
  private static defaultProgress: UserProgress = {
    overallMastery: 0,
    skills: { speaking: 0, fluency: 0, pronunciation: 0, vocabulary: 0, grammar: 0 },
    topics: {},
    streak: { count: 0, lastActive: '', milestones: [], freezes: 0 },
    examCount: { 
      today: 0, 
      weekly: 0, 
      lastReset: new Date().toISOString().split('T')[0], 
      lastWeeklyReset: new Date().toISOString().split('T')[0],
      total: 0 
    },
    xp: 0
  };

  static getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const progress = data ? JSON.parse(data) : { ...this.defaultProgress };
      
      // Ensure new fields exist for existing users
      if (!progress.examCount) progress.examCount = { ...this.defaultProgress.examCount };
      if (progress.examCount.weekly === undefined) progress.examCount.weekly = 0;
      if (!progress.examCount.lastWeeklyReset) progress.examCount.lastWeeklyReset = progress.examCount.lastReset;
      
      if (!progress.streak) progress.streak = { ...this.defaultProgress.streak };
      if (progress.streak.freezes === undefined) progress.streak.freezes = 0;
      if (progress.xp === undefined) progress.xp = 0;

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Daily Reset Check
      if (progress.examCount.lastReset !== today) {
        progress.examCount.today = 0;
        progress.examCount.lastReset = today;
        
        // Weekly Reset Check
        const lastWeekly = new Date(progress.examCount.lastWeeklyReset);
        const daysSinceWeekly = (now.getTime() - lastWeekly.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceWeekly >= 7) {
          progress.examCount.weekly = 0;
          progress.examCount.lastWeeklyReset = today;
        }

        // Streak Integrity Check (Check if streak was broken yesterday)
        const lastActiveDate = progress.streak.lastActive ? new Date(progress.streak.lastActive) : null;
        if (lastActiveDate) {
          const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            // Streak broken! Use a freeze if available
            if (progress.streak.freezes > 0) {
              progress.streak.freezes -= 1;
              // Reset lastActive to yesterday to maintain streak
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              progress.streak.lastActive = yesterday.toISOString().split('T')[0];
            } else {
              progress.streak.count = 0;
            }
          }
        }
        
        this.saveProgress(progress);
      }
      
      return progress;
    } catch {
      return { ...this.defaultProgress };
    }
  }

  static saveProgress(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  static recordExamCompletion(topicId: string, scores: Record<MasterySkill, number>): void {
    const progress = this.getProgress();
    const today = new Date().toISOString();
    const dateStr = today.split('T')[0];

    // Update Streak
    if (progress.streak.lastActive !== dateStr) {
      const last = new Date(progress.streak.lastActive);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (progress.streak.lastActive && last.toDateString() === yesterday.toDateString()) {
        progress.streak.count += 1;
        
        // Earn Streak Freezes
        const isPremium = localStorage.getItem('vocariox_license')?.includes('PREMIUM');
        if (progress.streak.count % 5 === 0 && !progress.streak.milestones.includes(progress.streak.count)) {
          const maxFreezes = isPremium ? 99 : 3;
          if (progress.streak.freezes < maxFreezes) {
            progress.streak.freezes += 1;
            progress.streak.milestones.push(progress.streak.count);
          }
        }
      } else {
        progress.streak.count = 1;
      }
      progress.streak.lastActive = dateStr;
    }

    // Update Topic Mastery
    const topic = progress.topics[topicId] || { topicId, score: 0, lastPracticed: '', totalAttempts: 0 };
    const avgNewScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    
    // Moving average for stability
    topic.score = Math.round((topic.score * topic.totalAttempts + avgNewScore) / (topic.totalAttempts + 1));
    topic.totalAttempts += 1;
    topic.lastPracticed = today;
    progress.topics[topicId] = topic;

    // Update Skills
    Object.keys(scores).forEach((skill) => {
      const s = skill as MasterySkill;
      progress.skills[s] = Math.round((progress.skills[s] * progress.examCount.total + scores[s]) / (progress.examCount.total + 1));
    });

    // Global Stats
    progress.examCount.today += 1;
    progress.examCount.weekly += 1;
    progress.examCount.total += 1;
    progress.overallMastery = Math.round(Object.values(progress.skills).reduce((a, b) => a + b, 0) / 5);

    this.saveProgress(progress);
  }

  static getWeakestTopics(limit = 3): TopicMastery[] {
    const progress = this.getProgress();
    return Object.values(progress.topics)
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);
  }
}
