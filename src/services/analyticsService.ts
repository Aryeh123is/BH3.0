import { generateId } from '../lib/utils';
import { TopicWeakness, ExamHistoryItem } from '../types/question';
import { GRADE_BOUNDARIES_DB } from '../data/gradeBoundaries';
import { auth, db, doc, setDoc } from '../firebase';

const STORAGE_KEY = 'gcse_exam_analytics';
const HISTORY_KEY = 'gcse_exam_history';

export class AnalyticsService {
  public static recordResult(topic: string, isCorrect: boolean, timeTaken: number) {
    const data = this.getAnalytics();
    
    if (!data[topic]) {
      data[topic] = {
        topic,
        accuracy: 0,
        averageTime: 0,
        timesSeen: 0
      };
    }

    const topicData = data[topic];
    const totalCorrect = (topicData.accuracy / 100) * topicData.timesSeen;
    
    topicData.timesSeen += 1;
    const newTotalCorrect = isCorrect ? totalCorrect + 1 : totalCorrect;
    topicData.accuracy = (newTotalCorrect / topicData.timesSeen) * 100;
    
    // Rolling average for time
    topicData.averageTime = Math.round((topicData.averageTime * (topicData.timesSeen - 1) + timeTaken) / topicData.timesSeen);

    this.saveAnalytics(data);
  }

  public static getAnalytics(): Record<string, TopicWeakness> {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  private static saveAnalytics(data: Record<string, TopicWeakness>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (auth?.currentUser && db) {
      setDoc(doc(db, 'users', auth.currentUser.uid, 'analytics', 'main'), { data }, { merge: true }).catch(console.error);
    }
  }

  public static getWeakestTopics(limit: number = 3): TopicWeakness[] {
    const data = Object.values(this.getAnalytics());
    return data
      .filter(t => t.timesSeen >= 1)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }

  public static getHistory(): ExamHistoryItem[] {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  public static saveExamResult(result: Omit<ExamHistoryItem, 'id' | 'date' | 'grade'>) {
    const history = this.getHistory();
    
    // Estimate grade
    const grade = this.estimateGrade(result.language, result.type, result.score, result.total);

    const newItem: ExamHistoryItem = {
      ...result,
      id: generateId('hex'),
      date: Date.now(),
      grade
    };

    history.unshift(newItem);
    const trimmed = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    if (auth?.currentUser && db) {
      setDoc(doc(db, 'users', auth.currentUser.uid, 'analytics', 'history'), { data: trimmed }, { merge: true }).catch(console.error);
    }
  }

  private static estimateGrade(language: string, type: string, score: number, total: number): string {
    const subject = language.charAt(0) + language.slice(1).toLowerCase();
    const entry = GRADE_BOUNDARIES_DB.find(b => 
      b.subject.toLowerCase() === language.toLowerCase() && 
      b.name.toLowerCase().includes(type.toLowerCase())
    );

    if (!entry) {
      // Fallback simple percentage grading
      const p = (score / total) * 100;
      if (p >= 90) return '9';
      if (p >= 80) return '8';
      if (p >= 70) return '7';
      if (p >= 60) return '6';
      if (p >= 50) return '5';
      if (p >= 40) return '4';
      if (p >= 30) return '3';
      return '2';
    }

    // Scale score to match maxMarks of boundary entry
    const scaledScore = (score / total) * entry.maxMarks;
    
    const grades = entry.gradingScale.grades;
    for (const g of grades) {
      if (scaledScore >= (entry.boundaries[g] || 0)) {
        return g;
      }
    }
    
    return '1';
  }
}
