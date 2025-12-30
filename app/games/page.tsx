import { createClient } from '@/utils/supabase/server';
import GamesComponent from './GamesComponent';
import { GameData } from '../types';
import { getUser } from '@/utils/supabase/auth';


export default async function GamesPage() {
  const supabase = await createClient()
  const user = await getUser()
  
  let gamesData: GameData[] = []
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching games:', error)
      gamesData = []
    } 
    else {
      gamesData = data || []
    }
  }
  catch (err) {
    console.error('Database connection error:', err)
    gamesData = []
  }

  return <GamesComponent initialGames={gamesData} user={user} />
}
