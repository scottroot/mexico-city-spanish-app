import { getUser } from '@/utils/supabase/auth';
import GrammarGame, { GAME_ID } from './GrammarGame';
import { fetchGame } from '../fetchGame';
import { notFound } from 'next/navigation';
import { type GameData } from '@/app/types';


export const dynamic = "force-dynamic";

export default async function GrammarGamePage() {
  const user = await getUser()
  const game: GameData | null = await fetchGame(GAME_ID)

  if (!game) notFound()

  return (
    <GrammarGame user={user} game={game} />
  )
}
