import { getUser } from '@/utils/supabase/auth'
import VocabularyGame from './VocabularyGame'
import { fetchGame } from '../fetchGame'
import { notFound } from 'next/navigation'


export const dynamic = "force-dynamic";

const GAME_ID = 'vocab-colors';

export default async function VocabularyGamePage() {
  const user = await getUser()
  const game = await fetchGame(GAME_ID)

  if (!game) notFound()

  return (
    <VocabularyGame game={game} user={user} />
    
  )
}
