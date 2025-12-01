-- Add focus_display_name column to translation_quizzes table

-- Add column for short, human-readable quiz focus names
ALTER TABLE translation_quizzes
ADD COLUMN IF NOT EXISTS focus_display_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN translation_quizzes.focus_display_name IS
'Short, human-readable name for quiz focus (2-5 words). Generated via AI for custom text or preset for predefined focus areas.';
