# Changelog

All notable changes to Capital Spanish will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Story duplicate title prevention system (queries recent 50 titles and instructs LLM to avoid)
- Story summary generation using LangChain with Zod validation
- Level filter and sort controls for stories page (filter by difficulty, sort by newest/oldest/alphabetical)
- Conditional "New" badge on stories (only shows for stories created within last 7 days)
- Post-generation duplicate check with automatic workflow retry
- Debug logging for story title uniqueness verification
- Freemium authentication model (simple games playable without login, LLM-powered games require auth)
- TypeScript migration for TTS client library
- Quit button for custom verb quiz with confirmation dialog (exits without saving progress)
- Preset verb groups for quiz setup (Top 25/50/100, Travel, Food, Work, Daily Routine, Communication, Household, Emotions)
- "Deselect all" button in custom verb selection modal for quick clearing
- "No verbs selected" message when custom verb selection is empty
- Selected verbs shown first in custom verb modal with visual separation
- Tense labels now show both English and Spanish names in modal

### Changed
- Consolidated story generation to use only LangChain implementation (removed duplicate OpenAI code)
- Renamed `story-llm.ts` to `llm.ts` for cleaner organization
- Moved `createTempDir` from storage.ts to stories/utils.ts
- Renamed `activities/stories/storage.ts` to `activities/stories/supabase.ts` (better reflects purpose)
- Updated Temporal temp directory to `/app/tmp` (uses Docker volume, not ephemeral container storage)
- Increased LLM temperature to 0.95 for more creative story variation
- Disabled strict mode in structured outputs for more diverse story generation
- Strengthened story uniqueness prompts with explicit requirements and rejection warnings
- Image generation prompt now emphasizes full-bleed images without borders/frames/signatures
- Featured image on story viewer page now responsive (192px mobile to 384px desktop)
- Switched story viewer featured image to Next.js Image component
- Audio player positioning now accounts for sidebar and mobile navigation
- Story filter/sort controls now stack vertically on mobile for better responsiveness
- Alignment data now stored in JSONB database columns (simplified from storage bucket URLs)
- Docker worker now uses custom image with ffmpeg pre-installed (faster restarts)
- Docker worker update script now uses `--force-recreate` to ensure fresh builds
- Refactored game architecture to use colocated file structure
- Migrated all game components to TypeScript (.tsx)
- Games now use server-side rendering with proper 404 handling
- Each game exports GAME_ID constant for direct game-to-database mapping
- Moved shared game components to `/app/game/_components/`
- Redesigned quiz configuration page with compact, scannable layout
- Standardized modal styling across all selection modals (tenses, pronouns, verbs)
- Improved visual hierarchy with consistent text weights and spacing
- Converted pronoun selection to modal-based interface matching tenses
- Custom verb selection now opens modal directly (removed extra click)
- Renamed "Custom" verb option to "Select my own" for clarity
- Top 100 verbs now available as direct button option and set as default
- Question count uses +/- stepper instead of discrete buttons
- All clickable elements now have cursor-pointer for better UX
- Refactored quiz page to use Server Components with SSR data fetching (faster initial load, no loading states)
- Extracted all quiz modals (Tense, Pronoun, Verb) into reusable components in `modals.tsx`
- Migrated QuizPageClient and CustomQuizGame to use @hookstate/core for state management
- Quiz preferences now persist to localStorage for unauthenticated users (survives page refresh)

### Removed
- Duplicate story generation logic from `activities/openai.ts` (consolidated to LangChain)
- `generateStoryImage` function using DALL-E (unused, replaced with Gemini)
- Unused `safe()` function from stories/utils.ts
- Hardcoded "New" badge on all stories (now conditional based on creation date)
- Deprecated LanguageToggle component
- Old JavaScript game files from components/games/
- Unnecessary game layout passthrough component
- Query parameter logic for game routing

### Fixed
- Temporal workflow determinism violations (removed forbidden module imports)
- Workflow now uses `workflowInfo()` for deterministic temp directory construction
- combineAudio idempotency bug (now returns all fields consistently when audio exists)
- Audio player controls hidden by navigation on mobile/desktop (added responsive positioning)
- Story featured images with white borders and signatures (updated prompt)
- Dropdown focus outlines that couldn't be removed (added proper Tailwind overrides)
- Missing ffmpeg in Docker container (now pre-installed in custom image)
- Duplicate story generation issue (added title checking and increased randomness)
- ESLint prefer-const error in signout route
- TypeScript type errors in game components
- Build configuration for Next.js 15 with TypeScript
- Database constraint for quiz preferences to allow 'preset' verb selection option
- Modal header spacing issue (removed extra top padding in content area)
- Sticky footer covering scrollbar in verb selection modal (added bottom padding)
- Inconsistent text styling across modals (standardized font weights and sizes)
- Empty tense and pronoun selections being counted and displayed
- Console errors for 401 responses when unauthenticated users access quiz preferences (now handled silently)

---

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release of Capital Spanish
- Interactive games: Vocabulary, Grammar, Pronunciation, Shopping, Translation
- Supabase authentication and database
- Stripe subscription billing
- ElevenLabs TTS integration
- OpenAI-powered translation exercises
- Progress tracking and user statistics
- Custom quiz generation from favorited verbs
- Reading stories with audio
- Verb conjugation reference

### Infrastructure
- Next.js 15 App Router architecture
- Tailwind CSS v4 styling
- Row Level Security for user data
- Automatic stat calculation via database triggers

---

## Template for future releases:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

---

**Categories explained:**
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
