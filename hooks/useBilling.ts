/**
 * React hook for managing billing and premium access
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { checkPremiumAccess, getBillingStatus, createCheckoutSession, createPortalSession, BillingStatus } from '../utils/supabase/billing';

export function useBilling() {
  const [user, setUser] = useState<any>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatus>({ hasAccess: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCheckedUserId = useRef<string | null>(null);
  const isCheckingRef = useRef(false);

  // Get user on mount and listen for auth changes
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Listen for auth changes - only update if user ID actually changed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;
      // Only update if user ID changed (prevents unnecessary updates from token refreshes)
      setUser((prevUser: any) => {
        if (prevUser?.id === newUserId) {
          return prevUser; // Same user, don't update reference
        }
        return session?.user ?? null;
      });
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Check premium access - memoized to prevent unnecessary re-creations
  const checkAccess = useCallback(async () => {
    // Prevent duplicate calls
    if (isCheckingRef.current) {
      return;
    }

    if (!user) {
      setBillingStatus({ hasAccess: false });
      setLoading(false);
      lastCheckedUserId.current = null;
      return;
    }

    // Only check if user ID actually changed
    if (lastCheckedUserId.current === user.id) {
      return;
    }

    try {
      isCheckingRef.current = true;
      setLoading(true);
      setError(null);
      const status = await getBillingStatus();
      setBillingStatus(status);
      lastCheckedUserId.current = user.id;
    } catch (err) {
      console.error('Error checking billing status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check billing status');
      setBillingStatus({ hasAccess: false });
    } finally {
      setLoading(false);
      isCheckingRef.current = false;
    }
  }, [user?.id]); // Only recreate when user ID changes

  // Initialize billing status when user changes
  // Only check access when user ID actually changes, not when user object reference changes
  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

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
