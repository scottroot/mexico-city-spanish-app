# Stripe Integration Setup Guide

This guide covers setting up Stripe integration for monthly premium subscriptions in the Spanish Language Learning App.

## Prerequisites

1. Stripe account with API keys
2. Supabase project with database access
3. Environment variables configured

## Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_... # Get this from Stripe Dashboard
STRIPE_MONTHLY_PRICE_ID=price_... # Your monthly subscription price ID

# Supabase Configuration (should already exist)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ... # Your anon key
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Your service role key

# Site Configuration
SITE_URL=http://localhost:3000 # or your production URL
```

## Database Setup

1. **Run the billing schema migration:**
   - Copy the contents of `database/add_billing_schema.sql`
   - Paste into your Supabase SQL Editor
   - Click Run

2. **Verify the schema was created:**
```sql
SELECT * FROM billing.customers LIMIT 1;
SELECT * FROM billing.subscriptions LIMIT 1;
SELECT * FROM billing.events LIMIT 1;
```

## Stripe Dashboard Setup

1. **Create a Product and Price:**
   - Go to Products in Stripe Dashboard
   - Create a new product (e.g., "Spanish Learning Pro")
   - Add a recurring monthly price
   - Copy the Price ID to `STRIPE_MONTHLY_PRICE_ID`

2. **Set up Webhook:**
   - Go to Webhooks in Stripe Dashboard
   - Add endpoint: `https://spanish.scotthendrix.dev/api/billing/stripe-webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## API Routes

The Stripe integration uses Next.js API routes located in:
- `app/api/billing/create-checkout-session/route.ts`
- `app/api/billing/create-portal-session/route.ts` 
- `app/api/billing/stripe-webhook/route.ts`

These routes are automatically deployed with your Next.js application.

## Local Testing

1. **Start local development:**
```bash
npm run dev
```

2. **Forward Stripe webhooks to local:**
```bash
stripe listen --forward-to http://localhost:3000/api/billing/stripe-webhook
```

3. **Test with Stripe test cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Usage in Components

### Basic Premium Gating

```tsx
import { PremiumGate } from '@/components/PremiumGate';

function MyComponent() {
  return (
    <PremiumGate title="Premium Feature" description="This requires a Pro subscription">
      <div>Premium content here</div>
    </PremiumGate>
  );
}
```

### Using the Billing Hook

```tsx
import { useBilling } from '@/hooks/useBilling';

function MyComponent() {
  const { hasAccess, loading, goPro, manageBilling } = useBilling();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {hasAccess ? (
        <button onClick={manageBilling}>Manage Billing</button>
      ) : (
        <button onClick={goPro}>Go Pro</button>
      )}
    </div>
  );
}
```

## Production Deployment

1. **Update environment variables** with production Stripe keys
2. **Deploy your Next.js application** to production
3. **Update webhook URL** in Stripe Dashboard to production URL: `https://spanish.scotthendrix.dev/api/billing/stripe-webhook`
4. **Test with real payment methods** (use small amounts)

## Troubleshooting

### Common Issues

1. **Webhook not receiving events:**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check Next.js API route logs

2. **Subscription not updating:**
   - Check database RLS policies
   - Verify service role key has access
   - Check Next.js API route logs for errors

3. **Checkout session fails:**
   - Verify Stripe secret key
   - Check price ID is correct
   - Ensure user is authenticated

### Debug Commands

```bash
# Test webhook locally
stripe trigger checkout.session.completed

# Check Next.js API route logs in your deployment platform
# or check browser network tab for API calls
```

## Security Notes

- Never expose Stripe secret keys in client-side code
- Use service role key only in server-side API routes
- Implement proper RLS policies for billing data
- Validate webhook signatures in production
