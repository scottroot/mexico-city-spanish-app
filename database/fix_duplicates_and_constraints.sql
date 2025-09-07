?-- Fix duplicates and add constraints for verb_conjugations table
-- Run this in your Supabase SQL editor

-- 1. First, let's see how many duplicates we have
SELECT 
  infinitive, 
  mood, 
  tense, 
  COUNT(*) as count
FROM public.verb_conjugations 
GROUP BY infinitive, mood, tense 
HAVING COUNT(*) > 1
ORDER BY count DESC
LIMIT 10;

-- 2. Remove duplicates, keeping only the first occurrence
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY infinitive, mood, tense 
      ORDER BY created_at ASC
    ) as rn
  FROM public.verb_conjugations
)
DELETE FROM public.verb_conjugations 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 3. Add unique constraint to prevent future duplicates
ALTER TABLE public.verb_conjugations 
ADD CONSTRAINT unique_verb_conjugation 
UNIQUE (infinitive, mood, tense);

-- 4. Verify the cleanup
SELECT 
  COUNT(*) as total_conjugations,
  COUNT(DISTINCT CONCAT(infinitive, '-', mood, '-', tense)) as unique_combinations
FROM public.verb_conjugations;

-- 5. Show the unique tense/mood combinations
SELECT DISTINCT mood, tense 
FROM public.verb_conjugations 
ORDER BY mood, tense;
