-- Add image column to games table
-- Run this in your Supabase SQL editor

-- 1. Add image column to games table
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add description column for better game cards
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Update existing games with default images and descriptions
UPDATE public.games 
SET 
  image_url = CASE 
    WHEN type = 'vocabulary' THEN 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center'
    WHEN type = 'grammar' THEN 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center'
    WHEN type = 'pronunciation' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
    WHEN type = 'shopping' THEN 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center'
    ELSE 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center'
  END,
  description = CASE 
    WHEN type = 'vocabulary' THEN 'Learn Spanish vocabulary through interactive exercises and visual aids.'
    WHEN type = 'grammar' THEN 'Master Spanish grammar rules with practical examples and exercises.'
    WHEN type = 'pronunciation' THEN 'Improve your Spanish pronunciation with audio exercises and feedback.'
    WHEN type = 'shopping' THEN 'Practice Spanish in real-world shopping scenarios and conversations.'
    ELSE 'Interactive Spanish learning game to improve your language skills.'
  END
WHERE image_url IS NULL OR description IS NULL;

-- 4. Verify the changes
SELECT 'Games table updated with image_url and description columns' as status;
SELECT id, title, type, image_url, description FROM public.games LIMIT 5;
