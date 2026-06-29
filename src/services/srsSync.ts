import { db, doc, writeBatch } from '../firebase';

export interface SRSReviewEvent {
  id: string; // UUID for idempotency
  wordId: string;
  nextReview: number;
  intervalDays: number;
  mastery: 'new' | 'learning' | 'mastered';
  lastStudied: number;
  timestamp: number;
}

const DB_NAME = 'VocarioxSRS_v2';
const STORE_NAME = 'offline_queue';
const DB_VERSION = 1;
const MAX_QUEUE_SIZE = 2000;
const BATCH_FLUSH_SIZE = 100;

let isSyncing = false;
let retryDelay = 1000;
const MAX_RETRY_DELAY = 60000;
let syncTimeout: number | undefined;

// Promisified IndexedDB initialization
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getOfflineQueue = async (): Promise<SRSReviewEvent[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to get offline queue', e);
    return [];
  }
};

const addToOfflineQueue = async (events: SRSReviewEvent[]) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    events.forEach(event => store.put(event));
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to add to offline queue', e);
  }
};

const clearFromOfflineQueue = async (eventIds: string[]) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    eventIds.forEach(id => store.delete(id));
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to clear offline queue', e);
  }
};

/**
 * Main entry point: adds items to IndexedDB, compressing duplicates, and triggers a background sync.
 */
export const syncSRSBatch = async (
  userId: string, 
  results: Omit<SRSReviewEvent, 'id' | 'timestamp'>[]
) => {
  if (!userId || !results || results.length === 0) return;

  const now = Date.now();
  const newEvents: SRSReviewEvent[] = results.map(r => ({
    ...r,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
    timestamp: now
  }));

  // Compressing the queue to ensure only the latest state per word is stored, while keeping within limits.
  // Using a single readwrite transaction to guarantee atomicity and prevent race conditions.
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const currentQueue: SRSReviewEvent[] = getAllRequest.result || [];
        const combined = [...currentQueue, ...newEvents];
        
        // Deduplicate by wordId (keep latest)
        const latestEvents = new Map<string, SRSReviewEvent>();
        combined.forEach(event => {
          const existing = latestEvents.get(event.wordId);
          if (!existing || existing.timestamp <= event.timestamp) {
            latestEvents.set(event.wordId, event);
          }
        });
        
        let compressedQueue = Array.from(latestEvents.values());
        compressedQueue.sort((a, b) => a.timestamp - b.timestamp); // Oldest first
        
        // If we exceed hard limit, drop oldest
        if (compressedQueue.length > MAX_QUEUE_SIZE) {
          compressedQueue = compressedQueue.slice(compressedQueue.length - MAX_QUEUE_SIZE);
        }
        
        // Clear and rewrite atomically
        store.clear();
        compressedQueue.forEach(event => store.put(event));
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

  } catch (e) {
    console.error("Queue manipulation failed, writing directly", e);
    // Fallback: just put them in individually if complex transaction fails
    await addToOfflineQueue(newEvents);
  }

  // Attempt sync if online
  triggerSync(userId);
};

export const triggerSync = (userId: string) => {
  if (!userId || isSyncing || !navigator.onLine) return;
  
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = window.setTimeout(() => {
    flushOfflineQueue(userId);
  }, retryDelay === 1000 ? 50 : retryDelay); // immediate flush first time, delayed if retrying
};

/**
 * Sweeps the IndexedDB queue and transmits to Cloud Functions in chunks.
 * Uses limits, batching, and backoff.
 */
export const flushOfflineQueue = async (userId: string) => {
  if (!userId || isSyncing || !navigator.onLine) return;

  isSyncing = true;
  
  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) {
      retryDelay = 1000; // reset
      isSyncing = false;
      return;
    }

    // Process in safe chunks
    const batchToSend = queue.slice(0, BATCH_FLUSH_SIZE);

    const batch = writeBatch(db);
    batchToSend.forEach(event => {
      const docRef = doc(db, 'users', userId, 'progress', event.wordId);
      batch.set(docRef, {
        nextReview: event.nextReview,
        intervalDays: event.intervalDays,
        mastery: event.mastery,
        lastStudied: event.lastStudied,
        lastSyncId: event.id,
        wordId: event.wordId
      }, { merge: true });
    });

    await batch.commit();

    // Success! Clear transmitted and reset backoff
    await clearFromOfflineQueue(batchToSend.map(e => e.id));
    retryDelay = 1000;
    
    // Check if more events remain by checking DB again
    const remainingQueue = await getOfflineQueue();
    if (remainingQueue.length > 0) {
      isSyncing = false; 
      triggerSync(userId);
      return; 
    }
  } catch (error: any) {
    console.error("SRS Batch sync failed. Backing off.", error);
    // Apply backoff
    retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
    isSyncing = false;
    
    if (navigator.onLine) {
        triggerSync(userId);
    }
  } finally {
    isSyncing = false;
  }
};

// Global network listeners to unjam queue on reconnect
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    retryDelay = 1000; // immediately reset backoff
    isSyncing = false;
    // We expect the app's auth state listener to provide the user ID to triggerSync,
    // but assuming next interaction will kick it, or we rely on the caller tracking it
  });
}

