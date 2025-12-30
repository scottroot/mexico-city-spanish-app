import { getUser } from '@/utils/supabase/auth'
import PronunciationGame from './PronunciationGame'
import { fetchGame } from '../fetchGame'
import GameWrapper from '../_components/GameWrapper'
import { notFound } from 'next/navigation'


export const dynamic = "force-dynamic";

const GAME_ID = 'pronunciation-sinalefa';

export default async function PronunciationGamePage() {
  const user = await getUser()
  const game = await fetchGame(GAME_ID)

  if (!game) notFound()

  return (
    <PronunciationGame game={game} user={user} />
  )
}
