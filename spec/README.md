# Spanish Language App - Technical Specification

## Overview

This document provides a comprehensive technical specification for the Spanish Language Learning App, designed to help future GPT assistants understand the project structure, architecture, and implementation details. The app features user authentication, interactive learning games, progress tracking, and real-time TTS integration.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Authentication System](#authentication-system)
4. [Core Components](#core-components)
5. [TTS Integration](#tts-integration)
6. [Data Models](#data-models)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Development Guidelines](#development-guidelines)
10. [Setup Instructions](#setup-instructions)

---

## Project Structure

```
Spanish-Language-App/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   │   └── page.js          # Login page
│   │   ├── signup/
│   │   │   └── page.js          # Signup page
│   │   └── forgot-password/
│   │       └── page.js          # Password reset page
│   ├── external-app-to-integrate/ # External verb conjugation app
│   │   └── external-app/        # Source app for verb functionality
│   │       ├── api/verbs/       # Verb API endpoints
│   │       ├── components/      # Verb conjugation components
│   │       ├── utils/           # Verb utilities and data
│   │       ├── verbs.csv        # Verb conjugation data
│   │       └── verbs.db         # SQLite verb database
│   ├── game/
│   │   ├── Game.js              # Main game component
│   │   └── page.js              # Game page route (protected)
│   ├── progress/
│   │   ├── Progress.js          # Progress tracking component
│   │   └── page.js              # Progress page route (protected)
│   ├── verbs/
│   │   ├── Verbs.js             # Verb learning component
│   │   └── page.js              # Verbs page route
│   ├── cverbs/
│   │   └── page.js              # Condensed verbs page route
│   ├── globals.css              # Global styles
│   ├── Home.tsx                 # Home page component
│   ├── layout.js                # Root layout with AuthProvider
│   └── page.tsx                 # Home page route (protected)
├── components/                   # Reusable UI components
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.js         # Login form component
│   │   ├── SignupForm.js        # Signup form component
│   │   ├── ForgotPasswordForm.js # Password reset form
│   │   └── ProtectedRoute.js    # Route protection component
│   ├── games/                   # Game-specific components
│   │   ├── GameCard.js          # Game selection card
│   │   ├── GrammarGame.js       # Grammar learning game
│   │   ├── PronunciationGame.js # Pronunciation practice
│   │   └── VocabularyGame.js    # Vocabulary building
│   ├── Layout.js                # Main layout wrapper with auth state
│   ├── verbs/                   # Verb conjugation components
│   │   ├── VerbSidebar.tsx      # Verb list sidebar component
│   │   ├── ConjugationDisplay.tsx # Verb conjugation display component
│   │   ├── TenseTimeline.tsx    # Tense timeline visualization
│   │   └── CondensedConjugationDisplay.tsx # Condensed verb conjugation grid with favorites
│   └── ui/                      # Base UI components
│       ├── badge.jsx            # Badge component
│       ├── button.jsx           # Button component
│       ├── card.jsx             # Card component
│       ├── input.jsx            # Input component
│       ├── progress.jsx         # Progress bar component
│       └── LanguageToggle.js    # Language toggle component
├── contexts/                     # React contexts
│   ├── AuthContext.js           # Authentication state management
│   └── LanguageContext.js       # Language/translation state management
├── entities/                     # Data models and schemas
│   ├── Game.ts                  # Game entity definition (TypeScript)
│   ├── Game.json                # Game data structure
│   ├── Progress.ts              # Progress tracking entity (TypeScript)
│   ├── Progress.json            # Progress data structure
│   ├── Favorites.ts             # User favorites entity (TypeScript)
│   └── User.js                  # User entity definition (Supabase)
├── lib/                         # Utility libraries and services
│   ├── supabase.js.DEPRECATED   # Deprecated Supabase client (replaced by utils/supabase/)
│   ├── deepgram.ts              # TTS service (Deepgram API)
│   ├── deepgram-example.ts      # TTS usage examples
│   ├── tts-client.js            # Client-side TTS utility
│   ├── cn.js                    # Class name utility
│   ├── index.js                 # Main library exports
│   └── translations/            # Translation files
│       ├── es.json              # Spanish (Latinoamericano) translations
│       └── en.json              # English translations
├── utils/                        # Supabase utilities
│   └── supabase/                # Supabase client configurations
│       ├── client.ts            # Browser client
│       ├── server.ts            # Server client
│       └── middleware.ts        # Middleware client
├── database/                     # Database setup and documentation
│   ├── setup.sql                # Complete database schema
│   └── README.md                # Database setup instructions
├── scripts/                     # Utility scripts
│   └── import-verbs.js          # Verb data migration script
├── app/api/                     # API routes
│   ├── tts/
│   │   └── route.ts             # Text-to-speech API endpoint
│   └── verbs/
│       ├── route.ts             # Verbs list API endpoint
│       └── [infinitive]/
│           └── route.ts         # Verb conjugation API endpoint
├── spec/                        # Technical documentation
│   ├── README.md                # This file
│   ├── TTS-ARCHITECTURE.md      # TTS system architecture
│   ├── API-REFERENCE.md         # API documentation
│   ├── AUTHENTICATION.md        # Authentication system documentation
│   ├── DATABASE-SCHEMA.md       # Database schema documentation
│   └── CHANGELOG.md             # Change history
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration with default breakpoints
├── tsconfig.json                # TypeScript configuration
└── next.config.ts               # Next.js configuration
```

---

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **TTS Service**: Deepgram API

### Design Patterns

1. **Component-Based Architecture**: Modular React components with clear separation of concerns
2. **Entity-Driven Design**: Data models defined in `/entities` folder
3. **Utility-First Approach**: Reusable utilities in `/lib` folder
4. **Page-Based Routing**: Next.js App Router for navigation
5. **Context-Based State Management**: React Context for authentication and language state
6. **Protected Route Pattern**: Route-level authentication guards
7. **Internationalization**: Dynamic language switching with translation system

### Key Features

- **User Authentication**: Complete signup/login system with Supabase and automatic profile creation
- **Interactive Games**: Grammar, vocabulary, and pronunciation practice
- **Verb Conjugation System**: Comprehensive Spanish verb database with 637 verbs and 11,466 conjugations
- **CVerbs Page**: Condensed verb conjugation view with responsive grid layout and language-aware tense names
- **Progress Tracking**: User learning progress and achievements with persistence
- **Text-to-Speech**: Real-time audio generation for pronunciation
- **Multi-language UI**: Toggle between English and Spanish (Latinoamericano) interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS and configurable breakpoints
- **Performance Optimization**: Streaming TTS with network adaptation
- **Data Security**: Row Level Security (RLS) for user data isolation

---

## Authentication System

### Overview

The app uses Supabase for authentication, providing a complete user management system with email/password authentication, password reset, and secure session management.

### Architecture

Authentication flow: `User Action` → `AuthContext` → `Supabase Auth API` → `Profile Creation` → `State Updates` → `UI Components`

### Components

#### AuthContext (`contexts/AuthContext.js`)
- State: `user`, `profile`, `loading`
- Methods: `signUp()`, `signIn()`, `signOut()`, `updateProfile()`, `resetPassword()`, `ensureUserProfile()`
- Auto session restoration via `supabase.auth.onAuthStateChange()`
- Automatic profile creation for confirmed users via `ensureUserProfile()`

#### Authentication Forms
- `components/auth/LoginForm.js`: `handleSubmit()` → `signIn()`
- `components/auth/SignupForm.js`: `handleSubmit()` → `signUp()`
- `components/auth/ForgotPasswordForm.js`: `handleSubmit()` → `resetPassword()`

#### ProtectedRoute (`components/auth/ProtectedRoute.js`)
- Uses `useAuth()` hook to check `user` state
- Redirects to `/auth/login` if `!user && !loading`
- Renders children if authenticated

### Database Integration

#### User Profiles
- Auto-creation via `handle_new_user()` trigger on `auth.users` insert
- Profile data in `public.profiles` table
- Real-time updates via `supabase.from('profiles')`

#### Row Level Security (RLS)
- Policies: `auth.uid() = id` for profiles, `auth.uid() = user_id` for progress
- All tables: `profiles`, `progress`, `user_stats`
- Automatic data isolation per user

### Security Features

- Session: JWT tokens via `supabase.auth.getSession()`
- Passwords: Hashed by Supabase Auth
- Data: RLS policies enforce `auth.uid()` matching
- Keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Language System

### Overview

The app features a comprehensive internationalization system that allows users to switch between English and Spanish (Latinoamericano) interfaces. The language preference is persisted in localStorage and available throughout the application.

### Architecture

Language flow: `User Selection` → `LanguageContext` → `Translation Files` → `UI Components`

### Components

#### LanguageContext (`contexts/LanguageContext.js`)
- State: `language`, `translations`
- Methods: `changeLanguage()`, `t()` (translation function)
- Features: localStorage persistence, dynamic translation loading, fallback support

#### LanguageToggle (`components/ui/LanguageToggle.js`)
- Dropdown component with flag icons
- Accessible from all pages (header)
- Visual feedback for current language selection

#### Translation Files
- `lib/translations/es.json`: Spanish (Latinoamericano) translations
- `lib/translations/en.json`: English translations
- Organized by feature sections (app, navigation, auth, home, progress, games, common)

### Usage

```javascript
// In any component
import { useLanguage } from '@/contexts/LanguageContext'

function MyComponent() {
  const { t, language, changeLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>
        Switch to English
      </button>
    </div>
  )
}
```

### Translation Structure

```json
{
  "app": {
    "title": "¡Español Divertido!",
    "subtitle": "Aprende español latinoamericano"
  },
  "navigation": {
    "games": "Juegos",
    "progress": "Progreso"
  },
  "auth": {
    "welcomeBack": "¡Bienvenido de vuelta!",
    "loginButton": "Iniciar sesión"
  }
}
```

---

## Core Components

### Game System

The app features three main game types:

1. **GrammarGame.js**: Interactive grammar exercises
2. **PronunciationGame.js**: Speech practice with TTS feedback
3. **VocabularyGame.js**: Word learning and memorization

### Verb Conjugation System

The app includes comprehensive verb conjugation functionality:

1. **Verbs Page** (`app/verbs/`): Full verb learning interface with sidebar and detailed conjugation display
2. **CVerbs Page** (`app/cverbs/`): Condensed verb conjugation view with responsive grid layout and favorites system
3. **VerbSidebar.tsx**: Searchable verb list with pagination and TTS integration
4. **ConjugationDisplay.tsx**: Detailed verb conjugation display with tense timeline
5. **CondensedConjugationDisplay.tsx**: Grid-based conjugation view with mood tabs and heart favorites
6. **TenseTimeline.tsx**: Visual timeline of Spanish tenses

### Progress Tracking

- **Progress.js**: Tracks user achievements and learning milestones
- **Progress.json**: Defines progress data structure
- Real-time progress updates and persistence

### User Favorites System

- **Favorites.ts**: TypeScript entity for database-backed verb favoriting
- **user_favorites table**: Database table with RLS policies for user-specific favorites
- **Heart buttons**: Interactive favorites toggle in `app/cverbs/page.js` and `components/verbs/CondensedConjugationDisplay.tsx`
- **Favorites filter**: Sidebar filter to show only favorited verbs
- **Persistent storage**: Favorites survive browser refreshes and sessions
- **Graceful degradation**: Works without database table (React state fallback)

### UI Components

- **Base Components**: Button, Card, Input, Badge, Progress
- **Game Components**: Specialized components for each game type
- **Layout Components**: Consistent page structure and navigation
- **Verb Components**: Specialized components for verb conjugation display and interaction

---

## TTS Integration

### Overview

The app integrates Deepgram's Text-to-Speech API for pronunciation practice and audio feedback. The TTS system is designed for optimal performance with streaming capabilities and network adaptation.

### Key Features

- **Streaming Audio**: Real-time audio generation and playback
- **Network Adaptation**: Automatic optimization based on connection quality
- **Multiple Languages**: Support for Spanish and English voices
- **Performance Monitoring**: Detailed metrics and optimization
- **Dynamic Buffering**: Adaptive buffer sizing for optimal performance

### Architecture

```
TTS System Architecture:
├── Deepgram API Integration
├── Streaming Performance Monitor
├── Network Performance Estimator
├── Buffer Prediction Algorithm
├── Audio Format Presets
└── Performance Metrics Collection
```

---

## Data Models

### Game Entity (TypeScript)
- File: `entities/Game.ts`
- Interface: `GameData`, `GameContent`
- Fields: `id`, `title`, `type`, `difficulty`, `content`, `created_at`, `updated_at`
- Methods: `list()`, `get(id)`, `create()`, `update()`, `delete()`
- Database: `public.games` table

### Progress Entity (TypeScript)
- File: `entities/Progress.ts`
- Interface: `ProgressData`, `ProgressCreateData`, `ProgressResult`
- Table: `public.progress`
- Fields: `id`, `user_id`, `game_type`, `game_id`, `score`, `completed`, `time_spent`, `achievements`, `created_at`, `updated_at`
- Compatibility: `completion_time`, `max_score` properties for existing code
- Methods: `list()`, `create()`, `getByGameId()`, `update()`, `delete()`, `getUserStats()`

### User Entity (Supabase)
- File: `entities/User.js`
- Table: `public.profiles` (extends `auth.users`)
- Fields: `id`, `email`, `name`, `level`, `preferences`, `created_at`, `updated_at`
- Methods: `me()`, `updateProfile()`, `getUserStats()`, `updateUserStats()`

### UserStats Entity
- Table: `public.user_stats`
- Fields: `id`, `user_id`, `total_games_completed`, `total_score`, `current_streak`, `longest_streak`, `last_played`, `created_at`, `updated_at`
- Auto-updated via `update_user_stats()` trigger

### Verb Entity
- Table: `public.verbs`
- Fields: `id`, `infinitive`, `infinitive_english`, `created_at`, `updated_at`
- Contains 637 unique Spanish verbs with English translations

### VerbConjugation Entity
- Table: `public.verb_conjugations`
- Fields: `id`, `verb_id`, `infinitive`, `mood`, `mood_english`, `tense`, `tense_english`, `verb_english`, `form_1s`, `form_2s`, `form_3s`, `form_1p`, `form_2p`, `form_3p`, `gerund`, `gerund_english`, `pastparticiple`, `pastparticiple_english`, `created_at`, `updated_at`
- Contains 11,466 conjugation records across all tenses and moods

---

## Database Schema

### Overview

The app uses Supabase PostgreSQL with Row Level Security (RLS) for data isolation and automatic user management.

### Tables

#### `profiles`
- Extends `auth.users`
- Fields: `id`, `email`, `name`, `level`, `preferences`, `created_at`, `updated_at`
- RLS: `auth.uid() = id`

#### `games`
- Fields: `id`, `title`, `type`, `difficulty`, `content`, `created_at`, `updated_at`
- RLS: Public read access, authenticated write access
- Content: JSONB field containing game questions and data

#### `progress`
- Fields: `id`, `user_id`, `game_type`, `game_id`, `score`, `completed`, `time_spent`, `achievements`, `created_at`, `updated_at`
- RLS: `auth.uid() = user_id`

#### `user_stats`
- Fields: `id`, `user_id`, `total_games_completed`, `total_score`, `current_streak`, `longest_streak`, `last_played`, `created_at`, `updated_at`
- RLS: `auth.uid() = user_id`

#### `verbs`
- Fields: `id`, `infinitive`, `infinitive_english`, `created_at`, `updated_at`
- RLS: Public read access
- Contains 637 unique Spanish verbs

#### `verb_conjugations`
- Fields: `id`, `verb_id`, `infinitive`, `mood`, `mood_english`, `tense`, `tense_english`, `verb_english`, `form_1s`, `form_2s`, `form_3s`, `form_1p`, `form_2p`, `form_3p`, `gerund`, `gerund_english`, `pastparticiple`, `pastparticiple_english`, `created_at`, `updated_at`
- RLS: Public read access
- Contains 11,466 conjugation records

### Security

#### Row Level Security (RLS)
- Policies: `auth.uid() = id` (profiles), `auth.uid() = user_id` (progress, user_stats)
- All tables: `profiles`, `progress`, `user_stats`, `verbs`, `verb_conjugations`

#### Triggers and Functions
- `handle_new_user()`: Auto-creates profile + user_stats on signup
- `update_user_stats()`: Auto-updates stats when progress changes
- `update_updated_at_column()`: Auto-updates timestamps

### Performance
- Indexes: `user_id`, `game_type`, `created_at`, `completed`
- Real-time: Enabled on `progress`, `user_stats`
- View: `user_progress_summary`

---

## API Reference

### TTS Functions
- File: `lib/deepgram.ts`
- Core: `textToSpeech()`, `streamTextToSpeech()`, `streamTextToSpeechForBrowser()`, `streamChunkedTextToSpeech()`
- Optimization: `streamOptimizedTTS()`, `createOptimizedTTSOptions()`, `createAutoOptimizedTTSOptions()`
- Monitoring: `StreamingPerformanceMonitor`, `NetworkPerformanceEstimator`, `BufferPredictor`
- Presets: `LOW_BANDWIDTH`, `MEDIUM_BANDWIDTH`, `HIGH_BANDWIDTH`, `REAL_TIME`

---

## Development Guidelines

### Code Organization

1. **Components**: Keep components focused and reusable
2. **Utilities**: Place shared logic in `/lib` folder
3. **Types**: Define interfaces in component files or dedicated type files
4. **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible

### TTS Development

1. **Performance First**: Always consider network conditions and user experience
2. **Error Handling**: Implement comprehensive error handling for API calls
3. **Streaming**: Prefer streaming over batch processing for better UX
4. **Monitoring**: Use performance monitoring for optimization

### Testing

1. **Component Testing**: Test individual components in isolation
2. **Integration Testing**: Test TTS integration with different network conditions
3. **Performance Testing**: Monitor streaming performance and optimization

### Environment Setup
1. API Keys: `.env` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DEEPGRAM_API_KEY`
2. Dependencies: `npm install` + `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`
3. Database: Run `database/setup.sql` in Supabase SQL Editor
4. Development: `npm run dev`
5. Build: `npm run build`

---

## Future Considerations

### Scalability

- ✅ User authentication and data persistence implemented
- Add more game types and content
- Implement adaptive learning algorithms
- Add social features and leaderboards
- Implement user analytics and insights

### Performance

- Implement service workers for offline functionality
- Add audio caching for frequently used phrases
- Optimize bundle size and loading performance
- Implement progressive web app features

### Accessibility

- Add screen reader support
- Implement keyboard navigation
- Add high contrast mode
- ✅ Support multiple languages for UI (English/Spanish)

---

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm 8+
- Supabase account
- Deepgram API key

### 1. Install Dependencies
- `npm install`
- `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`

### 2. Environment Configuration
- Create `.env.local` with Supabase and Deepgram keys
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DEEPGRAM_API_KEY`

### 3. Database Setup
- Create Supabase project
- Run `database/setup.sql` in SQL Editor
- Verify tables, policies, triggers created
- Seed games data using provided SQL in database setup

### 4. Authentication Configuration
- Supabase dashboard → Authentication → Settings
- Set Site URL: `http://localhost:3000`
- Add redirect URLs for auth callbacks

### 5. Development
- `npm run dev`
- Test auth flow at `http://localhost:3000`

### 6. Production Deployment
- Update env vars for production
- Configure production Supabase settings
- `npm run build` → `npm start`

### Troubleshooting
- Auth issues: Check Supabase settings and env vars
- DB errors: Verify RLS policies and permissions
- TTS issues: Confirm Deepgram API key

---

*This specification is maintained alongside the codebase and should be updated when significant changes are made to the project structure or functionality.*
