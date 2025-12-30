import { getUser } from '@/utils/supabase/auth'
import VocabularyGame from './VocabularyGame'
import { fetchGame } from '../fetchGame'
import GameWrapper from '../_components/GameWrapper'
import { notFound } from 'next/navigation'
import Image from 'next/image'

const GAME_ID = 'vocab-colors';

export default async function VocabularyGamePage() {
  const user = await getUser()
  const game = await fetchGame(GAME_ID)

  if (!game) notFound()

  return (
    <VocabularyGame game={game} user={user} />
    
  )
}
