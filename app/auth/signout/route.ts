import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Create a response object that we can modify
  const response = NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  });

  // Create supabase client with proper cookie handling for route handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  );

  // Sign out the user - this will clear the auth cookies
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  return response;
}
