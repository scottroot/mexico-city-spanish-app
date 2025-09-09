-- SQL script to add the shopping game to the database
-- Run this directly in your Supabase SQL editor

INSERT INTO games (
  id,
  title,
  type,
  difficulty,
  content,
  created_at,
  updated_at
) VALUES (
  'shopping-game-001',
  'Tienda Checkout - Price Listening',
  'shopping',
  'intermediate',
  '{"questions": []}',
  NOW(),
  NOW()
);

-- Verify the game was added
SELECT * FROM games WHERE id = 'shopping-game-001';
