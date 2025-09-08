# Changelog

All notable changes to the Spanish Language Learning App will be documented in this file.

## [Unreleased]

### Added
- **Navigation Component Refactoring**: Extracted and improved top navigation system
  - `components/TopNavigation.tsx` - New TypeScript component for top navigation bar
  - `components/Layout.js` - Simplified layout component using TopNavigation
  - Extracted `UserAccountButton` component within TopNavigation for avatar and user menu
  - Enhanced page header matching logic to handle nested routes (e.g., `/quiz/game` shows "Quiz")
  - Fixed avatar dropdown toggle behavior with proper event propagation control
- **Custom Quiz System**: Complete quiz configuration and persistence system
  - `types/quiz.ts` - Updated `QuizConfig` interface with `selectedTenseMoods: string[]` and `selectedPronouns: string[]`
  - `app/quiz/page.tsx` - Custom quiz setup page with modal-based tense/verb/pronoun selection
  - `app/api/quiz/route.ts` - Quiz generation API with tense-mood filtering and pronoun selection
  - `app/api/quiz-preferences/route.ts` - User quiz preferences persistence API
  - `database/add_quiz_preferences_table.sql` - Database migration for quiz preferences table
  - `user_quiz_preferences` table with RLS policies for user data isolation
  - Bottom-sliding modals for tense, verb, and pronoun selection with radio selectors
  - "Select All" functionality for tense selection
  - Persistent quiz settings (selected tenses, custom verbs, pronouns, question count)
  - Simplified pronoun labels: `tú` as 'you', `usted` as 'you (formal)', `ustedes` as 'you all'
  - Disabled `vosotros` entirely from application (frontend UI and backend quiz generation)
  - Enhanced answer comparison logic to accept answers with or without pronouns
- **User Favorites System**: Database-backed verb favoriting with persistent storage
  - `entities/Favorites.ts` - TypeScript entity for favorites CRUD operations
  - `user_favorites` table in database with RLS policies
  - Heart icon buttons in `app/cverbs/page.js` and `components/verbs/CondensedConjugationDisplay.tsx`
  - Favorites filter functionality in CVerbs page sidebar
  - Graceful error handling for missing database tables
- **Enhanced Progress Tracking**: Extended database schema with compatibility fields
  - Added `max_score`, `completion_time`, `mistakes` fields to `progress` table
  - Updated `entities/Progress.ts` with new field mappings
  - Enhanced `ProgressData` interface with compatibility properties
  - Improved error handling and authentication checks
- **CVerbs Page**: Condensed verb conjugation view with responsive grid layout
  - `app/cverbs/page.js` - New condensed verbs page route
  - `components/verbs/CondensedConjugationDisplay.tsx` - Grid-based conjugation display component
  - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop, 4 col large screens)
  - Language-aware tense names and mood tabs (English/Spanish toggle)
  - Sticky bottom navigation with mood selection (Indicative, Subjunctive, Imperative, Other)
  - Orange-pink gradient theme integration matching app design
  - TTS integration for all verb forms and tense names
- **Global Navigation Redesign**: Enhanced navigation system with responsive layout
  - `components/Layout.js` - Updated with top navigation bar for desktop screens
  - Desktop: Top navigation bar with logo, menu items, language toggle, and user menu
  - Mobile: Bottom navigation bar with floating menu items
  - Page headers pushed down on desktop to accommodate top navigation
  - Full-width content area when navigation moves to top
- **TailwindCSS Configuration**: Added default breakpoints for consistent responsive design
  - `tailwind.config.ts` - Added official TailwindCSS breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
  - Ensures consistent responsive behavior across all components
- **Verb Conjugation System**: Complete Spanish verb database integration
  - `verbs` table with 637 unique Spanish verbs and English translations
  - `verb_conjugations` table with 11,466 conjugation records across all tenses and moods
  - Public read access for verb data with proper RLS policies
  - Migration script (`scripts/import-verbs.js`) for CSV to Supabase import
  - Comprehensive verb database covering Indicativo, Subjuntivo, and Imperativo moods
  - All verb forms: yo, tú, él/ella/usted, nosotros, vosotros, ellos/ellas/ustedes
  - Gerunds and past participles for each verb
  - External app integration from `app/external-app-to-integrate/external-app/`
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
- **Verb Conjugation Components**: Improved verb display and interaction
  - `components/verbs/VerbSidebar.tsx` - Enhanced with search functionality and TTS integration
  - `components/verbs/ConjugationDisplay.tsx` - Updated with app theme integration and improved layout
  - `components/verbs/TenseTimeline.tsx` - Enhanced with TTS integration for tense names
  - All verb components now use consistent orange-pink gradient theme
- **Responsive Design**: Improved mobile and desktop layouts
  - CVerbs page with responsive search bar (full-width on mobile, sidebar on desktop)
  - Grid layouts that adapt to screen size (1-4 columns based on breakpoints)
  - Improved spacing and typography for better readability
