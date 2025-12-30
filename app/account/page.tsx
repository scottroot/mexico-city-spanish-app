import { getUser } from '@/utils/supabase/auth'
import type { UserData } from '@/app/types'
import { redirect } from 'next/navigation'
import AccountForm from './AccountForm'

export default async function AccountPage() {
  const user: UserData = await getUser()

  if (!user?.isLoggedIn) {
    redirect('/auth/login?redirect=/account')
  }

  return <AccountForm user={user} />
}