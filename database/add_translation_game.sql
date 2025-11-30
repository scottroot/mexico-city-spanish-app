-- Migration to add Translation game support
-- Run this in your Supabase SQL editor

-- 1. Create translation_questions table
CREATE TABLE IF NOT EXISTS public.translation_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  spanish_phrase TEXT, -- For es_to_en direction
  english_phrase TEXT, -- For en_to_es direction
  custom_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((spanish_phrase IS NOT NULL) OR (english_phrase IS NOT NULL))
);

-- 2. Create openai_token_usage table
CREATE TABLE IF NOT EXISTS public.openai_token_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.translation_questions(id) ON DELETE CASCADE NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  model TEXT NOT NULL,
  purpose TEXT CHECK (purpose IN ('generate_question', 'evaluate_answer')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create translation_quizzes table
CREATE TABLE IF NOT EXISTS public.translation_quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  custom_focus TEXT,
  translation_direction TEXT CHECK (translation_direction IN ('es_to_en', 'en_to_es')) DEFAULT 'es_to_en',
  questions_count INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Update games table constraint to include 'translation'
ALTER TABLE public.games 
DROP CONSTRAINT IF EXISTS games_type_check;

ALTER TABLE public.games 
ADD CONSTRAINT games_type_check 
CHECK (type IN ('grammar', 'vocabulary', 'pronunciation', 'shopping', 'translation'));

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_translation_questions_user_id ON public.translation_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_translation_questions_created_at ON public.translation_questions(created_at);

CREATE INDEX IF NOT EXISTS idx_openai_token_usage_user_id ON public.openai_token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_openai_token_usage_question_id ON public.openai_token_usage(question_id);
CREATE INDEX IF NOT EXISTS idx_openai_token_usage_created_at ON public.openai_token_usage(created_at);

CREATE INDEX IF NOT EXISTS idx_translation_quizzes_user_id ON public.translation_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_translation_quizzes_created_at ON public.translation_quizzes(created_at);

-- 6. Enable Row Level Security
ALTER TABLE public.translation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openai_token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_quizzes ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for translation_questions
DROP POLICY IF EXISTS "Users can view own translation questions" ON public.translation_questions;
CREATE POLICY "Users can view own translation questions" ON public.translation_questions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own translation questions" ON public.translation_questions;
CREATE POLICY "Users can insert own translation questions" ON public.translation_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Create RLS policies for openai_token_usage
-- Users can only view their own token usage
DROP POLICY IF EXISTS "Users can view own token usage" ON public.openai_token_usage;
CREATE POLICY "Users can view own token usage" ON public.openai_token_usage
  FOR SELECT USING (auth.uid() = user_id);

-- No INSERT policy - token usage must be inserted via database function only

-- 9. Create database function to insert token usage (server-side only)
-- This function uses SECURITY DEFINER to bypass RLS, but validates user_id matches auth.uid()
CREATE OR REPLACE FUNCTION public.insert_token_usage(
  p_user_id UUID,
  p_question_id UUID,
  p_prompt_tokens INTEGER,
  p_completion_tokens INTEGER,
  p_total_tokens INTEGER,
  p_model TEXT,
  p_purpose TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_usage_id UUID;
BEGIN
  -- Security check: ensure the user_id matches the authenticated user
  -- This prevents users from inserting token usage for other users
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'User ID mismatch: cannot insert token usage for another user';
  END IF;

  -- Validate purpose
  IF p_purpose NOT IN ('generate_question', 'evaluate_answer') THEN
    RAISE EXCEPTION 'Invalid purpose: must be generate_question or evaluate_answer';
  END IF;

  -- Insert token usage
  INSERT INTO public.openai_token_usage (
    user_id,
    question_id,
    prompt_tokens,
    completion_tokens,
    total_tokens,
    model,
    purpose
  )
  VALUES (
    p_user_id,
    p_question_id,
    p_prompt_tokens,
    p_completion_tokens,
    p_total_tokens,
    p_model,
    p_purpose
  )
  RETURNING id INTO v_token_usage_id;

  RETURN v_token_usage_id;
END;
$$;

-- 10. Create RLS policies for translation_quizzes
DROP POLICY IF EXISTS "Users can view own translation quizzes" ON public.translation_quizzes;
CREATE POLICY "Users can view own translation quizzes" ON public.translation_quizzes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own translation quizzes" ON public.translation_quizzes;
CREATE POLICY "Users can insert own translation quizzes" ON public.translation_quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own translation quizzes" ON public.translation_quizzes;
CREATE POLICY "Users can update own translation quizzes" ON public.translation_quizzes
  FOR UPDATE USING (auth.uid() = user_id);

-- 11. Insert the translation game
INSERT INTO public.games (id, title, type, difficulty, content) VALUES
('translation-game', 'Translation Practice', 'translation', 'intermediate', '{}')
ON CONFLICT (id) DO NOTHING;

-- 12. Verify the changes
SELECT 'Translation game tables created' as status;
SELECT type, COUNT(*) as count FROM public.games GROUP BY type;

