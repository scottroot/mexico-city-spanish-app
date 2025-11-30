import { createClient } from './server'


export type UserData = {
  isLoggedIn: boolean, 
  id: string | undefined, 
  name: string | undefined,
  email: string | undefined, 
  tier: "free" | "premium" | "pro",
  error?: string,
}

export async function getUser(): Promise<{ 
  isLoggedIn: boolean, 
  id: string | undefined, 
  name: string | undefined,
  email: string | undefined, 
  tier: "free" | "premium" | "pro",
  error?: string,
} | UserData> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const isLoggedIn = data?.claims?.sub ? true : false;
    const userId = data?.claims?.sub;
    const userName = data?.claims?.name;
    const userEmail = data?.claims?.email;
    const userTier = data?.claims?.user_tier || "free";
    return { 
      isLoggedIn, 
      id: userId,
      name: userName,
      email: userEmail, 
      tier: userTier as "free" | "premium" | "pro"
    }
  } catch (error) {
    return { 
      error: `Failed to get user - ${error}`, 
      isLoggedIn: false,
      id: undefined,
      name: undefined, 
      email: undefined, 
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
