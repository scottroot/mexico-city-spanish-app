-- Add study guide and mistakes tracking to translation_quizzes table

-- Add study_guide column to store AI-generated study guide
ALTER TABLE translation_quizzes
ADD COLUMN IF NOT EXISTS study_guide TEXT;

-- Add mistakes_count to track number of mistakes
ALTER TABLE translation_quizzes
ADD COLUMN IF NOT EXISTS mistakes_count INTEGER DEFAULT 0;

-- Optional: Add quiz_history to store individual mistakes (JSONB for flexibility)
-- This allows reviewing specific mistakes later
ALTER TABLE translation_quizzes
ADD COLUMN IF NOT EXISTS quiz_history JSONB;

-- Add comments for documentation
COMMENT ON COLUMN translation_quizzes.study_guide IS 'AI-generated personalized study guide based on user mistakes';
COMMENT ON COLUMN translation_quizzes.mistakes_count IS 'Number of incorrect answers in the quiz';
COMMENT ON COLUMN translation_quizzes.quiz_history IS 'Optional: Detailed history of each question and answer';
