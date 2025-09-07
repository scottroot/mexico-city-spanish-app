-- Spanish Language App Database Setup
-- Run these commands in your Supabase SQL editor

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create progress table
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT CHECK (game_type IN ('grammar', 'vocabulary', 'pronunciation')) NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_games_completed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Create RLS Policies for progress
CREATE POLICY "Users can view own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.progress
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Create RLS Policies for user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);

-- 8. Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger to automatically create profile and stats when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Function to update user stats when progress is updated
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  user_id_val UUID;
  total_completed INTEGER;
  total_score_val INTEGER;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
BEGIN
  -- Get user_id from the trigger context
  IF TG_OP = 'DELETE' THEN
    user_id_val := OLD.user_id;
  ELSE
    user_id_val := NEW.user_id;
  END IF;
  
  -- Calculate total completed games
  SELECT COUNT(*) INTO total_completed
  FROM public.progress 
  WHERE user_id = user_id_val AND completed = true;
  
  -- Calculate total score
  SELECT COALESCE(SUM(score), 0) INTO total_score_val
  FROM public.progress 
  WHERE user_id = user_id_val;
  
  -- Calculate current streak (simplified - you might want to implement more sophisticated logic)
  SELECT COALESCE(MAX(current_streak), 0) INTO current_streak_val
  FROM public.user_stats
  WHERE user_id = user_id_val;
  
  -- Get longest streak
  SELECT COALESCE(MAX(longest_streak), 0) INTO longest_streak_val
  FROM public.user_stats
  WHERE user_id = user_id_val;
  
  -- Update or insert user stats
  INSERT INTO public.user_stats (
    user_id, 
    total_games_completed, 
    total_score, 
    current_streak,
    longest_streak,
    last_played,
    updated_at
  )
  VALUES (
    user_id_val,
    total_completed,
    total_score_val,
    current_streak_val,
    GREATEST(longest_streak_val, current_streak_val),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_games_completed = EXCLUDED.total_games_completed,
    total_score = EXCLUDED.total_score,
    current_streak = EXCLUDED.current_streak,
    longest_streak = EXCLUDED.longest_streak,
    last_played = EXCLUDED.last_played,
    updated_at = NOW();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Trigger to update stats when progress changes
DROP TRIGGER IF EXISTS on_progress_updated ON public.progress;
CREATE TRIGGER on_progress_updated
  AFTER INSERT OR UPDATE OR DELETE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- 12. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_updated_at ON public.progress;
CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_game_type ON public.progress(game_type);
CREATE INDEX IF NOT EXISTS idx_progress_created_at ON public.progress(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON public.progress(completed);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_score ON public.user_stats(total_score);

-- 15. Create a view for user progress summary
CREATE OR REPLACE VIEW public.user_progress_summary AS
SELECT 
  p.id as user_id,
  p.email,
  p.name,
  p.level,
  us.total_games_completed,
  us.total_score,
  us.current_streak,
  us.longest_streak,
  us.last_played,
  COUNT(pr.id) as total_games_played,
  COUNT(CASE WHEN pr.completed = true THEN 1 END) as completed_games,
  AVG(pr.score) as average_score,
  MAX(pr.created_at) as last_game_played
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.progress pr ON p.id = pr.user_id
GROUP BY p.id, p.email, p.name, p.level, us.total_games_completed, us.total_score, us.current_streak, us.longest_streak, us.last_played;

-- 16. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.progress TO anon, authenticated;
GRANT ALL ON public.user_stats TO anon, authenticated;
GRANT SELECT ON public.user_progress_summary TO anon, authenticated;

-- 17. Enable realtime for progress updates (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
