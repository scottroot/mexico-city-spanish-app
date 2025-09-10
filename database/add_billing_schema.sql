-- Billing schema for Stripe integration
-- Creates dedicated billing schema with customers, subscriptions, and events tables

-- Create billing schema
CREATE SCHEMA IF NOT EXISTS billing;

-- One Stripe customer per Supabase user
CREATE TABLE IF NOT EXISTS billing.customers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription snapshots (Stripe is source of truth, we mirror)
CREATE TABLE IF NOT EXISTS billing.subscriptions (
  id TEXT PRIMARY KEY,                              -- Stripe sub id
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price_id TEXT,
  status TEXT NOT NULL CHECK (status IN
    ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid')),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  raw JSONB,                                        -- optional: full Stripe object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotency for webhooks
CREATE TABLE IF NOT EXISTS billing.events (
  id TEXT PRIMARY KEY,                              -- Stripe event id
  type TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS billing_subscriptions_user_idx ON billing.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS billing_subscriptions_status_idx ON billing.subscriptions(status);

-- Helper view: active access
CREATE OR REPLACE VIEW billing.active_access AS
SELECT
  u.id AS user_id,
  EXISTS (
    SELECT 1 FROM billing.subscriptions s
    WHERE s.user_id = u.id
      AND s.status IN ('trialing','active')
      AND (s.current_period_end IS NULL OR s.current_period_end > NOW())
  ) AS has_access
FROM auth.users u;

-- Optional: expose a cheap RPC for gating
CREATE OR REPLACE FUNCTION billing.has_access(uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, extensions, pg_temp, billing
AS $$
  SELECT COALESCE(a.has_access, FALSE)
  FROM billing.active_access a
  WHERE a.user_id = uid;
$$;

-- Also create in public schema for easier access
CREATE OR REPLACE FUNCTION public.has_access(uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, extensions, pg_temp, billing
AS $$
  SELECT COALESCE(a.has_access, FALSE)
  FROM billing.active_access a
  WHERE a.user_id = uid;
$$;

-- Row Level Security
ALTER TABLE billing.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "read own customer" ON billing.customers;
DROP POLICY IF EXISTS "read own subs" ON billing.subscriptions;

-- Create policies
CREATE POLICY "read own customer" ON billing.customers
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "read own subs" ON billing.subscriptions
FOR SELECT USING (auth.uid() = user_id);

-- No insert/update/delete policies => only service role can write
