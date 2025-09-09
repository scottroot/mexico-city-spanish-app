-- Migration to add 'shopping' game type support
-- Run this in your Supabase SQL editor

-- 1. Update the games table constraint to include 'shopping'
ALTER TABLE public.games 
DROP CONSTRAINT IF EXISTS games_type_check;

ALTER TABLE public.games 
ADD CONSTRAINT games_type_check 
CHECK (type IN ('grammar', 'vocabulary', 'pronunciation', 'shopping'));

-- 2. Update the progress table constraint to include 'shopping' 
ALTER TABLE public.progress 
DROP CONSTRAINT IF EXISTS progress_game_type_check;

ALTER TABLE public.progress 
ADD CONSTRAINT progress_game_type_check 
CHECK (game_type IN ('grammar', 'vocabulary', 'pronunciation', 'custom_quiz', 'shopping'));

-- 3. Insert the shopping game
INSERT INTO public.games (id, title, type, difficulty, content) VALUES
('shopping-game-001', 'Tienda Checkout - Price Listening', 'shopping', 'intermediate', '{
  "questions": []
}')
ON CONFLICT (id) DO NOTHING;

-- 4. Verify the changes
SELECT 'Games table constraint updated' as status;
SELECT type, COUNT(*) as count FROM public.games GROUP BY type;

SELECT 'Progress table constraint updated' as status;
SELECT game_type, COUNT(*) as count FROM public.progress GROUP BY game_type;
