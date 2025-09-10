/**
 * React hook for managing billing and premium access
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { checkPremiumAccess, getBillingStatus, createCheckoutSession, createPortalSession, BillingStatus } from '../utils/supabase/billing';

export function useBilling() {
  const [user, setUser] = useState<any>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatus>({ hasAccess: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user on mount
  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Check premium access
  const checkAccess = async () => {
    if (!user) {
      setBillingStatus({ hasAccess: false });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const status = await getBillingStatus();
      setBillingStatus(status);
    } catch (err) {
      console.error('Error checking billing status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check billing status');
      setBillingStatus({ hasAccess: false });
    } finally {
      setLoading(false);
    }
  };

  // Initialize billing status when user changes
  useEffect(() => {
    checkAccess();
  }, [user]);

  // Go Pro - redirect to checkout
  const goPro = async (priceId?: string) => {
    if (!user) {
      throw new Error('User must be logged in to subscribe');
    }

    try {
      setLoading(true);
      const checkoutUrl = await createCheckoutSession(priceId);
      window.location.assign(checkoutUrl);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manage billing - redirect to portal
  const manageBilling = async () => {
    if (!user) {
      throw new Error('User must be logged in to manage billing');
    }

    try {
      setLoading(true);
      const portalUrl = await createPortalSession();
      window.location.assign(portalUrl);
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create portal session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    hasAccess: billingStatus.hasAccess,
    subscription: billingStatus.subscription,
    loading,
    error,
    goPro,
    manageBilling,
    refresh: checkAccess,
  };
}
