/**
 * CacheService.ts
 * Implements the Vocariox Cache Protocol using the browser's Cache API.
 * This ensures that exam datasets, audio assets, and past paper content
 * are available offline and load instantly.
 */

import { INITIAL_PAST_PAPERS } from '../data/pastPapersData';

export const CACHE_NAME = 'vocariox-exam-cache-v1';

// Critical assets to pre-cache
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json'
];

export const CacheService = {
  /**
   * Initializes the cache with critical assets and background-caches exams
   */
  async initialize() {
    if (!('caches' in window)) return false;
    
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CRITICAL_ASSETS);
      console.log('Vocariox Cache Protocol initialized with critical assets.');
      
      // Gradually cache past papers in the background
      this.cacheAllPastPapers();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize cache:', error);
      return false;
    }
  },

  /**
   * Background caches all past paper PDFs and mark schemes
   */
  async cacheAllPastPapers() {
    if (!('caches' in window)) return;
    const cache = await caches.open(CACHE_NAME);
    
    // Process in small batches to avoid blocking the main thread
    const urls = INITIAL_PAST_PAPERS.flatMap(p => [p.paperUrl, p.markSchemeUrl]);
    
    for (const url of urls) {
      if (!url) continue;
      try {
        const response = await cache.match(url);
        if (!response) {
          // Use fetch with no-cors to handle resources that block cross-origin requests (like Pearson PDFs)
          // Opaque responses can still be cached and served to the user.
          const res = await fetch(url, { mode: 'no-cors' });
          await cache.put(url, res);
        }
      } catch (e) {
        // Silently fail for individual assets
      }
    }
  },

  /**
   * Caches a given URL or Request
   */
  async cacheResource(url: string) {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(url);
    } catch (error) {
      console.error(`Failed to cache resource: ${url}`, error);
    }
  },

  /**
   * Retrieves a resource from cache
   */
  async getCachedResource(url: string) {
    if (!('caches' in window)) return null;
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(url);
  },

  /**
   * Clears old caches
   */
  async clearOldCaches() {
    if (!('caches' in window)) return;
    const keys = await caches.keys();
    return Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    );
  }
};
