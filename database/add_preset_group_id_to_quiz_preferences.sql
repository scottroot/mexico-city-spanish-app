-- Add preset_group_id column to user_quiz_preferences table
-- This stores the selected preset verb group ID for quiz preferences

ALTER TABLE user_quiz_preferences
ADD COLUMN IF NOT EXISTS preset_group_id TEXT;

COMMENT ON COLUMN user_quiz_preferences.preset_group_id IS 'ID of the selected preset verb group (e.g., "top-100", "travel", etc.)';
