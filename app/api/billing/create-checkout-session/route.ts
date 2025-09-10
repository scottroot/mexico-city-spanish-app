/**
 * API Route: Create Stripe Checkout Session
 * Creates or reuses a Stripe Customer, then a subscription-mode Checkout Session
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });
const DEFAULT_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID!;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { price_id } = await request.json().catch(() => ({}));
    const priceId = price_id ?? DEFAULT_PRICE_ID;

    // Get or create Stripe customer
    const { data: custRow } = await supabase
      .from("billing.customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = custRow?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      
      await supabase.from("billing.customers")
        .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/billing/cancelled`,
      client_reference_id: user.id,
      subscription_data: {
        metadata: { supabase_user_id: user.id, price_id: priceId },
      },
      metadata: { supabase_user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
