import React from 'react';
import { PricingSection } from '../PricingSection';
import { SubscriptionStatus } from '../../types/retention';

interface PricingPageProps {
  currentStatus: SubscriptionStatus;
  onUpdate: () => void;
  onSignIn?: () => void;
  devMode?: boolean;
  onNavigate?: (view: any) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ currentStatus, onUpdate, onSignIn, devMode = false, onNavigate }) => {
  return (
    <div className="min-h-screen">
      <PricingSection 
        currentStatus={currentStatus} 
        onUpdate={onUpdate} 
        onSignIn={onSignIn}
        isLandingPage={true} 
        devMode={devMode}
        onNavigate={onNavigate}
      />
    </div>
  );
};
