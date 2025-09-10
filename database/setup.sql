-- Spanish Language App Database Setup
-- Run these commands in your Supabase SQL editor
--
-- Note: For stories functionality, also run:
-- database/add_stories_table.sql

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
  game_type TEXT CHECK (game_type IN ('grammar', 'vocabulary', 'pronunciation', 'custom_quiz', 'shopping')) NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 10, -- maximum possible score for the game
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completion_time INTEGER DEFAULT 0, -- alias for time_spent (compatibility)
  mistakes INTEGER DEFAULT 0, -- number of mistakes made
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('grammar', 'vocabulary', 'pronunciation', 'shopping')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create user_stats table
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

-- 5. Create user_favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  verb_infinitive TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, verb_infinitive)
);

-- 6. Create verbs table
CREATE TABLE IF NOT EXISTS public.verbs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  infinitive TEXT UNIQUE NOT NULL,
  infinitive_english TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create verb_conjugations table
CREATE TABLE IF NOT EXISTS public.verb_conjugations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verb_id UUID REFERENCES public.verbs(id) ON DELETE CASCADE NOT NULL,
  infinitive TEXT NOT NULL, -- denormalized for easier queries
  mood TEXT NOT NULL,
  mood_english TEXT NOT NULL,
  tense TEXT NOT NULL,
  tense_english TEXT NOT NULL,
  verb_english TEXT,
  form_1s TEXT, -- yo
  form_2s TEXT, -- tú
  form_3s TEXT, -- él/ella/usted
  form_1p TEXT, -- nosotros
  form_2p TEXT, -- vosotros
  form_3p TEXT, -- ellos/ellas/ustedes
  gerund TEXT,
  gerund_english TEXT,
  pastparticiple TEXT,
  pastparticiple_english TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create user_quiz_preferences table
CREATE TABLE IF NOT EXISTS public.user_quiz_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  selected_tense_moods TEXT[] NOT NULL DEFAULT '{}', -- Array of "tense-mood" strings
  verb_selection TEXT CHECK (verb_selection IN ('favorites', 'custom')) NOT NULL DEFAULT 'favorites',
  custom_verbs TEXT[] NOT NULL DEFAULT '{}', -- Array of verb infinitives
  question_count INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One preference record per user
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verb_conjugations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_preferences ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 10. Create RLS Policies for games
DROP POLICY IF EXISTS "Anyone can view games" ON public.games;
CREATE POLICY "Anyone can view games" ON public.games
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage games" ON public.games;
CREATE POLICY "Authenticated users can manage games" ON public.games
  FOR ALL USING (auth.role() = 'authenticated');

-- 11. Create RLS Policies for progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;
CREATE POLICY "Users can view own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.progress;
CREATE POLICY "Users can insert own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;
CREATE POLICY "Users can update own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress" ON public.progress;
CREATE POLICY "Users can delete own progress" ON public.progress
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Create RLS Policies for user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);

-- 13. Create RLS Policies for verbs
DROP POLICY IF EXISTS "Anyone can view verbs" ON public.verbs;
CREATE POLICY "Anyone can view verbs" ON public.verbs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view verb conjugations" ON public.verb_conjugations;
CREATE POLICY "Anyone can view verb conjugations" ON public.verb_conjugations
  FOR SELECT USING (true);

-- 14. Create RLS Policies for user_favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 14. Create RLS Policies for user_quiz_preferences
DROP POLICY IF EXISTS "Users can view own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can view own quiz preferences" ON public.user_quiz_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can insert own quiz preferences" ON public.user_quiz_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can update own quiz preferences" ON public.user_quiz_preferences
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quiz preferences" ON public.user_quiz_preferences;
CREATE POLICY "Users can delete own quiz preferences" ON public.user_quiz_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- 15. Function to handle new user registration
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

-- 16. Trigger to automatically create profile and stats when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Function to update user stats when progress is updated
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

-- 18. Trigger to update stats when progress changes
DROP TRIGGER IF EXISTS on_progress_updated ON public.progress;
CREATE TRIGGER on_progress_updated
  AFTER INSERT OR UPDATE OR DELETE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- 19. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 20. Triggers to automatically update updated_at
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

DROP TRIGGER IF EXISTS update_games_updated_at ON public.games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_verbs_updated_at ON public.verbs;
CREATE TRIGGER update_verbs_updated_at
  BEFORE UPDATE ON public.verbs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_verb_conjugations_updated_at ON public.verb_conjugations;
CREATE TRIGGER update_verb_conjugations_updated_at
  BEFORE UPDATE ON public.verb_conjugations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_favorites_updated_at ON public.user_favorites;
CREATE TRIGGER update_user_favorites_updated_at
  BEFORE UPDATE ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 21. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_game_type ON public.progress(game_type);
