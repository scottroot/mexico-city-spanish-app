import { createClient } from './server'


export type UserData = {
  isLoggedIn: boolean, 
  id: string | undefined, 
  name: string | undefined,
  email: string | undefined,
  emailVerified: boolean | undefined,
  tier: "free" | "premium" | "pro",
  error?: string,
}

export async function getUser(): Promise<{ 
  isLoggedIn: boolean, 
  id: string | undefined, 
  name: string | undefined,
  email: string | undefined,
  emailVerified: boolean | undefined,
  tier: "free" | "premium" | "pro",
  error?: string,
} | UserData> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    return { 
      isLoggedIn: data?.claims?.sub ? true : false, 
      id: data?.claims?.sub,
      name: data?.claims?.name || data?.claims?.user_metadata?.name,
      email: data?.claims?.email,
      emailVerified: String(data?.claims?.user_metadata?.email_verified) === 'true',
      tier: data?.claims?.user_tier || "free" as "free" | "premium" | "pro",
    }
  } catch (error) {
    return { 
      error: `Failed to get user - ${error}`, 
      isLoggedIn: false,
      id: undefined,
      name: undefined, 
      email: undefined, 
      emailVerified: undefined,
      tier: "free",
    };
  }
}

export async function getUserTier() {
  const user = await getUser();
  return user.tier;
}

export async function isPremiumUser() {
  const tier = await getUserTier()
  return tier === 'premium' || tier === 'pro'
}


// Example usage:
//   const { data: { user }, error: authError } = await supabase.auth.getUser();
    
//   if (authError || !user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
