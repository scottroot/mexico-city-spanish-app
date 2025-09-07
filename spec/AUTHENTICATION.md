# Authentication System Documentation

## Overview

The Spanish Language Learning App uses Supabase for authentication, providing a complete user management system with email/password authentication, password reset, and secure session management.

## Architecture

### Authentication Flow
`User Action` → `AuthContext` → `Supabase Auth API` → `Profile Creation` → `State Updates` → `UI Components`

### Component Hierarchy
- `AuthProvider` (Root) → `Layout` → `ProtectedRoute` → App Pages
- Auth Pages: `/auth/login`, `/auth/signup`, `/auth/forgot-password`
- Protected Pages: `/`, `/game`, `/progress`

## Core Components

### AuthContext (`contexts/AuthContext.js`)
- State: `user`, `profile`, `loading`
- Methods: `signUp()`, `signIn()`, `signOut()`, `updateProfile()`, `resetPassword()`, `ensureUserProfile()`
- Features: Session persistence, real-time updates, profile integration, automatic profile creation, error handling

### Authentication Forms
- `LoginForm.js`: `handleSubmit()` → `signIn()`, validation, loading states
- `SignupForm.js`: `handleSubmit()` → `signUp()`, password confirmation, name field
- `ForgotPasswordForm.js`: `handleSubmit()` → `resetPassword()`, email validation

### ProtectedRoute (`components/auth/ProtectedRoute.js`)
- Uses `useAuth()` hook to check `user` state
- Redirects to `/auth/login` if `!user && !loading`
- Renders children if authenticated

## Database Integration

### User Profiles
- Auto-creation via `handle_new_user()` trigger on `auth.users` insert
- Profile data in `public.profiles` table
- Real-time updates via `supabase.from('profiles')`

### Row Level Security (RLS)
- Policies: `auth.uid() = id` (profiles), `auth.uid() = user_id` (progress, user_stats)
- All tables: `profiles`, `progress`, `user_stats`

## Security Features

### Session Management
- JWT tokens via `supabase.auth.getSession()`
- Auto-refresh before expiration
- Secure browser storage
- Session persistence across restarts

### Profile Creation Security
- Automatic profile creation via `ensureUserProfile()` for confirmed users
- Security checks: user validation, email confirmation, authentication verification
- Prevents profile creation for anonymous or unconfirmed users
- Idempotent operations prevent duplicate profile creation

### Password Security
- Hashed by Supabase Auth
- Client/server validation
- Reset flow with email verification
- Minimum requirements enforced

### Data Protection
- RLS policies enforce `auth.uid()` matching
- User data isolation
- Authenticated API calls
- Secure environment configuration

## User Experience

### Authentication States
- **Unauthenticated**: Redirected to login, can access auth pages
- **Authenticated**: Full app access, user menu, session management
- **Loading**: Loading indicators, smooth transitions, error handling

### UI/UX Features
- Responsive design, mobile-first forms
- Accessibility: ARIA labels, keyboard navigation, screen reader support
- Error handling: Spanish messages, validation feedback, graceful degradation

## Integration Points

### Layout Integration
- `components/Layout.js`: Shows user menu (authenticated) or login button (unauthenticated)
- Handles user menu interactions and logout functionality

### Entity Integration
- `entities/User.js`, `entities/Progress.js`: All operations require authentication
- User ID auto-included in queries, RLS policies enforce isolation

### Route Protection
- Protected: `/`, `/game`, `/progress` (require authentication)
- Public: `/auth/*` (accessible without authentication)

## Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Supabase Settings
- Site URL: Development and production URLs
- Redirect URLs: Auth callbacks
- Email Templates: Spanish language customization
- Password Policy: Security requirements

## Troubleshooting

### Common Issues
- **Auth not working**: Check Supabase URL/keys, env vars, browser console, project status
- **DB permission errors**: Verify RLS policies, auth status, database setup, Supabase logs
- **Session issues**: Clear browser storage, check token expiration, verify auth settings

### Debug Tools
- Supabase dashboard (auth logs), browser dev tools (network), React DevTools (state), database logs

## Future Enhancements

### Planned Features
- Social Authentication (Google, GitHub, Facebook OAuth)
- Profile Pictures (avatar upload/management)
- Two-Factor Authentication (enhanced security)
- Admin Dashboard (user management)

### Performance Improvements
- Session Caching (optimize session management)
- Lazy Loading (load auth components on demand)
- Offline Support (handle offline auth states)
- Analytics (track auth metrics)

---

*This authentication documentation should be updated when changes are made to the authentication system.*
