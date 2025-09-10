/**
 * Billing utilities for Stripe integration
 * Handles premium access checking and subscription management
 */

import { createClient } from './client';

export interface BillingStatus {
  hasAccess: boolean;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
}

/**
 * Check if user has active premium access
 * Uses secure API route instead of direct Supabase calls
 */
export async function checkPremiumAccess(): Promise<boolean> {
  try {
    const response = await fetch('/api/billing/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to check premium access:', response.status);
      return false;
    }
    
    const data = await response.json();
    return data.hasAccess === true;
    
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

/**
 * Get detailed billing status for a user
 * Returns access status and subscription details
 */
export async function getBillingStatus(): Promise<BillingStatus> {
  try {
    const response = await fetch('/api/billing/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to get billing status:', response.status);
      return { hasAccess: false };
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error getting billing status:', error);
    return { hasAccess: false };
  }
}

/**
 * Create a checkout session for subscription
 * Calls the create-checkout-session API route
 */
export async function createCheckoutSession(priceId?: string): Promise<string> {
  const response = await fetch('/api/billing/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priceId ? { price_id: priceId } : {}),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create checkout session: ${error.error || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.url;
}

/**
 * Create a customer portal session for subscription management
 * Calls the create-portal-session API route
 */
export async function createPortalSession(): Promise<string> {
  const response = await fetch('/api/billing/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create portal session: ${error.error || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.url;
}
