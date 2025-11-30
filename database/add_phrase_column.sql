-- Migration to add phrase column to translation_questions
-- This consolidates spanish_phrase and english_phrase into a single phrase column

-- Add phrase column
ALTER TABLE public.translation_questions
ADD COLUMN IF NOT EXISTS phrase TEXT;

-- Add translation_direction column to track which direction this question is for
ALTER TABLE public.translation_questions
ADD COLUMN IF NOT EXISTS translation_direction TEXT CHECK (translation_direction IN ('es_to_en', 'en_to_es'));

-- Migrate existing data: copy from spanish_phrase or english_phrase to phrase
-- Also set translation_direction based on which field has data
UPDATE public.translation_questions
SET phrase = COALESCE(spanish_phrase, english_phrase),
    translation_direction = CASE 
      WHEN spanish_phrase IS NOT NULL THEN 'es_to_en'
      WHEN english_phrase IS NOT NULL THEN 'en_to_es'
      ELSE 'es_to_en' -- default
    END
WHERE phrase IS NULL;

-- Make phrase and translation_direction NOT NULL after migration
ALTER TABLE public.translation_questions
ALTER COLUMN phrase SET NOT NULL;

ALTER TABLE public.translation_questions
ALTER COLUMN translation_direction SET NOT NULL;

-- Set default for translation_direction
ALTER TABLE public.translation_questions
ALTER COLUMN translation_direction SET DEFAULT 'es_to_en';

-- Update the check constraint to allow phrase instead of requiring spanish_phrase OR english_phrase
ALTER TABLE public.translation_questions
DROP CONSTRAINT IF EXISTS translation_questions_phrase_check;

ALTER TABLE public.translation_questions
ADD CONSTRAINT translation_questions_phrase_check
CHECK (phrase IS NOT NULL);

-- Note: We keep spanish_phrase and english_phrase columns for backward compatibility
-- but new inserts should use the phrase column

