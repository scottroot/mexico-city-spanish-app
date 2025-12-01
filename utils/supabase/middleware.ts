import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request, });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  // Fast local validation with getClaims() - no API call
  const { data, error } = await supabase.auth.getClaims();

  // Only refresh token if it's expiring soon (less than 5 minutes remaining)
  if (data?.claims?.exp) {
    const expiresAt = data.claims.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    // Token expires soon, trigger refresh with getUser()
    if (expiresAt - now < fiveMinutes) {
      await supabase.auth.getUser()
    }
  }

  return supabaseResponse
}
