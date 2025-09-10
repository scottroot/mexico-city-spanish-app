-- Migration to add sort_order column for proper difficulty sorting
-- Run this in your Supabase SQL editor

-- 1. Add sort_order column to games table
ALTER TABLE public.games 
ADD COLUMN sort_order INTEGER;

-- 2. Update existing games with sort_order values
UPDATE public.games 
SET sort_order = CASE 
  WHEN difficulty = 'beginner' THEN 1
  WHEN difficulty = 'intermediate' THEN 2  
  WHEN difficulty = 'advanced' THEN 3
  ELSE 4
END;

-- 3. Make sort_order NOT NULL and add default
ALTER TABLE public.games 
ALTER COLUMN sort_order SET NOT NULL,
ALTER COLUMN sort_order SET DEFAULT 1;

-- 4. Create index for better performance
CREATE INDEX idx_games_sort_order ON public.games(sort_order);

-- 5. Verify the changes
SELECT id, title, difficulty, sort_order 
FROM public.games 
ORDER BY sort_order;

-- 6. Show the constraint update needed for future games
SELECT 'For future games, use sort_order: 1=beginner, 2=intermediate, 3=advanced' as note;
