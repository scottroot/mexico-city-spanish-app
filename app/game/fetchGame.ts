import { type GameData } from '@/app/types';
import { createClient } from '@/utils/supabase/server';

export async function fetchGame(gameId: string): Promise<GameData | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('games')
      .select('id, title, type, difficulty, content')
      .eq('id', gameId)
      .single();

    if (error || !data) {
      if (error) console.error('Error fetching game:', error);
      return null;
    }

    return data as GameData;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
}
