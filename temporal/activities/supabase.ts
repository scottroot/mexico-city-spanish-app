import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SaveGameParams {
  type: string;
  difficulty: string;
  title: string;
  description: string;
  content: any;
  created_by?: string;
}

export async function saveGame(params: SaveGameParams): Promise<{ id: string }> {
  console.log(`Saving game: ${params.title} (${params.type}, ${params.difficulty})`);

  const { data, error } = await supabase
    .from('games')
    .insert({
      type: params.type,
      difficulty: params.difficulty,
      title: params.title,
      description: params.description,
      content: params.content,
      created_by: params.created_by,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to save game: ${error.message}`);
  }

  console.log(`Game saved with ID: ${data.id}`);
  return { id: data.id };
}

