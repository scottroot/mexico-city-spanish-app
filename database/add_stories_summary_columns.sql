-- Add summary columns to stories table
-- Run this in your Supabase SQL editor

-- Add summary column (Spanish)
ALTER TABLE stories 
ADD COLUMN summary TEXT;

-- Add summary_english column (English translation)
ALTER TABLE stories 
ADD COLUMN summary_english TEXT;

-- Add comments for documentation
COMMENT ON COLUMN stories.summary IS 'Brief summary of the story in Spanish';
COMMENT ON COLUMN stories.summary_english IS 'Brief summary of the story in English';

-- Optional: Add indexes if you plan to search by summary content
-- CREATE INDEX IF NOT EXISTS idx_stories_summary ON stories USING gin(to_tsvector('spanish', summary));
-- CREATE INDEX IF NOT EXISTS idx_stories_summary_english ON stories USING gin(to_tsvector('english', summary_english));
