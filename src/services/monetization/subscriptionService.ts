import { SubscriptionStatus } from '../../types/retention';
import { ProgressService } from '../user/progressService';

const LICENSE_KEY = 'vocariox_license';

export class SubscriptionService {
  static getStatus(userProfile?: any): SubscriptionStatus {
    try {
      // 1. Explicit Premium subscription from profile database has highest priority
      if (userProfile?.subscriptionTier === 'PREMIUM' || userProfile?.isPremium) {
        // Only return non-trial if it is not a trial source, or if they decide to purchase Stripe
        if (userProfile?.premium_source !== 'trial') {
          return {
            isPremium: true,
            tier: 'PREMIUM',
            isEarlyAdopter: true,
            isTrialing: false
          };
        }
      }

      // 2. Direct Trial Verification from Profile Database (real-time authority)
      if (userProfile?.trial_ends_at) {
        const trialEnds = new Date(userProfile.trial_ends_at);
        if (new Date() < trialEnds) {
          return {
            isPremium: true,
            tier: 'PREMIUM',
            isEarlyAdopter: true,
            isTrialing: true,
            trialEndsAt: userProfile.trial_ends_at
          };
        }
      }

      // 3. Fallback to Local Storage for offline/session-start or static calls
      const data = localStorage.getItem(LICENSE_KEY);
      if (!data) {
        const initialStatus: SubscriptionStatus = {
          isPremium: false,
          tier: 'FREE',
          isEarlyAdopter: true,
          isTrialing: false
        };
        localStorage.setItem(LICENSE_KEY, JSON.stringify(initialStatus));
        return initialStatus;
      }

      const status: SubscriptionStatus = JSON.parse(data);
      
      // Check if trial has expired in local storage object
      if (status.isTrialing && status.trialEndsAt) {
        if (new Date() > new Date(status.trialEndsAt)) {
          // Trial expired, revert to FREE
          const expiredStatus: SubscriptionStatus = {
            ...status,
            isPremium: false,
            tier: 'FREE',
            isTrialing: false
          };
          localStorage.setItem(LICENSE_KEY, JSON.stringify(expiredStatus));
          return expiredStatus;
        }
      }

      return status;
    } catch {
      return { isPremium: false, tier: 'FREE', isEarlyAdopter: true };
    }
  }

  static activatePremium(): void {
    localStorage.setItem(LICENSE_KEY, JSON.stringify({
      isPremium: true,
      tier: 'PREMIUM',
      expiryDate: new Date(Date.now() + 31536000000).toISOString(),
      isEarlyAdopter: true,
      isTrialing: false
    }));
    window.dispatchEvent(new Event('storage')); // Trigger update
  }

  static activateTrialLocal(trialEndsAt: string): void {
    localStorage.setItem(LICENSE_KEY, JSON.stringify({
      isPremium: true,
      tier: 'PREMIUM',
      isEarlyAdopter: true,
      isTrialing: true,
      trialEndsAt: trialEndsAt
    }));
    window.dispatchEvent(new Event('storage')); // Trigger update
  }

  static deactivatePremium(): void {
    localStorage.removeItem(LICENSE_KEY);
    window.dispatchEvent(new Event('storage'));
  }

  static generateParentPaymentLink(userId: string = 'anon'): string {
    const baseUrl = window.location.origin;
    const plan = 'premium_monthly_discount';
    const amount = '2.49';
    // Encoded link that parents can visit to pay for the student
    return `${baseUrl}/checkout?u=${userId}&p=${plan}&amt=${amount}&ref=parent_share`;
  }

  static canStartExam(): { allowed: boolean; reason?: 'FAIR_USE_LIMIT' } {
    const status = this.getStatus();
    
    // Premium users have highest priority access
    if (status.tier === 'PREMIUM') return { allowed: true };

    const progress = ProgressService.getProgress();
    
    // Free users (Discovery/Try-out) get 2 exams per week
    const weeklyCount = progress.examCount?.weekly || 0;
    if (status.tier === 'FREE' && weeklyCount >= 2) {
      return { allowed: false, reason: 'FAIR_USE_LIMIT' };
    }

    return { allowed: true };
  }
}
