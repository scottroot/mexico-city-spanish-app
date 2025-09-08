# API Reference

## Overview

This document provides a comprehensive API reference for the Spanish Language Learning App, including TTS functions, authentication APIs, and database operations.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Database APIs](#database-apis)
3. [TTS Core Functions](#tts-core-functions)
4. [TTS Streaming Functions](#tts-streaming-functions)
5. [TTS Optimization Functions](#tts-optimization-functions)
6. [Performance Monitoring](#performance-monitoring)
7. [Audio Format Presets](#audio-format-presets)
8. [Data Types](#data-types)
9. [Error Handling](#error-handling)
10. [Usage Examples](#usage-examples)

---

## Authentication APIs

### AuthContext Methods

#### `signUp(email, password, name)`
- File: `contexts/AuthContext.js`
- Calls: `supabase.auth.signUp()`
- Returns: `{ data: User | null, error: Error | null }`
- Auto-creates profile via `ensureUserProfile()` for confirmed users

#### `signIn(email, password)`
- File: `contexts/AuthContext.js`
- Calls: `supabase.auth.signInWithPassword()`
- Returns: `{ data: User | null, error: Error | null }`
- Updates: `user`, `profile` state

#### `signOut()`
- File: `contexts/AuthContext.js`
- Calls: `supabase.auth.signOut()`
- Returns: `{ error: Error | null }`
- Clears: `user`, `profile` state

#### `updateProfile(updates)`
- File: `contexts/AuthContext.js`
- Calls: `supabase.from('profiles').update()`
- Returns: `{ data: Profile | null, error: Error | null }`
- Updates: `profile` state

#### `resetPassword(email)`
- File: `contexts/AuthContext.js`
- Calls: `supabase.auth.resetPasswordForEmail()`
- Returns: `{ data: any | null, error: Error | null }`
- Redirects to: `/auth/reset-password`

#### `ensureUserProfile(authUser)`
- File: `contexts/AuthContext.js`
- Calls: `supabase.from('profiles').insert()` and `supabase.from('user_stats').insert()`
- Returns: `void`
- Auto-creates profile and user stats for confirmed users with security validation

---

## Database APIs

### Verb API Endpoints

#### `GET /api/verbs`
- File: `app/api/verbs/route.ts`
- Returns: `Promise<{ verbs: Verb[] }>`
- Database: `public.verbs` table
- RLS: Public read access
- Returns: Array of all verbs with `id`, `infinitive`, `infinitive_english`

#### `GET /api/verbs/[infinitive]`
- File: `app/api/verbs/[infinitive]/route.ts`
- Parameters: `infinitive` (verb infinitive from URL)
- Returns: `Promise<{ verb: Verb, conjugations: VerbConjugation[] }>`
- Database: `public.verbs` and `public.verb_conjugations` tables
- RLS: Public read access
- Returns: Verb details with all conjugation forms across tenses and moods

### Quiz API Endpoints

#### `POST /api/quiz`
- File: `app/api/quiz/route.ts`
- Input: `QuizConfig` object with `selectedTenseMoods`, `selectedPronouns`, `verbSelection`, `customVerbs`, `questionCount`
- Returns: `Promise<{ questions: QuizQuestion[] }>`
- Database: `public.verb_conjugations` table with tense-mood filtering
- Features: Pronoun filtering, English phrase generation with pronouns, `vosotros` disabled
- Returns: Array of quiz questions with conjugations, pronouns, and explanations

#### `GET /api/quiz-preferences`
- File: `app/api/quiz-preferences/route.ts`
- Returns: `Promise<QuizConfig>`
- Database: `public.user_quiz_preferences` table
- RLS: `auth.uid() = user_id`
- Returns: User's saved quiz configuration or default values

#### `POST /api/quiz-preferences`
- File: `app/api/quiz-preferences/route.ts`
- Input: `QuizConfig` object
- Returns: `Promise<{ success: boolean, error?: string }>`
- Database: `public.user_quiz_preferences` table with upsert operation
- RLS: `auth.uid() = user_id`
- Features: Validates input, maps frontend config to database fields, enhanced error logging

### Game Entity Methods (TypeScript)

#### `Game.list()`
- File: `entities/Game.ts`
- Calls: `supabase.from('games').select().order()`
- Returns: `Promise<Game[]>`
- Database: `public.games` table

#### `Game.get(id)`
- File: `entities/Game.ts`
- Calls: `supabase.from('games').select().eq('id').single()`
- Returns: `Promise<Game | null>`

#### `Game.create(gameData)`
- File: `entities/Game.ts`
- Calls: `supabase.from('games').insert()`
- Returns: `Promise<{ success: boolean; data?: Game; error?: string }>`
- Admin function for creating new games

### User Entity Methods

#### `User.me()`
- File: `entities/User.js`
- Calls: `supabase.auth.getUser()` + `supabase.from('profiles').select()`
- Returns: `Promise<User | null>`
- Includes: `profile` data

#### `User.updateProfile(updates)`
- File: `entities/User.js`
- Calls: `supabase.from('profiles').update()`
- Returns: `{ data: Profile | null, error: Error | null }`

#### `User.getUserStats()`
- File: `entities/User.js`
- Calls: `supabase.from('user_stats').select()`
- Returns: `{ data: UserStats | null, error: Error | null }`

### Progress Entity Methods (TypeScript)

#### `Progress.list()`
- File: `entities/Progress.ts`
- Calls: `supabase.from('progress').select().order()`
- Returns: `Promise<ProgressResult<Progress[]>>`
- RLS: `auth.uid() = user_id`
- Includes: Compatibility properties (`completion_time`, `max_score`)

#### `Progress.create(progressData)`
- File: `entities/Progress.ts`
- Calls: `supabase.from('progress').insert()`
- Returns: `Promise<ProgressResult<Progress>>`
- Auto-adds: `user_id` from auth context
- Handles: Missing table gracefully

#### `Progress.getByGameId(gameId)`
- File: `entities/Progress.ts`
- Calls: `supabase.from('progress').select().eq('game_id').single()`
- Returns: `Promise<ProgressResult<Progress | null>>`

#### `Progress.getUserStats()`
- File: `entities/Progress.ts`
- Calls: `supabase.from('user_progress_summary').select().single()`
- Returns: `Promise<ProgressResult<any>>`
- Uses: Database view for aggregated statistics

### Favorites Entity Methods (TypeScript)

#### `Favorites.addFavorite(verbInfinitive)`
- File: `entities/Favorites.ts`
- Calls: `supabase.from('user_favorites').insert()`
- Returns: `Promise<FavoritesResult<FavoriteData>>`
- Checks: Existing favorites with `.maybeSingle()`
- RLS: `auth.uid() = user_id`

#### `Favorites.removeFavorite(verbInfinitive)`
- File: `entities/Favorites.ts`
- Calls: `supabase.from('user_favorites').delete()`
- Returns: `Promise<FavoritesResult<null>>`
- RLS: `auth.uid() = user_id`

#### `Favorites.getUserFavorites()`
- File: `entities/Favorites.ts`
- Calls: `supabase.from('user_favorites').select('verb_infinitive')`
- Returns: `Promise<FavoritesResult<string[]>>`
- RLS: `auth.uid() = user_id`

#### `Favorites.isFavorited(verbInfinitive)`
- File: `entities/Favorites.ts`
- Calls: `supabase.from('user_favorites').select('id').maybeSingle()`
- Returns: `Promise<boolean>`
- RLS: `auth.uid() = user_id`

---

## TTS Core Functions

### Server-Side TTS API

#### `POST /api/tts`
- File: `app/api/tts/route.js`
- Input: `{ text: string }`
- Returns: `{ success: boolean, audio?: string, contentType?: string, error?: string }`
- Secure: API key handled server-side
- Compatible: Node.js modules (fs/promises)

### Client-Side TTS Utilities

#### `playTTS(text)`
- File: `lib/tts-client.js`
- Calls: `/api/tts` endpoint
- Returns: `Promise<void>`
- Features: Audio playback, blob URL management

#### `fallbackTTS(text)`
- File: `lib/tts-client.js`
- Uses: Browser `speechSynthesis` API
- Returns: `void`
- Fallback: When server TTS fails

### Deepgram Core Functions

#### `textToSpeech(options)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, audioBuffer?: ArrayBuffer, error?: string, contentType?: string }>`
- Waits for complete audio file

#### `textToSpeechBlob(options)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, blobUrl?: string, error?: string }>`
- Creates blob URL for immediate playback

#### `textToSpeechFile(options, filePath)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, error?: string }>`
- Node.js only - saves to file system

---

## Streaming Functions

### `streamTextToSpeech(options, onChunk, performanceMonitor?)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, error?: string, totalBytes?: number, metrics?: StreamingMetrics }>`
- Real-time streaming with chunk callbacks

### `streamTextToSpeechForBrowser(options)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, mediaSourceUrl?: string, error?: string }>`
- Uses MediaSource API for immediate playback

### `streamChunkedTextToSpeech(options, onChunk, onSegmentComplete?)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, error?: string, totalBytes?: number, segmentsProcessed?: number }>`
- Auto-segments long text into sentences

---

## Optimization Functions

### `streamOptimizedTTS(text, onChunk, model?)`
- File: `lib/deepgram.ts`
- Returns: `Promise<{ success: boolean, error?: string, totalBytes?: number, metrics?: StreamingMetrics, preset?: AudioFormatPreset }>`
- Auto-optimizes based on network conditions

### `createOptimizedTTSOptions(text, preset, model?)`
- File: `lib/deepgram.ts`
- Returns: `DeepgramTTSOptions`
- Uses specific audio format preset

### `createAutoOptimizedTTSOptions(text, model?)`
- File: `lib/deepgram.ts`
- Returns: `Promise<DeepgramTTSOptions>`
- Auto-detects optimal settings via `NetworkPerformanceEstimator`

---

## Performance Monitoring

### `StreamingPerformanceMonitor`
- File: `lib/deepgram.ts`
- Methods: `startMonitoring()`, `recordChunk()`, `updateNetworkMetrics()`, `finishMonitoring()`, `getMetrics()`
- Returns: `StreamingMetrics` object

### `NetworkPerformanceEstimator`
- File: `lib/deepgram.ts`
- Methods: `getInstance()`, `estimateLatency()`, `estimateBandwidth()`, `getOptimalPreset()`
- Singleton pattern for network condition detection

### `BufferPredictor`
- File: `lib/deepgram.ts`
- Methods: `adjustBufferSize()`, `getCurrentBufferSize()`, `reset()`
- Dynamic buffer sizing based on network conditions

---

## Audio Format Presets

### Available Presets
- File: `lib/deepgram.ts`
- `LOW_BANDWIDTH`: 22kHz, 1024 chunk, 200ms latency
- `MEDIUM_BANDWIDTH`: 44kHz, 2048 chunk, 150ms latency  
- `HIGH_BANDWIDTH`: 48kHz, 4096 chunk, 100ms latency
- `REAL_TIME`: 24kHz, 512 chunk, 50ms latency

---

## Data Types

### Authentication Types
- `User`: Supabase auth user object
- `Profile`: Extended user data in `public.profiles` table
- `UserStats`: Aggregated stats in `public.user_stats` table
- `Progress`: Game progress in `public.progress` table

### Entity Types (TypeScript)
- `GameData`: Game entity interface with `id`, `title`, `type`, `difficulty`, `content`
- `GameContent`: Game content structure with questions array
- `ProgressData`: Progress entity interface with database fields
- `ProgressCreateData`: Progress creation data with compatibility fields
- `ProgressResult<T>`: Generic result type with `success`, `data`, `error`
- `Verb`: Verb entity interface with `id`, `infinitive`, `infinitive_english`
- `VerbConjugation`: Verb conjugation interface with all tense forms and mood data
- `QuizConfig`: Quiz configuration interface with `selectedTenseMoods`, `selectedPronouns`, `verbSelection`, `customVerbs`, `questionCount`
- `QuizQuestion`: Quiz question interface with `id`, `infinitive`, `correctAnswer`, `pronoun`, `pronounEnglish`, `explanation`
- `PronounOption`: Pronoun option interface with `value`, `label`, `labelEnglish`

### TTS Types
- `DeepgramTTSOptions`: TTS configuration object
- `StreamingMetrics`: Performance metrics object
- `DeepgramModel`: Voice model type
- `AudioFormatPreset`: Audio quality preset type

---

## Error Handling

### Common Error Types
- **API Errors**: Invalid keys, rate limiting, network issues
- **Streaming Errors**: Chunk failures, buffer overflow, playback errors
- **Performance Errors**: Monitoring failures, network detection errors

### Error Response Format
- `{ success: false, error: string }`
- All functions return consistent error format

### Error Handling Best Practices
- Check `result.success` before processing
- Handle both function errors and thrown exceptions
- Log errors for debugging

---

## Usage Examples

### React Component Integration
- File: `components/games/PronunciationGame.js`
- Uses: `playTTS()` from `lib/tts-client.js`
- Pattern: `playAudio()` → `playTTS()` → `/api/tts` → `new Audio().play()`
- Fallback: `fallbackTTS()` for browser speech synthesis

### Verbs Page Integration
- File: `app/verbs/Verbs.js`
- Uses: `playTTS()` for verb pronunciation
- Pattern: `playAudio()` → `playTTS()` → server-side Deepgram → audio playback

### CVerbs Page Integration
- File: `app/cverbs/page.js`
- Uses: `CondensedConjugationDisplay.tsx` component
- Pattern: Verb selection → API call → Grid display → TTS integration
- Features: Responsive grid layout, language-aware tense names, mood tabs

### Performance Monitoring Integration
- Uses: `StreamingPerformanceMonitor` with `streamTextToSpeech()`
- Pattern: Monitor → Metrics → Performance logging

### Network-Adaptive Streaming
- Uses: `NetworkPerformanceEstimator.getInstance()` → `getOptimalPreset()`
- Pattern: Network detection → Preset selection → Optimized streaming

### Custom Quiz Integration
- File: `app/quiz/page.tsx` - Custom quiz setup page with modal-based selection
- Uses: `loadQuizPreferences()` and `saveQuizPreferences()` for persistence
- Pattern: Quiz config → API calls → Database storage → Quiz generation
- Features: Bottom-sliding modals, tense/verb/pronoun selection, persistent preferences

### Navigation Component Integration
- File: `components/TopNavigation.tsx` - TypeScript component for top navigation bar
- Uses: `UserAccountButton` component for avatar and user menu functionality
- Pattern: Navigation items → Route matching → Page header display
- Features: Responsive design, user authentication, language toggle, click-away dropdown handling
- File: `components/Layout.js` - Main layout wrapper using TopNavigation component
- Pattern: TopNavigation → Page header → Main content → Mobile navigation
- Features: Nested route handling, responsive layouts, proper component composition

### Quiz Game Integration
- File: `components/games/CustomQuizGame.tsx` - Quiz game component with enhanced answer comparison
- Uses: `isCorrect` logic with pronoun-included and pronoun-excluded answer validation
- Pattern: User input → Answer comparison → Result display → Audio playback
- Features: TTS integration, progress tracking, enhanced answer validation

---

*This API reference is maintained alongside the codebase and should be updated when new functions or changes are made to the authentication, database, or TTS systems.*
