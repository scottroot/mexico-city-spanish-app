# Changelog

All notable changes to the Spanish Language Learning App will be documented in this file.

## [Unreleased]

### Added
- **Database-Driven Architecture**: Complete migration from mock data to Supabase database
  - `games` table created in Supabase with proper RLS policies
  - TypeScript entities: `Game.ts` and `Progress.ts` with full type safety
  - Database seeding with initial game content
  - Full CRUD operations for games and progress tracking
- **TTS Client-Side Integration**: Server-side TTS API with client-side utilities
  - `app/api/tts/route.js` - Server-side Deepgram TTS endpoint
  - `lib/tts-client.js` - Client-side TTS utility with fallback support
  - Secure API key handling and Node.js module compatibility
- **Verbs Page**: New learning page for Spanish verb conjugations
  - `app/verbs/Verbs.js` - Interactive verb learning component
  - `app/verbs/page.js` - Route for verbs page
  - Navigation integration with floating left menu
  - TTS integration for pronunciation practice
- **Language System**: Complete internationalization system with English/Spanish (Latinoamericano) toggle
  - `LanguageContext` (`contexts/LanguageContext.js`) for state management
  - `LanguageToggle` component (`components/ui/LanguageToggle.js`) with flag icons
  - Translation files (`lib/translations/es.json`, `lib/translations/en.json`)
  - All UI components updated to use `t()` translation function
  - Language preference persistence in localStorage

### Enhanced
- **Progress Tracking**: Complete database integration with compatibility layer
  - Progress entity now connects to Supabase `progress` table
  - Compatibility properties (`completion_time`, `max_score`) for existing code
  - Comprehensive error handling and authentication checks
  - Real-time progress saving from game components
- **Game System**: Full database integration replacing mock data
  - Games now loaded from Supabase `games` table
  - TypeScript interfaces for type safety
  - JSONB content storage for flexible game data
  - Public read access with authenticated write access
- **Authentication System**: Improved profile creation reliability
  - `ensureUserProfile()` function for automatic profile creation
  - Security validation for profile creation (email confirmation, user validation)
  - Automatic profile creation on email confirmation via `onAuthStateChange`
  - Enhanced error handling and logging for profile operations

### Fixed
- **Progress Page Loading**: Resolved infinite loading spinner on progress page
  - Fixed Progress entity compatibility with database schema
  - Added proper error handling for missing tables
  - Resolved authentication timeout issues
- **TTS Integration**: Fixed Deepgram API integration issues
  - Resolved client-side Node.js module conflicts
  - Fixed API key exposure and environment variable access
  - Implemented proper server-side TTS processing
- **Build Errors**: Resolved module import and compilation issues
  - Fixed missing entity file imports after TypeScript migration
  - Cleared Next.js build cache for proper module resolution
  - Updated all imports to use new TypeScript entities
- **React Key Error**: Fixed duplicate key error in navigation items by using stable `id` fields
- **Translation Loading**: Fixed nested key parsing in translation function
- **Profile Creation**: Resolved issue where profiles weren't created after email confirmation

### Security
- **Database Security**: Enhanced Row Level Security (RLS) implementation
  - `games` table with public read, authenticated write policies
  - Progress data isolation with user-specific RLS policies
  - Secure API key handling in server-side TTS endpoint
- **Profile Creation Security**: Added multiple security checks for automatic profile creation
  - User ID validation
  - Email confirmation verification
  - Anonymous user protection
  - Idempotent operations to prevent duplicates

## [Previous Versions]

### Core Features
- User authentication with Supabase
- Interactive learning games (Grammar, Vocabulary, Pronunciation)
- Progress tracking and user statistics
- Text-to-Speech integration with Deepgram
- Responsive design with Tailwind CSS
- Row Level Security (RLS) for data isolation

### Architecture
- Next.js 15 with App Router
- TypeScript entities with full type safety
- Supabase SSR integration with `@supabase/ssr`
- React Context for state management
- Component-based architecture
- Entity-driven design with database integration
- Utility-first approach
- Server-side API routes for secure operations

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*