CREATE INDEX IF NOT EXISTS idx_progress_created_at ON public.progress(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON public.progress(completed);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_score ON public.user_stats(total_score);

CREATE INDEX IF NOT EXISTS idx_games_type ON public.games(type);
CREATE INDEX IF NOT EXISTS idx_games_difficulty ON public.games(difficulty);

CREATE INDEX IF NOT EXISTS idx_verbs_infinitive ON public.verbs(infinitive);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_verb_id ON public.verb_conjugations(verb_id);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_infinitive ON public.verb_conjugations(infinitive);
CREATE INDEX IF NOT EXISTS idx_verb_conjugations_mood_tense ON public.verb_conjugations(mood, tense);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_verb_infinitive ON public.user_favorites(verb_infinitive);

CREATE INDEX IF NOT EXISTS idx_user_quiz_preferences_user_id ON public.user_quiz_preferences(user_id);

-- 22. Create a view for user progress summary
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

-- 22a. Secure the user_progress_summary view
-- Note: Views don't support RLS directly, but we can make them security invoker
-- and rely on the underlying table RLS policies for security
ALTER VIEW public.user_progress_summary SET (security_invoker = true);

-- 23. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.progress TO anon, authenticated;
GRANT ALL ON public.user_stats TO anon, authenticated;
GRANT ALL ON public.games TO anon, authenticated;
GRANT ALL ON public.verbs TO anon, authenticated;
GRANT ALL ON public.verb_conjugations TO anon, authenticated;
GRANT ALL ON public.user_favorites TO anon, authenticated;
GRANT SELECT ON public.user_progress_summary TO anon, authenticated;

-- 24. Enable realtime for progress updates (optional)
-- Note: These may already be in the publication, which is fine
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.progress;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already in publication, ignore
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already in publication, ignore
            NULL;
    END;
END $$;

-- 25. Seed initial games data
INSERT INTO public.games (id, title, type, difficulty, content) VALUES
('vocab-colors', 'Colores Básicos', 'vocabulary', 'beginner', '{
  "questions": [
    {
      "question": "¿Qué color es el cielo?",
      "options": ["Rojo", "Azul", "Verde", "Amarillo"],
      "correct_answer": "Azul",
      "explanation": "El cielo es azul durante el día."
    },
    {
      "question": "¿Qué color es la hierba?",
      "options": ["Azul", "Verde", "Rojo", "Amarillo"],
      "correct_answer": "Verde",
      "explanation": "La hierba es verde."
    },
    {
      "question": "¿Qué color es el sol?",
      "options": ["Azul", "Verde", "Amarillo", "Rojo"],
      "correct_answer": "Amarillo",
      "explanation": "El sol es amarillo."
    }
  ]
}'),
('grammar-ser-estar', 'Ser vs Estar', 'grammar', 'beginner', '{
  "questions": [
    {
      "instruction": "Completa la oración con la forma correcta de ser o estar",
      "sentence": "Yo ___ estudiante de español.",
      "correct_answer": "soy",
      "explanation": "Usamos ''ser'' para profesiones y ocupaciones permanentes.",
      "hint": "Piensa si es algo permanente o temporal"
    },
    {
      "instruction": "Completa la oración con la forma correcta de ser o estar",
      "sentence": "Ella ___ en la biblioteca ahora.",
      "correct_answer": "está",
      "explanation": "Usamos ''estar'' para ubicación temporal.",
      "hint": "Piensa si es una ubicación temporal o permanente"
    }
  ]
}'),
('pronunciation-sinalefa', 'Sinalefa Básica', 'pronunciation', 'beginner', '{
  "questions": [
    {
      "type": "sinalefa",
      "instruction": "Escucha la frase y elige la división correcta",
      "phrase": "la casa",
      "options": ["la ca-sa", "la-ca-sa", "laca-sa"],
      "correct_answer": "la-ca-sa",
      "explanation": "En ''la casa'', la vocal final de ''la'' se conecta con la vocal inicial de ''casa'' formando una sinalefa."
    },
    {
      "type": "sinalefa",
      "instruction": "Escucha la frase y elige la división correcta",
      "phrase": "el agua",
      "options": ["el a-gua", "e-la-gua", "el-agua"],
      "correct_answer": "e-la-gua",
      "explanation": "En ''el agua'', la vocal final de ''el'' se conecta con la vocal inicial de ''agua'' formando una sinalefa."
    }
  ]
}'),
('shopping-game-001', 'Tienda Checkout - Price Listening', 'shopping', 'intermediate', '{
  "questions": []
}')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- BILLING SCHEMA FOR STRIPE INTEGRATION
-- =============================================

-- Create billing schema
CREATE SCHEMA IF NOT EXISTS billing;

-- One Stripe customer per Supabase user
CREATE TABLE IF NOT EXISTS billing.customers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription snapshots (Stripe is source of truth, we mirror)
CREATE TABLE IF NOT EXISTS billing.subscriptions (
  id TEXT PRIMARY KEY,                              -- Stripe sub id
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price_id TEXT,
  status TEXT NOT NULL CHECK (status IN
    ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid')),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  raw JSONB,                                        -- optional: full Stripe object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotency for webhooks
CREATE TABLE IF NOT EXISTS billing.events (
  id TEXT PRIMARY KEY,                              -- Stripe event id
  type TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS billing_subscriptions_user_idx ON billing.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS billing_subscriptions_status_idx ON billing.subscriptions(status);

-- Helper view: active access
CREATE OR REPLACE VIEW billing.active_access AS
SELECT
  u.id AS user_id,
  EXISTS (
    SELECT 1 FROM billing.subscriptions s
    WHERE s.user_id = u.id
      AND s.status IN ('trialing','active')
      AND (s.current_period_end IS NULL OR s.current_period_end > NOW())
  ) AS has_access
FROM auth.users u;

-- Optional: expose a cheap RPC for gating
CREATE OR REPLACE FUNCTION billing.has_access(uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, extensions, pg_temp, billing
AS $$
  SELECT COALESCE(a.has_access, FALSE)
  FROM billing.active_access a
  WHERE a.user_id = uid;
$$;

-- Row Level Security
ALTER TABLE billing.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.events ENABLE ROW LEVEL SECURITY;

-- Deny all by default (no permissive policies)
-- Only service role can write, users can read their own data

-- Optional read-only for the user's own data:
CREATE POLICY "read own customer" ON billing.customers
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "read own subs" ON billing.subscriptions
FOR SELECT USING (auth.uid() = user_id);

-- No insert/update/delete policies => only service role can write
