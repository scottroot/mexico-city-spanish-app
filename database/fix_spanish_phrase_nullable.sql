-- Quick fix: Make spanish_phrase nullable
-- Run this immediately to fix the NOT NULL constraint error

ALTER TABLE public.translation_questions
ALTER COLUMN spanish_phrase DROP NOT NULL;

-- Verify the change
SELECT 
  column_name, 
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'translation_questions'
  AND column_name IN ('spanish_phrase', 'english_phrase');

