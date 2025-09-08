# Database Schema Documentation

## Overview

This document provides comprehensive documentation for the Supabase database schema used in the Spanish Language Learning App, including tables, relationships, security policies, and data types.

## Table of Contents

1. [Database Overview](#database-overview)
2. [Table Definitions](#table-definitions)
3. [Row Level Security (RLS)](#row-level-security-rls)
4. [Triggers and Functions](#triggers-and-functions)
5. [Indexes and Performance](#indexes-and-performance)
6. [Data Seeding](#data-seeding)
7. [Migration History](#migration-history)

---

## Database Overview

### Technology Stack
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with JWT tokens
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Supabase real-time subscriptions

### Schema Design Principles
1. **User Isolation**: All user data isolated via RLS policies
2. **Automatic Management**: Triggers handle profile creation and stats updates
3. **Performance**: Indexes on frequently queried columns
4. **Flexibility**: JSONB fields for extensible content storage

---

## Table Definitions

### `public.profiles`
Extends Supabase's `auth.users` table with additional user information.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key, references `auth.users.id`
- `email`: User's email address (unique)
- `name`: Display name for the user
- `level`: Learning level (beginner/intermediate/advanced)
- `preferences`: JSONB object for user preferences
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.games`
Stores game content and metadata for the learning games.

```sql
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('grammar', 'vocabulary', 'pronunciation')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique game identifier (text)
- `title`: Game display title
- `type`: Game category (grammar/vocabulary/pronunciation)
- `difficulty`: Game difficulty level
- `content`: JSONB object containing game questions and data
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Content Structure:**
```json
{
  "questions": [
    {
      "question": "¿Qué color es el cielo?",
      "options": ["Rojo", "Azul", "Verde", "Amarillo"],
      "correct_answer": "Azul",
      "explanation": "El cielo es azul durante el día."
    }
  ]
}
```

### `public.progress`
Tracks user progress and achievements for completed games.

```sql
CREATE TABLE public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT CHECK (game_type IN ('grammar', 'vocabulary', 'pronunciation')) NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 10,
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER DEFAULT 0,
  completion_time INTEGER DEFAULT 0,
  mistakes INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: References `profiles.id`
- `game_type`: Type of game completed
- `game_id`: References `games.id`
- `score`: Points earned in the game
- `max_score`: Maximum possible score for the game
- `completed`: Whether the game was completed
- `time_spent`: Time taken in seconds
- `completion_time`: Alias for time_spent (compatibility)
- `mistakes`: Number of mistakes made
- `achievements`: JSONB array of achievements earned
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.user_stats`
Aggregated statistics for user performance and streaks.

```sql
CREATE TABLE public.user_stats (
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
```

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: References `profiles.id` (unique)
- `total_games_completed`: Count of completed games
- `total_score`: Sum of all scores earned
- `current_streak`: Current daily streak
- `longest_streak`: Best streak achieved
- `last_played`: Timestamp of last game played
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.verbs`
Stores Spanish verb infinitives with English translations.

```sql
CREATE TABLE public.verbs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  infinitive TEXT UNIQUE NOT NULL,
  infinitive_english TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key (UUID)
- `infinitive`: Spanish verb infinitive (unique)
- `infinitive_english`: English translation
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.verb_conjugations`
Stores all conjugation forms for Spanish verbs across all tenses and moods.

```sql
CREATE TABLE public.verb_conjugations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verb_id UUID REFERENCES public.verbs(id) ON DELETE CASCADE NOT NULL,
  infinitive TEXT NOT NULL,
  mood TEXT NOT NULL,
  mood_english TEXT NOT NULL,
  tense TEXT NOT NULL,
  tense_english TEXT NOT NULL,
  verb_english TEXT,
  form_1s TEXT,
  form_2s TEXT,
  form_3s TEXT,
  form_1p TEXT,
  form_2p TEXT,
  form_3p TEXT,
  gerund TEXT,
  gerund_english TEXT,
  pastparticiple TEXT,
  pastparticiple_english TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key (UUID)
- `verb_id`: References `verbs.id`
- `infinitive`: Denormalized verb infinitive for easier queries
- `mood`: Spanish mood (Indicativo, Subjuntivo, Imperativo)
- `mood_english`: English mood translation
- `tense`: Spanish tense (Presente, Pretérito, etc.)
- `tense_english`: English tense translation
- `verb_english`: English verb translation
- `form_1s`: First person singular (yo)
- `form_2s`: Second person singular (tú)
- `form_3s`: Third person singular (él/ella/usted)
- `form_1p`: First person plural (nosotros)
- `form_2p`: Second person plural (vosotros)
- `form_3p`: Third person plural (ellos/ellas/ustedes)
- `gerund`: Spanish gerund form
- `gerund_english`: English gerund translation
- `pastparticiple`: Spanish past participle
- `pastparticiple_english`: English past participle translation
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.user_favorites`
Stores user's favorite verbs for quick access.

```sql
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  verb_infinitive TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, verb_infinitive)
);
```

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: References `profiles.id`
- `verb_infinitive`: Spanish verb infinitive (unique per user)
- `created_at`: Record creation timestamp

### `public.user_quiz_preferences`
Stores user's custom quiz configuration preferences.

```sql
CREATE TABLE public.user_quiz_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  selected_tense_moods TEXT[] NOT NULL DEFAULT '{}',
  selected_pronouns TEXT[] NOT NULL DEFAULT '{}',
  verb_selection TEXT CHECK (verb_selection IN ('all', 'favorites', 'custom')) NOT NULL DEFAULT 'all',
  custom_verbs TEXT[] NOT NULL DEFAULT '{}',
  question_count INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: References `profiles.id` (unique per user)
- `selected_tense_moods`: Array of tense-mood combinations (e.g., "Presente-Indicativo")
- `selected_pronouns`: Array of selected pronouns (e.g., ["yo", "tú", "él"])
- `verb_selection`: Verb selection mode (all/favorites/custom)
- `custom_verbs`: Array of custom verb infinitives when verb_selection is 'custom'
- `question_count`: Number of questions per quiz
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### `public.stories`
Stores Spanish learning stories with metadata, text, audio, and alignment data.

```sql
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  level TEXT NOT NULL,
  reading_time TEXT,
  text TEXT NOT NULL,
  enhanced_text TEXT,
  featured_image_url TEXT,
  audio_url TEXT,
  alignment_data JSONB,
  normalized_alignment_data JSONB,
  summary TEXT,
  summary_english TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: Primary key (UUID)
- `title`: Story title
- `slug`: URL-friendly identifier (unique)
- `level`: Story difficulty level (beginner, high_beginner, low_intermediate, high_intermediate, advanced)
- `reading_time`: Estimated reading time (e.g., "5 minutes")
- `text`: Original story text
- `enhanced_text`: Enhanced version with annotations
- `featured_image_url`: URL to story cover image
- `audio_url`: URL to story audio file
- `alignment_data`: JSONB object with text-audio alignment data
- `normalized_alignment_data`: Processed alignment data for playback
- `summary`: Brief summary in Spanish
- `summary_english`: Brief summary in English
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

---

## Row Level Security (RLS)

### Overview
All tables have RLS enabled to ensure user data isolation and security.

### Policies

#### `public.profiles`
```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### `public.games`
```sql
-- Anyone can view games (public content)
CREATE POLICY "Anyone can view games" ON public.games
  FOR SELECT USING (true);

-- Authenticated users can manage games (admin use)
CREATE POLICY "Authenticated users can manage games" ON public.games
  FOR ALL USING (auth.role() = 'authenticated');
```

#### `public.progress`
```sql
-- Users can view own progress
CREATE POLICY "Users can view own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own progress
CREATE POLICY "Users can insert own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own progress
CREATE POLICY "Users can update own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own progress
CREATE POLICY "Users can delete own progress" ON public.progress
  FOR DELETE USING (auth.uid() = user_id);
```

#### `public.user_stats`
```sql
-- Users can view own stats
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update own stats
CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);
```

#### `public.verbs`
```sql
-- Anyone can view verbs (public content)
CREATE POLICY "Anyone can view verbs" ON public.verbs
  FOR SELECT USING (true);
```

#### `public.verb_conjugations`
```sql
-- Anyone can view verb conjugations (public content)
CREATE POLICY "Anyone can view verb conjugations" ON public.verb_conjugations
  FOR SELECT USING (true);
```

#### `public.user_favorites`
```sql
-- Users can view own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own favorites
CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete own favorites
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### `public.user_quiz_preferences`
```sql
-- Users can view own quiz preferences
CREATE POLICY "Users can view own quiz preferences" ON public.user_quiz_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own quiz preferences
CREATE POLICY "Users can insert own quiz preferences" ON public.user_quiz_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own quiz preferences
CREATE POLICY "Users can update own quiz preferences" ON public.user_quiz_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own quiz preferences
CREATE POLICY "Users can delete own quiz preferences" ON public.user_quiz_preferences
  FOR DELETE USING (auth.uid() = user_id);
```

#### `public.stories`
```sql
-- Anyone can view stories (public content)
CREATE POLICY "Anyone can view stories" ON public.stories
  FOR SELECT USING (true);
```

---

## Triggers and Functions

### `handle_new_user()`
Automatically creates profile and user stats when a new user signs up.

```sql
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
```

### `update_user_stats()`
Automatically updates user statistics when progress changes.

```sql
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
-- Function body calculates and updates aggregated stats
-- Triggered on INSERT, UPDATE, DELETE on progress table
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### `update_updated_at_column()`
Automatically updates the `updated_at` timestamp on record changes.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Indexes and Performance

### Performance Indexes
```sql
-- Progress table indexes
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_game_type ON public.progress(game_type);
CREATE INDEX idx_progress_created_at ON public.progress(created_at);
CREATE INDEX idx_progress_completed ON public.progress(completed);

-- User stats indexes
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX idx_user_stats_total_score ON public.user_stats(total_score);

-- Games table indexes
CREATE INDEX idx_games_type ON public.games(type);
CREATE INDEX idx_games_difficulty ON public.games(difficulty);

-- Verb table indexes
CREATE INDEX idx_verbs_infinitive ON public.verbs(infinitive);
CREATE INDEX idx_verb_conjugations_verb_id ON public.verb_conjugations(verb_id);
CREATE INDEX idx_verb_conjugations_infinitive ON public.verb_conjugations(infinitive);
CREATE INDEX idx_verb_conjugations_mood_tense ON public.verb_conjugations(mood, tense);

-- User favorites indexes
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_verb_infinitive ON public.user_favorites(verb_infinitive);

-- User quiz preferences indexes
CREATE INDEX idx_user_quiz_preferences_user_id ON public.user_quiz_preferences(user_id);

-- Stories table indexes
CREATE INDEX idx_stories_level ON public.stories(level);
CREATE INDEX idx_stories_slug ON public.stories(slug);
```

### Real-time Subscriptions
```sql
-- Enable real-time for progress updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
```

---

## Data Seeding

### Initial Games Data
The database is seeded with initial game content:

```sql
INSERT INTO public.games (id, title, type, difficulty, content) VALUES
('vocab-colors', 'Colores Básicos', 'vocabulary', 'beginner', '{
  "questions": [
    {
      "question": "¿Qué color es el cielo?",
      "options": ["Rojo", "Azul", "Verde", "Amarillo"],
      "correct_answer": "Azul",
      "explanation": "El cielo es azul durante el día."
    }
  ]
}'),
-- Additional games...
```

### Seeding Process
1. Run `database/setup.sql` in Supabase SQL Editor
2. Verify tables, policies, and triggers created
3. Seed initial games data
4. Test RLS policies with authenticated user

---

## Migration History

### Version 1.0 - Initial Schema
- Created `profiles`, `progress`, `user_stats` tables
- Implemented RLS policies
- Added triggers for automatic profile creation

### Version 1.1 - Games Integration
- Added `games` table with JSONB content storage
- Implemented public read access for games
- Added game seeding with initial content
- Created TypeScript entities for type safety

### Version 1.2 - Progress Enhancement
- Enhanced progress tracking with compatibility properties
- Added comprehensive error handling
- Implemented database-driven architecture
- Migrated from mock data to database storage

### Version 1.3 - Verb Conjugation System
- Added `verbs` table with 637 unique Spanish verbs
- Added `verb_conjugations` table with 11,466 conjugation records
- Implemented public read access for verb data
- Created migration script (`scripts/import-verbs.js`) for CSV to Supabase import
- Added comprehensive verb database with all tenses and moods

### Version 1.4 - User Favorites System
- Added `user_favorites` table for persistent verb favoriting
- Enhanced `progress` table with `max_score`, `completion_time`, and `mistakes` fields
- Implemented database-backed favorites with RLS policies
- Added compatibility fields for existing code
- Created `Favorites` entity for type-safe database operations

### Version 1.5 - Custom Quiz System
- Added `user_quiz_preferences` table for persistent quiz configuration
- Implemented quiz preferences API with GET/POST endpoints
- Added tense-mood filtering and pronoun selection in quiz generation
- Created database migration script for quiz preferences table
- Enhanced quiz answer comparison to accept answers with or without pronouns
- Disabled `vosotros` pronoun entirely from application
- Added comprehensive quiz configuration UI with bottom-sliding modals

### Version 1.6 - Stories System
- Added `stories` table for Spanish learning stories with metadata, text, audio, and alignment data
- Created Stories page (`app/stories/`) with responsive gallery grid layout
- Implemented Stories API endpoints (`/api/stories`, `/api/stories/[slug]`) for story data retrieval
- Added bilingual summary support (`summary`, `summary_english`) with automatic language switching
- Created import script (`scripts/import-stories.js`) for populating stories from local files
- Enhanced navigation system to include Stories page in both desktop and mobile layouts
- Added database migration scripts (`add_stories_table.sql`, `add_stories_summary_columns.sql`)
- Implemented language-aware story summaries with fallback logic
- Added responsive grid layout (1-4 columns based on screen size) with story cards

---

*This schema documentation is maintained alongside the database and should be updated when significant changes are made to the database structure.*
