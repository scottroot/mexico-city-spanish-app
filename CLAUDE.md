# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capital Spanish is a Next.js 15 Spanish language learning application focused on Mexico City Spanish. The app features interactive games for vocabulary, grammar, pronunciation, shopping scenarios, and translation exercises. It uses Supabase for authentication and data persistence, Stripe for subscription billing, and integrates with external services like ElevenLabs for TTS and OpenAI for translation game content generation.

## Development Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically
```

## Architecture

### Frontend Architecture

**App Router Structure** - Uses Next.js 15 App Router with:
- Server Components by default (async functions in app/layout.js, pages)
- Client Components marked with 'use client' directive
- Middleware for Supabase session management (middleware.ts)

**Layout Hierarchy**:
1. `app/layout.js` - Root layout, fetches user from Supabase server client
2. `components/MainLayout.tsx` - Client component handling navigation (desktop sidebar, mobile top/bottom bars)
3. Page content with responsive padding to account for navigation bars

**Navigation System** (`components/Nav/MainNavigation.tsx`):
- Desktop: Fixed left sidebar (86px on md, 256px on xl)
- Mobile: Top bar (h-10) + bottom nav (h-16)
- MainLayout applies appropriate padding for each breakpoint

### Backend Architecture

**Data Access Pattern** - All client-side data fetches go through Next.js API routes (app/api/), never direct Supabase client calls from components. This ensures:
- RLS policies are properly enforced
- Server-side authentication is verified
- Sensitive operations use service role when appropriate

**Entity Layer** (`entities/` directory):
- Classes like `Game`, `Progress`, `Favorites` encapsulate business logic
- All methods call `/api/*` routes using fetch
- Return structured objects or error responses
- Example: `Game.list()` calls `GET /api/games`

**API Routes** (`app/api/`):
- `/api/games` - CRUD for games from Supabase
- `/api/verbs` - Spanish verb conjugations
- `/api/stories` - Reading stories with audio
- `/api/quiz` - Custom quiz generation
- `/api/billing/*` - Stripe integration (checkout, portal, webhooks)
- `/api/tts` - ElevenLabs text-to-speech
- `/api/translation/*` - OpenAI-powered translation game content

### Database Architecture

**Supabase Client Initialization**:
- Server Components: `utils/supabase/server.ts` - createServerClient with cookie management
- Client Components: `utils/supabase/client.ts` - createBrowserClient
- Middleware: `utils/supabase/middleware.ts` - Session refresh on every request

**Database Schema** (see `database/setup.sql`):
- `profiles` - User profiles (extends auth.users)
- `progress` - Game completion tracking with scores, time, mistakes
- `user_stats` - Aggregated stats (streak, total score, games completed)
- `games` - Game content with type, difficulty, JSONB content
- `verbs` + `verb_conjugations` - Spanish verb conjugation data
- `user_favorites` - Favorited verbs for custom quizzes
- `user_quiz_preferences` - Quiz customization (tenses, verbs, question count)
- `stories` - Reading comprehension stories with audio
- `billing.customers` + `billing.subscriptions` - Stripe integration

**Row Level Security (RLS)**: Enabled on all tables. Users can only access their own data (progress, stats, favorites, etc.). Games, verbs, and stories are publicly readable.

**Database Triggers**:
- `handle_new_user()` - Auto-creates profile + user_stats on signup
- `update_user_stats()` - Recalculates stats when progress changes
- `update_updated_at_column()` - Auto-updates updated_at timestamp

### Styling

**Tailwind CSS v4** - Uses new PostCSS-based architecture:
- Config: `postcss.config.mjs` with `@tailwindcss/postcss` plugin
- No traditional tailwind.config.js file
- Global styles: `app/globals.css`
- Utility: `lib/cn.ts` - clsx + tailwind-merge for conditional classes

**Font**: Rubik (Google Fonts) loaded in `app/layout.js`

**Animations**: Framer Motion for page transitions and interactive elements

### Game System

**Game Types** (defined in `components/games/types.ts`):
- `vocabulary` - Multiple choice, image-based learning
- `grammar` - Fill-in-blank, ser vs estar exercises
- `pronunciation` - Sinalefa identification, syllabification
- `shopping` - Checkout scenarios with price listening
- `translation` - AI-generated translation exercises (English↔Spanish)

**Game Difficulties**: `beginner`, `intermediate`, `advanced`

**Game Content Structure** - Games are stored in `games` table with JSONB `content` field containing questions array. Each question has:
- `question` / `instruction` / `sentence` / `phrase` (depending on game type)
- `options` (for multiple choice)
- `correct_answer`
- `explanation`
- `hint` (optional)

**Custom Quiz System** (`app/quiz/`):
- Users select verb tenses/moods from favorites or custom verb list
- Preferences stored in `user_quiz_preferences` table
- Quiz generated server-side based on conjugation data

**Translation Game** (`components/games/translation/`):
- AI-generated questions using OpenAI API
- Supports English→Spanish and Spanish→English
- Stored in separate translation_quizzes table
- Evaluation endpoint for grading with feedback

### Authentication & Billing

**Supabase Auth**:
- Login/Signup flows in `app/auth/`
- Session managed by middleware on all routes (except static assets)
- User object passed from server layout to client MainLayout

**Stripe Integration** (`utils/supabase/billing.ts`):
- `checkPremiumAccess()` - Check if user has active subscription
- `getBillingStatus()` - Detailed subscription info
- `createCheckoutSession()` - Initiate subscription purchase
- `createPortalSession()` - Manage existing subscription
- Webhooks: `app/api/billing/stripe-webhook/route.ts` handles subscription events
- Billing data in `billing` schema (customers, subscriptions, events)

**Access Gating**: Premium features check `billing.has_access(uid)` function or call `/api/billing/status`

### External Integrations

**ElevenLabs TTS** - `/api/tts` route generates Spanish audio for pronunciation games and stories

**OpenAI** - `/api/translation/generate-question` and `evaluate-answer` for AI-powered translation exercises

**Mixpanel & PostHog** - Analytics tracking (currently commented out in `instrumentation-client.ts`)

## Important Patterns

### Adding a New Game Type

1. Update `components/games/types.ts` to add new type to `GameType` union and `GAME_TYPES` array
2. Run migration: `database/update_game_type_constraint.sql` to update DB constraint
3. Create game component in `components/games/`
4. Add route handler if needed (e.g., for AI-generated content)
5. Insert game records into `games` table with new type

### Working with Supabase

**Never use Supabase client directly in client components**. Always create an API route:

```typescript
// ❌ Bad - Client component calling Supabase directly
const { data } = await supabase.from('games').select('*')

// ✅ Good - Client component calling API route
const response = await fetch('/api/games')
const { data } = await response.json()
```

API routes should use `createClient()` from `utils/supabase/server.ts` for authenticated requests.

### Environment Variables

Required in `.env` or `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role for admin operations
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_ID` - Default subscription price ID
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `OPENAI_API_KEY` - OpenAI API key

### Database Migrations

SQL files in `database/` directory should be run in Supabase SQL editor. Migration naming pattern:
- `setup.sql` - Initial schema (run first)
- `add_*.sql` - Additive migrations (new tables, columns)
- `fix_*.sql` - Corrective migrations (constraints, policies)
- `update_*.sql` - Modification migrations

Apply migrations manually in order by examining git history or timestamps.

### Component Patterns

**Server vs Client Components**:
- Use Server Components for data fetching, SEO, initial render performance
- Use Client Components ('use client') for interactivity, hooks, browser APIs
- Pass data from Server → Client via props (user object, initial data)

**Responsive Design**:
- Mobile-first approach with Tailwind breakpoints
- Navigation padding: `max-md:pt-10 max-md:pb-16 md:pl-[86px] xl:pl-64`
- Use `clsx` utility for conditional classes

## Path Aliases

TypeScript paths configured in tsconfig.json:
- `@/*` maps to repository root
- Example: `import { createClient } from '@/utils/supabase/server'`
