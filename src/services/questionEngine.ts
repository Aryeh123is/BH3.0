
import { GCSEQuestion, ExamBoard, Tier, Difficulty, TopicWeakness } from '../types/question';
import { ItemHistoryService } from './speaking/itemHistory';

// Import all JSON files from the subjects directory
const questionFiles = import.meta.glob('../data/subjects/**/*.json', { eager: true });

export class QuestionEngine {
  private static allQuestions: GCSEQuestion[] = [];
  private static initialized = false;

  private static init() {
    if (this.initialized) return;

    for (const path in questionFiles) {
      const module = questionFiles[path] as { default: GCSEQuestion[] };
      if (module && module.default) {
        this.allQuestions.push(...module.default);
      }
    }
    this.initialized = true;
  }

  public static getQuestions(filters: {
    language?: string;
    examBoard?: ExamBoard;
    tier?: Tier;
    topics?: string[];
    types?: string[];
    limit?: number;
    difficultyRange?: [Difficulty, Difficulty];
    excludeRecent?: boolean;
  }): GCSEQuestion[] {
    this.init();

    const langKey = filters.language ? filters.language.toLowerCase() : 'global';

    let filtered = this.allQuestions.filter(q => {
      // Language is derived from ID prefix (e.g. es_ for Spanish)
      if (filters.language) {
        const lang = filters.language.toLowerCase();
        let prefixes: string[] = [];
        if (lang === 'spanish' || lang === 'es' || lang === 'sp') {
          prefixes = ['es', 'sp'];
        } else if (lang === 'french' || lang === 'fr') {
          prefixes = ['fr'];
        } else if (lang === 'german' || lang === 'de' || lang === 'ge') {
          prefixes = ['de', 'ge'];
        } else if (lang === 'arabic' || lang === 'ar') {
          prefixes = ['ar'];
        } else if (lang === 'modern' || lang === 'hebrew' || lang === 'he' || lang === 'modern hebrew') {
          prefixes = ['he'];
        } else {
          prefixes = [lang.substring(0, 2)];
        }
        
        const matchesPrefix = prefixes.some(prefix => q.id.startsWith(prefix));
        if (!matchesPrefix) return false;
      }

      if (filters.examBoard && q.examBoard !== filters.examBoard) return false;
      if (filters.tier && q.tier !== filters.tier) return false;
      if (filters.topics && filters.topics.length > 0 && !filters.topics.includes(q.topic)) return false;
      if (filters.types && filters.types.length > 0 && !filters.types.includes(q.type)) return false;
      
      if (filters.difficultyRange) {
        if (q.difficulty < filters.difficultyRange[0] || q.difficulty > filters.difficultyRange[1]) return false;
      }

      return true;
    });

    // Weighted Selection: Exclude recently used if requested
    if (filters.excludeRecent) {
      const typeKey = filters.types?.join('_') || 'all';
      const itemContext = `item_${langKey}_${typeKey}`;
      const topicContext = `topic_${langKey}_${typeKey}`;
      
      // 1. Filter out recently used items
      filtered = ItemHistoryService.filterRecentlyUsed(filtered, itemContext);

      // 2. Topic Balancing: Weight topics to ensure curriculum coverage
      const history = ItemHistoryService.getHistory();
      
      // Look at topic history for this specific language/type combination
      const recentTopics = (history[topicContext] || []) as string[];
      
      filtered = filtered.filter(q => {
        // Strict topic gap: Avoid repeating the LAST 3 topics if possible
        const lastThreeTopics = recentTopics.slice(0, 3);
        if (lastThreeTopics.includes(q.topic)) {
          // Only filter out if we have enough other topics to choose from
          const uniqueTopicsInPool = new Set(filtered.map(item => item.topic));
          if (uniqueTopicsInPool.size > 4) return false;
        }
        return true;
      });

      // Weigh by frequency and recency: Items with NO usage always prioritized
      filtered.sort((a, b) => {
        const usageA = recentTopics.filter(t => t === a.topic).length;
        const usageB = recentTopics.filter(t => t === b.topic).length;
        
        if (usageA !== usageB) return usageA - usageB;
        
        // Secondary jitter for distribution
        return Math.random() - 0.5;
      });
    }

    // Shuffle within their "weight" groups
    if (filters.limit && filtered.length > filters.limit * 2) {
      const topPool = filtered.slice(0, filters.limit * 2);
      filtered = [...this.shuffle(topPool), ...filtered.slice(filters.limit * 2)];
    } else {
      filtered = this.shuffle(filtered);
    }

    // Limit
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    // Mark as used (both items and their topics)
    if (filters.excludeRecent) {
      const typeKey = filters.types?.join('_') || 'all';
      const itemContext = `item_${langKey}_${typeKey}`;
      const topicContext = `topic_${langKey}_${typeKey}`;
      
      filtered.forEach(q => {
        ItemHistoryService.markAsUsed(q.id, itemContext);
        ItemHistoryService.markAsUsed(q.topic, topicContext);
      });
    }

    return filtered;
  }

  private static shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  public static getTopicsForLanguage(language: string): string[] {
    this.init();
    const lang = language.toLowerCase();
    let prefixes: string[] = [];
    if (lang === 'spanish' || lang === 'es' || lang === 'sp') {
      prefixes = ['es', 'sp'];
    } else if (lang === 'french' || lang === 'fr') {
      prefixes = ['fr'];
    } else if (lang === 'german' || lang === 'de' || lang === 'ge') {
      prefixes = ['de', 'ge'];
    } else if (lang === 'arabic' || lang === 'ar') {
      prefixes = ['ar'];
    } else if (lang === 'modern' || lang === 'hebrew' || lang === 'he' || lang === 'modern hebrew') {
      prefixes = ['he'];
    } else {
      prefixes = [lang.substring(0, 2)];
    }

    const topics = new Set<string>();
    this.allQuestions.forEach(q => {
      const matchesPrefix = prefixes.some(prefix => q.id.startsWith(prefix));
      if (matchesPrefix) {
        topics.add(q.topic);
      }
    });
    return Array.from(topics);
  }
}
