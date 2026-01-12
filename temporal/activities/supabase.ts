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

function slugifyTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 _.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/ /g, '-');
}

export interface SaveStoryParams {
  title: string;
  text: string;
  level: string;
  reading_time: string;
  enhanced_text?: string;
  audio_url?: string;
  featured_image_url?: string;
  alignment_data?: any;
  normalized_alignment_data?: any;
  summary?: string;
  summary_english?: string;
}

export async function saveStory(params: SaveStoryParams): Promise<{ id: string; slug: string }> {
  console.log(`Saving story: ${params.title} (${params.level})`);

  const slug = slugifyTitle(params.title);

  const { data, error } = await supabase
    .from('stories')
    .insert({
      title: params.title,
      slug,
      text: params.text,
      level: params.level,
      reading_time: params.reading_time,
      enhanced_text: params.enhanced_text,
      audio_url: params.audio_url,
      featured_image_url: params.featured_image_url,
      alignment_data: params.alignment_data,
      normalized_alignment_data: params.normalized_alignment_data,
      summary: params.summary,
      summary_english: params.summary_english,
    })
    .select('id, slug')
    .single();

  if (error) {
    throw new Error(`Failed to save story: ${error.message}`);
  }

  console.log(`Story saved with ID: ${data.id}, slug: ${data.slug}`);
  return { id: data.id, slug: data.slug };
}
