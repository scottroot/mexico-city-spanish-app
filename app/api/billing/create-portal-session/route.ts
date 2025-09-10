/**
 * API Route: Create Stripe Customer Portal Session
 * Creates a Stripe billing portal session for subscription management
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer from database
    const { data: row, error } = await supabase
      .from("billing.customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    
    if (error || !row) {
      return NextResponse.json({ error: 'No customer found' }, { status: 400 });
    }

    // Create portal session
    const portal = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${SITE_URL}/account`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
