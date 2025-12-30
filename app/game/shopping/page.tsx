import { getUser } from '@/utils/supabase/auth'
import ShoppingGame from './ShoppingGame'
import { fetchGame } from '../fetchGame'
import { notFound } from 'next/navigation'


export const dynamic = "force-dynamic";

const GAME_ID = 'shopping-game-001';

export default async function ShoppingGamePage() {
  const user = await getUser()
  const game = await fetchGame(GAME_ID)

  if (!game) notFound()

  return (
    <ShoppingGame game={game} user={user} />
  )
}
