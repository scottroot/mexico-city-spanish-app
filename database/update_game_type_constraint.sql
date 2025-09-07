-- Update the game_type constraint to include 'custom_quiz'
-- This allows the custom quiz to save progress properly

-- Drop the existing constraint
ALTER TABLE public.progress DROP CONSTRAINT IF EXISTS progress_game_type_check;

-- Add the new constraint with 'custom_quiz' included
ALTER TABLE public.progress ADD CONSTRAINT progress_game_type_check 
  CHECK (game_type IN ('grammar', 'vocabulary', 'pronunciation', 'custom_quiz'));

-- Verify the constraint was added
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.progress'::regclass 
  AND conname = 'progress_game_type_check';
