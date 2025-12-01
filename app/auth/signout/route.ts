import { getUser } from "@/utils/supabase/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  // Check if a user's logged in
  const { error: userError, ...user } = await getUser();  
  if (user.isLoggedIn) {
    await supabase.auth.signOut();
  }
  
  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/auth/login", req.url), {
    status: 302,
  });
}
