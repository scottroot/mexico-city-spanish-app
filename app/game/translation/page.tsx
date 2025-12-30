import { getUser } from '@/utils/supabase/auth';
import TranslationGameWrapper from './TranslationGameWrapper'
import { redirect } from 'next/navigation';


export default async function TranslationGamePage() {
  const { error: userError, ...user } = await getUser();
  if (userError || !user.isLoggedIn) {
    redirect("/auth/login?redirect=/game/translation");
  }
  return (
    <div id="game-container" className="h-full w-full">
      <TranslationGameWrapper user={user} />
    </div>
  )
}
