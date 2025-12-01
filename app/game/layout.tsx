import { getUser } from '@/utils/supabase/auth';
import { redirect } from 'next/navigation'

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check auth for all game routes
  // const { error: userError, ...user } = await getUser();
  // if (userError || !user.isLoggedIn) {
  //   redirect('/auth/login')
  // }

  // TODO: update this to be a react create element so we can pass the user prop
  return <>{children}</>
}