- **Language System**: Enhanced with verb-specific translations
  - Added tense name translations in `lib/translations/en.json` and `lib/translations/es.json`
  - Language-aware mood tabs (Indicative/Indicativo, Subjunctive/Subjuntivo, etc.)
  - Dynamic tense name switching based on language toggle
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
- **Quiz Progression**: Fixed automatic progression to next question after correct answers
  - `components/games/CustomQuizGame.tsx` - Updated `setTimeout` logic to use functional state updates
  - Resolved React closure issue where quiz wouldn't advance after correct answers
- **Navigation Component Issues**: Fixed multiple navigation-related bugs
  - `components/TopNavigation.tsx` - Fixed avatar dropdown toggle with `onMouseDown` event propagation control
  - `components/Layout.js` - Fixed page header matching for nested routes (quiz game now shows "Quiz" not "Games")
  - Resolved race condition between button clicks and ClickAway component
- **Quiz Answer Comparison**: Fixed answer validation to accept both pronoun-included and pronoun-excluded answers
  - `components/games/CustomQuizGame.tsx` - Updated `isCorrect` logic to check exact match and pronoun+conjugation match
  - Resolved issue where "yo había cogido" was marked wrong when correct answer was "había cogido"
- **Quiz Tense Selection**: Fixed tense selection cross-contamination between moods
  - `app/quiz/page.tsx` - Changed from separate `selectedTenses`/`selectedMoods` arrays to single `selectedTenseMoods` array
  - Resolved issue where selecting one tense would incorrectly highlight others
- **Quiz Tense Database Mapping**: Fixed tense value mismatches between frontend and database
  - `app/quiz/page.tsx` - Updated `tenseOptions` with correct database `value` fields matching `verb_conjugations` table
  - Resolved "No questions could be generated" errors for certain tenses
- **Quiz Preferences Database Schema**: Fixed missing `selected_pronouns` column in database
  - `database/setup.sql` - Added `selected_pronouns TEXT[] NOT NULL DEFAULT '{}'` to `user_quiz_preferences` table
  - Resolved 500 Internal Server Error when saving quiz preferences
- **Quiz Duplicate Tense Entries**: Fixed duplicate entries in `selectedTenseMoods` array
  - `app/quiz/page.tsx` - Added deduplication logic in `loadQuizPreferences` and `useEffect` cleanup
  - Resolved incorrect tense count display (showing 2 when only 1 selected)
- **Quiz Pronoun Filtering**: Fixed pronoun filtering in quiz generation
  - `app/api/quiz/route.ts` - Added filtering of `pronounForms` based on `config.selectedPronouns`
  - Resolved issue where unselected pronouns appeared in quiz questions
- **Quiz English Phrase Generation**: Fixed missing pronouns in English phrases
  - `app/api/quiz/route.ts` - Re-added `generateEnglishPhrase` function to prepend pronouns to form translations
  - Resolved issue where English phrases showed "had caught" instead of "I had caught"
- **Quiz Loading Spinner**: Fixed invisible loading spinner in Start Quiz button
  - `app/quiz/page.tsx` - Added proper CSS classes (`border-2 border-white border-t-transparent rounded-full`) to spinner div
- **CVerbs Page Hydration Error**: Resolved nested button HTML structure issue
  - Changed outer `<button>` to `<div>` with `cursor-pointer` class in `app/cverbs/page.js`
  - Fixed React hydration error caused by invalid nested button elements
  - Maintained same visual appearance and functionality
- **Favorites Database Queries**: Fixed Supabase query errors in favorites system
  - Changed `.single()` to `.maybeSingle()` in `entities/Favorites.ts`
  - Resolved 406 "Not Acceptable" errors when checking existing favorites
  - Added proper error handling for empty result sets
- **Database Setup Script**: Enhanced idempotency and error handling
  - Added `DROP POLICY IF EXISTS` statements for all RLS policies in `database/setup.sql`
  - Fixed realtime publication errors with DO blocks and exception handling
  - Added missing indexes and triggers for `user_favorites` table
- **CVerbs Page Layout**: Resolved multiple layout and styling issues
  - Fixed responsive grid layout to properly display 4 columns on desktop
  - Corrected pronoun label and conjugation spacing with `justify-between`
  - Removed overlapping search bar that conflicted with global navigation
  - Fixed empty state container width constraints that prevented proper grid display
  - Resolved JSX structure errors and missing closing tags
- **Navigation System**: Fixed responsive navigation behavior
  - Resolved navigation overlap issues between global menu and page-specific elements
  - Fixed mobile/desktop navigation switching and layout consistency
  - Corrected page header positioning when navigation moves to top bar
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
  - Verb data with public read access for learning content
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
- Spanish verb conjugation system with comprehensive database
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