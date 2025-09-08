-- Stories Table Setup
-- This script creates the stories table and related indexes for the Spanish Language App

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of title
  level TEXT NOT NULL, -- 'beginner', 'high_beginner', 'low_intermediate', 'high_intermediate', 'advanced'
  reading_time TEXT, -- '3 min', '4 min', etc.
  text TEXT NOT NULL,
  enhanced_text TEXT, -- if available (with audio tags)
  featured_image_url TEXT, -- URL to the image in Supabase Storage
  audio_url TEXT, -- URL to the MP3 in Supabase Storage
  alignment_data JSONB, -- store the alignment JSON for audio sync
  normalized_alignment_data JSONB, -- store normalized alignment data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_level ON stories(level);
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to stories (they are educational content)
CREATE POLICY "Allow public read access to stories" ON stories
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete stories (for admin purposes)
CREATE POLICY "Allow authenticated users to manage stories" ON stories
  FOR ALL USING (auth.role() = 'authenticated');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stories_updated_at 
  BEFORE UPDATE ON stories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE stories IS 'Spanish learning stories with audio, images, and text alignment data';
COMMENT ON COLUMN stories.slug IS 'URL-friendly version of title for routing (e.g., "la-nina-y-el-gato")';
COMMENT ON COLUMN stories.level IS 'Difficulty level: beginner, high_beginner, low_intermediate, high_intermediate, advanced';
COMMENT ON COLUMN stories.alignment_data IS 'JSON data for syncing audio playback with text highlighting';
COMMENT ON COLUMN stories.normalized_alignment_data IS 'Normalized alignment data for consistent audio-text sync';
