import { createClient } from '@/utils/supabase/client'
import Homepage from './Homepage'


export default async function Page() {
  const supabase = createClient()
  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(4);

  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(4);
  
  if (gamesError) {
    console.error('Error fetching games:', gamesError)
  }

  if (storiesError) {
    console.error('Error fetching stories:', storiesError)
  }

  return (
    <Homepage 
      games={games || []}
      stories={stories || []}
    />
  )
}