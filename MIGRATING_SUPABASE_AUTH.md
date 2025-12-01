# Migrating to Modern Supabase Auth with getClaims()

## `getClaims()` vs `getUser()`

**`getClaims()` (Newer, Recommended)**
- Validates the JWT token **locally** by decoding it
- No external API request to Supabase Auth
- Much faster and more efficient
- Returns the JWT claims including `sub` (user ID), `email`, and custom claims
- Perfect for authentication checks

**`getUser()` (Older Pattern)**
- Makes an API request to Supabase Auth to verify the token
- Slower due to network roundtrip
- Returns full user object with metadata
- Only needed when you require complete user profile data

## Recommended Pattern with `getClaims()`

**For authentication checks** (is user logged in?):
```typescript
const { data: { user }, error } = await supabase.auth.getClaims()
// Returns { sub: 'user-uuid', email: 'user@example.com', ... }
```

**When you actually need full user data** (rare):
```typescript
const { data: { user }, error } = await supabase.auth.getUser()
// Returns complete user object with metadata, app_metadata, etc.
```

## Where to Use `getClaims()`

1. **Middleware** - Fast session validation without API calls
2. **Server Components** - Check if user is authenticated and get their ID
3. **API Routes** - Get user ID for RLS queries
4. **Route Protection** - Quick auth checks before rendering

## Updated Architecture Pattern

**Server Layout** (app/layout.js):
```typescript
const { data: { user } } = await supabase.auth.getClaims()
// user.sub is the user ID
// user.email is the email
```

**API Routes**:
```typescript
const { data: { user } } = await supabase.auth.getClaims()
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

// Use user.sub for queries
const { data } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', user.sub)
```

**Middleware**:
```typescript
const { data: { user } } = await supabase.auth.getClaims()
if (!user && isProtectedRoute) {
  return NextResponse.redirect('/login')
}
```

## When You Still Need `getUser()`

- Updating user metadata
- Getting `app_metadata` or `user_metadata`
- Profile pages where you need complete user details
- Very rare cases where JWT claims aren't sufficient

## Performance Impact

For a language learning app where auth is checked on every game load, using `getClaims()` will be significantly faster since you're not making external API calls every time. The JWT validation happens locally.

---

## Why Middleware.ts is Still Essential

Even though `getClaims()` validates JWTs locally without API calls, **middleware is still critical** for maintaining a proper authentication system. Here's why:

### 1. Session Refresh & Token Rotation

**The Problem**: JWTs expire (typically after 1 hour in Supabase). Without middleware:
- User's session would expire while they're using your app
- They'd get logged out unexpectedly
- Have to re-login constantly

**The Solution**: Middleware runs on every request and:
- Checks if the access token is close to expiring
- Automatically refreshes it using the refresh token
- Updates the auth cookies with the new tokens
- All happens transparently to the user

```typescript
// Middleware refreshes the session
const { data: { user }, error } = await supabase.auth.getUser()
// This call triggers token refresh if needed
```

### 2. Cookie Management

**The Problem**: Supabase stores auth state in cookies:
- `sb-access-token`
- `sb-refresh-token`

These cookies need to be updated on both request and response.

**The Solution**: Middleware ensures:
- Cookies are read from the request
- Session is validated/refreshed
- Updated cookies are written to the response
- Server and client stay in sync

### 3. Server/Client Hydration Consistency

**The Problem**: Next.js renders on the server first, then hydrates on the client. If auth state differs:
- Hydration mismatches
- Flash of wrong content (logged in user sees login page briefly)
- React errors

**The Solution**: Middleware ensures:
- Server gets fresh auth state before rendering
- Client receives same auth cookies
- No hydration mismatches

### 4. Route Protection Before Rendering

**The Problem**: Without middleware, you'd have to check auth in every page component:
- Repetitive code in every protected page
- Page starts to render before redirect
- Flash of protected content
- Poor UX

**The Solution**: Middleware runs **before** the page renders:
- Centralized auth logic
- Instant redirects for protected routes
- No flash of wrong content
- Better performance

### 5. Preventing Stale Sessions

**The Problem**: User logs out on another device/tab:
- Session is invalidated on Supabase
- But local JWT might still be valid (not expired yet)
- User appears logged in but API calls fail

**The Solution**: Middleware can:
- Periodically verify session is still valid
- Clear cookies if session is revoked
- Ensure consistent auth state

### 6. Security Best Practices

**The Problem**: Client-side only auth checks can be bypassed:
- Users can manipulate cookies/localStorage
- Browser dev tools can modify state
- Direct API calls can skip client checks

**The Solution**: Middleware provides:
- Server-side verification before any page loads
- Cannot be bypassed by client manipulation
- First line of defense for protected routes

## What Middleware Does in Practice

```typescript
// middleware.ts (simplified flow)
export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  // This getUser() call does TWO things:
  // 1. Validates the current session
  // 2. Refreshes tokens if needed (automatic)
  const { data: { user } } = await supabase.auth.getUser()

  // At this point, cookies have been updated in 'response'
  // if a refresh happened

  // Optional: Redirect logic
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/games')
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response // Contains updated auth cookies
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Key Takeaway

**`getClaims()` is for CHECKING auth** (is user logged in?)
- Fast, local validation
- Use in Server Components, API routes

**Middleware is for MAINTAINING auth** (keeping user logged in)
- Session refresh
- Cookie management
- Token rotation
- Happens automatically on every request

You need both:
- **Middleware** keeps the session alive and cookies fresh
- **`getClaims()`** efficiently checks if user is authenticated without extra API calls

Without middleware, your users would get logged out every hour when their JWT expires. With middleware, they stay logged in indefinitely (as long as they keep using the app).
