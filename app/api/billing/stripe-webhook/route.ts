/**
 * API Route: Stripe Webhook Handler
 * Handles subscription lifecycle and idempotency
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
    }

    const supabase = createClient();

    // Idempotency check
    const { data: existingEvent } = await supabase
      .from("billing.events")
      .select("id")
      .eq("id", event.id)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ message: 'Duplicate event' }, { status: 200 });
    }

    // Record the event
    await supabase.from("billing.events")
      .insert({ id: event.id, type: event.type });

    // Process the event
    await processWebhookEvent(event, supabase);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function processWebhookEvent(event: Stripe.Event, supabase: any) {
  async function upsertFromSubscription(sub: Stripe.Subscription) {
    // Get user id from metadata
    let supabaseUserId = sub.metadata?.supabase_user_id as string | undefined;
    
    if (!supabaseUserId) {
      if (typeof sub.customer === "string") {
        const customer = await stripe.customers.retrieve(sub.customer) as Stripe.Customer;
        supabaseUserId = customer.metadata?.supabase_user_id as string | undefined;
      }
    }
    
    if (!supabaseUserId) {
      console.error('No Supabase user ID found for subscription:', sub.id);
      return;
    }

    const payload = {
      id: sub.id,
      user_id: supabaseUserId,
      price_id: sub.items.data[0]?.price?.id ?? null,
      status: sub.status,
      current_period_end: sub.current_period_end 
        ? new Date(sub.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      raw: sub as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    await supabase.from("billing.subscriptions").upsert(payload, { onConflict: "id" });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const subId = typeof session.subscription === "string" 
          ? session.subscription 
          : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subId);
        await upsertFromSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertFromSubscription(subscription);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}
