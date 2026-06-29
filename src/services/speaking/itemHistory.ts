
export class ItemHistoryService {
  private static STORAGE_KEY = 'speaking_item_history';
  private static MAX_HISTORY_PER_TYPE = 20;
  private static memoryFallback: Record<string, string[]> = {};

  static getHistory(): Record<string, string[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.memoryFallback;
    } catch {
      return this.memoryFallback;
    }
  }

  static markAsUsed(id: string, context: string = 'global') {
    const history = this.getHistory();
    const key = context;
    
    if (!history[key]) {
      history[key] = [];
    }

    // Add to front, remove duplicates
    history[key] = [id, ...history[key].filter(existingId => existingId !== id)];

    // Cap history size
    if (history[key].length > this.MAX_HISTORY_PER_TYPE) {
      history[key] = history[key].slice(0, this.MAX_HISTORY_PER_TYPE);
    }

    this.memoryFallback = history;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Graceful fallback to memory storage
    }
  }

  static isRecentlyUsed(id: string, context: string = 'global'): boolean {
    const history = this.getHistory();
    return history[context]?.includes(id) || false;
  }

  static filterRecentlyUsed<T extends { id: string }>(items: T[], context: string = 'global'): T[] {
    const history = this.getHistory();
    const usedIds = history[context] || [];

    // If all items are used, clear history for this type and return all
    if (items.length > 0 && items.every(item => usedIds.includes(item.id))) {
      this.clearHistoryForContext(context);
      return items;
    }

    return items.filter(item => !usedIds.includes(item.id));
  }

  private static clearHistoryForContext(context: string) {
    const history = this.getHistory();
    delete history[context];
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch {
      delete this.memoryFallback[context];
    }
  }
}
