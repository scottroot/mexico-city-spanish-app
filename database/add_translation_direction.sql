-- Migration to add translation direction support
-- Run this if you already ran add_translation_game.sql before direction support was added

-- 1. Add translation_direction column to translation_quizzes
ALTER TABLE public.translation_quizzes
ADD COLUMN IF NOT EXISTS translation_direction TEXT CHECK (translation_direction IN ('es_to_en', 'en_to_es')) DEFAULT 'es_to_en';

-- 2. Make spanish_phrase nullable (if it's currently NOT NULL)
-- This is needed because en_to_es questions won't have a spanish_phrase
DO $$
BEGIN
  -- Check if column has NOT NULL constraint and remove it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'translation_questions' 
    AND column_name = 'spanish_phrase'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.translation_questions
    ALTER COLUMN spanish_phrase DROP NOT NULL;
  END IF;
END $$;

-- 3. Add english_phrase column to translation_questions
ALTER TABLE public.translation_questions
ADD COLUMN IF NOT EXISTS english_phrase TEXT;

-- 4. Update constraint to allow either spanish_phrase OR english_phrase (not both required)
ALTER TABLE public.translation_questions
DROP CONSTRAINT IF EXISTS translation_questions_spanish_phrase_check;

-- Add check constraint to ensure at least one phrase exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'translation_questions_phrase_check'
  ) THEN
    ALTER TABLE public.translation_questions
    ADD CONSTRAINT translation_questions_phrase_check
    CHECK ((spanish_phrase IS NOT NULL) OR (english_phrase IS NOT NULL));
  END IF;
END $$;

-- 5. Verify the changes
SELECT 'Translation direction support added' as status;
SELECT translation_direction, COUNT(*) as count 
FROM public.translation_quizzes 
GROUP BY translation_direction;

