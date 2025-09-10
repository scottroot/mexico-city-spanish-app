/**
 * Premium Gate Component
 * Shows premium content only to subscribed users, with upgrade prompt for others
 */

import React from 'react';
import { useBilling } from '../hooks/useBilling';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Crown, Lock } from 'lucide-react';

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  title?: string;
  description?: string;
}

export function PremiumGate({ 
  children, 
  fallback, 
  showUpgrade = true, 
  title = "Premium Feature",
  description = "This feature is available with a premium subscription."
}: PremiumGateProps) {
  const { hasAccess, loading, goPro } = useBilling();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-orange-100 rounded-full">
          <Crown className="h-8 w-8 text-orange-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>

        <Button 
          onClick={() => window.location.href = '/pro'} 
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2"
        >
          <Crown className="h-4 w-4 mr-2" />
          Go Pro
        </Button>
      </div>
    </Card>
  );
}

/**
 * Simple premium indicator for locked features
 */
export function PremiumLock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { hasAccess } = useBilling();

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
        <Lock className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}
