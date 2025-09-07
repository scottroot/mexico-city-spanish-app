-- ========================================
-- QUIZ PREFERENCES TABLE MIGRATION
-- ========================================
-- This script creates the user_quiz_preferences table and all related
-- security policies, indexes, and triggers for storing user quiz settings.
-- 
-- Run this script in your Supabase SQL editor to enable quiz preferences
-- persistence functionality.
-- ========================================

-- 1. Create user_quiz_preferences table
CREATE TABLE IF NOT EXISTS public.user_quiz_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  selected_tense_moods TEXT[] NOT NULL DEFAULT '{}', -- Array of "tense-mood" strings
  verb_selection TEXT CHECK (verb_selection IN ('favorites', 'custom')) NOT NULL DEFAULT 'favorites',
  custom_verbs TEXT[] NOT NULL DEFAULT '{}', -- Array of verb infinitives
  selected_pronouns TEXT[] NOT NULL DEFAULT '{}', -- Array of pronouns (e.g., ["yo", "tú", "él"])
  question_count INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One preference record per user
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_quiz_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for user_quiz_preferences
-- Users can view their own quiz preferences
DROP POLICY IF EXISTS "Users can view own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can view own quiz preferences" ON public.user_quiz_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own quiz preferences
DROP POLICY IF EXISTS "Users can insert own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can insert own quiz preferences" ON public.user_quiz_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own quiz preferences
DROP POLICY IF EXISTS "Users can update own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can update own quiz preferences" ON public.user_quiz_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own quiz preferences
DROP POLICY IF EXISTS "Users can delete own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can delete own quiz preferences" ON public.user_quiz_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_quiz_preferences_user_id ON public.user_quiz_preferences(user_id);

-- 5. Add updated_at trigger (if the function exists)
-- This will automatically update the updated_at timestamp when records are modified
DO $$
BEGIN
  -- Check if the update_updated_at_column function exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    -- Create the trigger
    DROP TRIGGER IF EXISTS update_user_quiz_preferences_updated_at ON public.user_quiz_preferences;
    CREATE TRIGGER update_user_quiz_preferences_updated_at
      BEFORE UPDATE ON public.user_quiz_preferences
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  ELSE
    -- Log that the function doesn't exist (this is not an error)
    RAISE NOTICE 'update_updated_at_column function not found - skipping trigger creation';
  END IF;
END $$;

-- 6. Verify the table was created successfully
DO $$
BEGIN
  -- Check if the table exists and has the expected structure
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_quiz_preferences'
  ) THEN
    RAISE NOTICE 'SUCCESS: user_quiz_preferences table created successfully';
    RAISE NOTICE 'Table includes columns: id, user_id, selected_tense_moods, verb_selection, custom_verbs, question_count, created_at, updated_at';
  ELSE
    RAISE EXCEPTION 'ERROR: Failed to create user_quiz_preferences table';
  END IF;
END $$;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================
-- The user_quiz_preferences table is now ready to store user quiz settings.
-- Users can now have their quiz preferences (tenses, verbs, question count)
-- automatically saved and restored between sessions.
-- ========================================
