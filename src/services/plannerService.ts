import { WeaknessService, WeaknessTag } from './user/weaknessService';
import { ProgressService } from './user/progressService';

export interface RevisionPlanItem {
  id: string;
  type: 'writing' | 'speaking' | 'reading' | 'grammar' | 'translation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'weakness_repair' | 'maintenance' | 'growth';
  estimatedTime: string;
}

export interface WeeklyRevisionPlan {
  weeklyFocus: string;
  focusTag: WeaknessTag | 'GENERAL';
  items: RevisionPlanItem[];
  projectedIntensity: 'light' | 'moderate' | 'intensive';
  estimatedGradeLift: string;
}

export class PlannerService {
  static generateWeeklyPlan(isPremium: boolean = false): WeeklyRevisionPlan {
    const profile = WeaknessService.getProfile();
    const progress = ProgressService.getProgress();
    const topWeakness = Object.values(profile.insights).sort((a, b) => b.count - a.count)[0];
    
    const focusTag = topWeakness?.tag || 'GENERAL';
    const items: RevisionPlanItem[] = [];

    // 1. Weakness Repair (Highest Priority)
    if (topWeakness) {
      items.push(this.getRepairItem(topWeakness.tag));
    } else {
      items.push({
        id: 'repair-1',
        type: 'speaking',
        title: 'Diagnostic Exam',
        description: 'Complete a full exam to identify your focus areas.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '15m'
      });
    }

    // 2. Growth (New Topics)
    const weakTopics = ProgressService.getWeakestTopics(1);
    if (weakTopics.length > 0) {
      items.push({
        id: 'growth-1',
        type: 'learn',
        title: `Topic Focus: ${weakTopics[0].topicId.split('-').slice(2).join(' ')}`,
        description: 'Review new vocabulary to expand your range.',
        priority: 'medium',
        category: 'growth',
        estimatedTime: '10m'
      } as any);
    }

    // 3. Maintenance (Variety)
    items.push({
      id: 'maint-1',
      type: 'translation',
      title: 'Translation Drill',
      description: 'Keep your sentence construction sharp.',
      priority: 'low',
      category: 'maintenance',
      estimatedTime: '5m'
    });

    // Premium Extras
    if (isPremium && items.length < 5) {
      items.push({
        id: 'premium-1',
        type: 'grammar',
        title: 'Advanced Structure Loop',
        description: 'Master complex syntax for Grade 8/9 targets.',
        priority: 'medium',
        category: 'growth',
        estimatedTime: '12m'
      });
    }

    const focusTitleMap: Record<WeaknessTag | 'GENERAL', string> = {
      TENSE_ACCURACY: 'Mastering Time & Tenses',
      OPINION_JUSTIFICATION: 'Expressing Depth & "Why"',
      VOCAB_RANGE: 'Lexical Variety Expansion',
      GRAMMAR_AGREEMENT: 'Precision & Accuracy',
      BULLET_POINT_COVERAGE: 'Full Task Achievement',
      TRANSLATION_ACCURACY: 'Structural Reliability',
      SENTENCE_COMPLEXITY: 'Fluent Syntax Loops',
      GENERAL: 'Balanced Foundation Building'
    };

    return {
      weeklyFocus: focusTitleMap[focusTag],
      focusTag,
      items: items.slice(0, isPremium ? 5 : 3),
      projectedIntensity: profile.sessionCount > 5 ? 'moderate' : 'light',
      estimatedGradeLift: profile.gradeConfidence > 0.5 ? '+0.5 Grades' : '+0.2 Grades'
    };
  }

  private static getRepairItem(tag: WeaknessTag): RevisionPlanItem {
    const map: Record<WeaknessTag, RevisionPlanItem> = {
      TENSE_ACCURACY: {
        id: 'r-tense',
        type: 'writing',
        title: 'Mixed Tense Redraft',
        description: 'Rewrite a 90-word task focusing on Past/Future sequences.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '20m'
      },
      OPINION_JUSTIFICATION: {
        id: 'r-opinion',
        type: 'speaking',
        title: 'Opinion Justification Drills',
        description: 'Practice adding "porque" or "parce que" to every answer.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '10m'
      },
      VOCAB_RANGE: {
        id: 'r-vocab',
        type: 'grammar',
        title: 'Synonym Substitution',
        description: 'Replace "basic" words with high-tier curriculum vocabulary.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '15m'
      },
      GRAMMAR_AGREEMENT: {
        id: 'r-grammar',
        type: 'translation',
        title: 'Agreement Check Routine',
        description: 'Focus solely on gender and number agreement in translations.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '12m'
      },
      BULLET_POINT_COVERAGE: {
        id: 'r-bullets',
        type: 'writing',
        title: 'Task Achievement Loop',
        description: 'Ensure every bullet point is hit with 2+ sentences.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '18m'
      },
      TRANSLATION_ACCURACY: {
        id: 'r-trans',
        type: 'translation',
        title: 'Mirror Accuracy Build',
        description: 'Exact structural replication of English to Target Language.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '10m'
      },
      SENTENCE_COMPLEXITY: {
        id: 'r-complex',
        type: 'writing',
        title: 'Connective Expansion',
        description: 'Join short sentences using advanced GCSE connectives.',
        priority: 'high',
        category: 'weakness_repair',
        estimatedTime: '15m'
      }
    };
    return map[tag];
  }
}
