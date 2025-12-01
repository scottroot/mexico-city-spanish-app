-- Add tier column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free' NOT NULL;

-- Add a check constraint to ensure valid tier values
ALTER TABLE public.profiles
ADD CONSTRAINT valid_tier CHECK (tier IN ('free', 'premium', 'pro'));

-- Update any existing users to have 'free' tier
UPDATE public.profiles
SET tier = 'free'
WHERE tier IS NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.profiles.tier IS 'User subscription tier: free (default), premium (paid), or pro (higher tier)';
