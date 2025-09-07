import { createClient } from '@/utils/supabase/server'
import Home from './Home'
import { GameData } from '../entities/Game'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch games server-side
  const { data: gamesData, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching games:', error)
  }

  // Pass games as props to the Home component
  return <Home initialGames={gamesData || []} />
}
