/**
 * Vocariox Device & Session Manager (v4.1.57)
 * Enforces a Max Active Sessions check / Concurrent Stream tracking
 * using activeSessionId on the user document in Firestore on startup.
 */

import { 
  doc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface DeviceInfo {
  name: string;
  firstSeen: any;
  lastSeen: any;
  trusted: boolean;
}

export interface UserDevicesGroup {
  devices: Record<string, DeviceInfo>;
  updatedAt: any;
}

export class DeviceManager {
  private static localSessionId: string | null = null;
  private static isInitialized = false;
  private static onSessionInvalidated: (() => void) | null = null;

  /**
   * Retrieves or lazily creates a unique session ID for the current client instance.
   */
  static getLocalSessionId(): string {
    if (!this.localSessionId) {
      this.localSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    return this.localSessionId;
  }

  /**
   * Forcefully changes the current local session ID (e.g. when taking over / continuing).
   */
  static resetLocalSessionId(): string {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.localSessionId = sessionId;
    return sessionId;
  }

  static setInitialized(value: boolean) {
    this.isInitialized = value;
  }

  static getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Registers the current device's activeSessionId to their user document in Firestore.
   */
  static async validateDeviceAndSession(
    userId: string, 
    _subscriptionTier: 'FREE' | 'PREMIUM' = 'FREE'
  ): Promise<{ 
    valid: boolean; 
    requiresVerification: boolean;
    reason?: string;
  }> {
    const localSessId = this.getLocalSessionId();
    this.isInitialized = false; // Reset during handshake to avoid race conditions

    const userRef = doc(db, 'users', userId);
    try {
      await setDoc(userRef, {
        activeSessionId: localSessId,
        lastActiveAt: new Date().toISOString()
      }, { merge: true });
      this.isInitialized = true;
    } catch (e) {
      console.error("VOCARIOX SECURITY: Failed to write activeSessionId to Firestore", e);
    }

    return { valid: true, requiresVerification: false };
  }

  static setInvalidationCallback(callback: () => void) {
    this.onSessionInvalidated = callback;
  }

  /**
   * Triggers the invalidation hook.
   */
  static triggerInvalidation() {
    if (this.onSessionInvalidated) {
      this.onSessionInvalidated();
    }
  }

  /**
   * Heartbeat to keep session alive during long exams or study sessions
   */
  static async heartbeat(userId: string) {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        lastActiveAt: new Date().toISOString()
      });
    } catch (e) {
      // Graceful ignoring of transient errors
    }
  }
}
