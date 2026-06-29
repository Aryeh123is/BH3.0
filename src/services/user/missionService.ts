import { DailyMission } from '../../types/retention';
import { ProgressService } from '../user/progressService';
import { WeaknessService } from './weaknessService';

const MISSION_KEY = 'vocariox_daily_missions';

export class MissionService {
  static getDailyMissions(): DailyMission[] {
    const today = new Date().toISOString().split('T')[0];
    try {
      const data = localStorage.getItem(MISSION_KEY);
      const storage = data ? JSON.parse(data) : null;
      
      if (storage?.date === today) {
        return storage.missions;
      }
    } catch {}

    // Generate new missions for the day
    const newMissions = this.generateMissions();
    localStorage.setItem(MISSION_KEY, JSON.stringify({ date: today, missions: newMissions }));
    return newMissions;
  }

  private static generateMissions(): DailyMission[] {
    const weakTopics = ProgressService.getWeakestTopics(1);
    const insights = WeaknessService.getTargetedPrompts();
    
    const missions: DailyMission[] = [
      {
        id: 'm1',
        type: 'EXAM',
        title: 'Daily Mock Exam',
        description: insights.length > 0 && !insights[0].includes('Complete') 
          ? `Focus on: ${insights[0].split('.')[0]}` 
          : 'Complete a full speaking exam to keep your streak alive.',
        isCompleted: false,
        rewardPoints: 50
      },
      {
        id: 'm2',
        type: 'THEME_PRACTICE',
        title: weakTopics.length > 0 ? `Targeted: ${weakTopics[0].topicId.split('-').slice(2).join(' ')}` : 'Topic Focus',
        description: 'Practice your weakest theme to boost your overall mastery.',
        targetTopicId: weakTopics.length > 0 ? weakTopics[0].topicId : 'theme-1-my-personal-world',
        isCompleted: false,
        rewardPoints: 30
      }
    ];
    return missions;
  }

  static completeMission(missionId: string): void {
    const missions = this.getDailyMissions();
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.isCompleted) {
      mission.isCompleted = true;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(MISSION_KEY, JSON.stringify({ date: today, missions }));
      
      try {
        const progress = ProgressService.getProgress();
        progress.xp = (progress.xp || 0) + mission.rewardPoints;
        ProgressService.saveProgress(progress);
        
        // Dispatch sync events
        window.dispatchEvent(new Event('vocariox_progress_sync'));
        window.dispatchEvent(new Event('bh-analytics-sync'));
      } catch (error) {
        console.error("Failed to grant XP reward:", error);
      }
    }
  }
}
