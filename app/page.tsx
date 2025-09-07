import { createClient } from '@/utils/supabase/server'
import Home from './Home'
import { GameData } from '../entities/Game'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch games server-side with error handling
  let gamesData = []
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching games:', error)
      // If games table doesn't exist yet, use empty array
      gamesData = []
    } else {
      gamesData = data || []
    }
  } catch (err) {
    console.error('Database connection error:', err)
    // Fallback to empty array if database is not ready
    gamesData = []
  }

  // Pass games as props to the Home component
  return <Home initialGames={gamesData} />
}
