import { createClient } from '@supabase/supabase-js';
import { readFile, mkdir } from 'fs/promises';
import type { AlignmentData } from './tts/elevenlabs';

export async function createTempDir(tempDir: string): Promise<void> {
  await mkdir(tempDir, { recursive: true });
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STORIES_BUCKET = 'stories';

export interface UploadAudioParams {
  filePath: string; // Local path to the audio file
  slug: string; // Story slug (used for filename)
}

export interface UploadImageParams {
  filePath: string; // Local path to the image file
  slug: string; // Story slug (used for filename)
}

export interface UploadResult {
  publicUrl: string;
  path: string;
}

export async function uploadAudio(params: UploadAudioParams): Promise<UploadResult> {
  const { filePath, slug } = params;
  const fileName = `audio/${slug}.mp3`;

  console.log(`Reading audio file from: ${filePath}`);
  const audioBuffer = await readFile(filePath);

  console.log(`Uploading audio to: ${fileName}`);

  const { data, error } = await supabase.storage
    .from(STORIES_BUCKET)
    .upload(fileName, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORIES_BUCKET).getPublicUrl(data.path);

  console.log('Audio uploaded successfully:', publicUrl);

  return {
    publicUrl,
    path: data.path,
  };
}

export async function uploadImage(params: UploadImageParams): Promise<UploadResult> {
  const { filePath, slug } = params;
  const fileName = `featured-images/${slug}.png`;

  console.log(`Reading image file from: ${filePath}`);
  const imageBuffer = await readFile(filePath);

  console.log(`Uploading image to: ${fileName}`);

  const { data, error } = await supabase.storage
    .from(STORIES_BUCKET)
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORIES_BUCKET).getPublicUrl(data.path);

  console.log('Image uploaded successfully:', publicUrl);

  return {
    publicUrl,
    path: data.path,
  };
}

export interface SaveStoryParams {
  title: string;
  slug: string;
  text: string;
  level: string;
  readingTime: string;
  enhancedText?: string;
  audioUrl?: string;
  featuredImageUrl?: string;
  // TODO: Review - alignment files should realistically never be undefined
  alignmentFile?: string;
  normalizedAlignmentFile?: string;
  // TODO: Add activity to generate summaries from story text
  summary?: string;
  summaryEnglish?: string;
}

export async function saveStory(params: SaveStoryParams): Promise<{ id: string; slug: string }> {
  console.log(`Saving story: ${params.title} (${params.level})`);

  // Read and parse alignment JSON files if provided
  let alignmentData: AlignmentData | null = null;
  let normalizedAlignmentData: AlignmentData | null = null;

  if (params.alignmentFile) {
    const alignmentJson = await readFile(params.alignmentFile, 'utf-8');
    alignmentData = JSON.parse(alignmentJson) as AlignmentData;
  }

  if (params.normalizedAlignmentFile) {
    const normalizedAlignmentJson = await readFile(params.normalizedAlignmentFile, 'utf-8');
    normalizedAlignmentData = JSON.parse(normalizedAlignmentJson) as AlignmentData;
  }

  const { data, error } = await supabase
    .from('stories')
    .insert({
      title: params.title,
      slug: params.slug,
      text: params.text,
      level: params.level,
      reading_time: params.readingTime,
      enhanced_text: params.enhancedText,
      audio_url: params.audioUrl,
      featured_image_url: params.featuredImageUrl,
      alignment_data: alignmentData,
      normalized_alignment_data: normalizedAlignmentData,
      summary: params.summary,
      summary_english: params.summaryEnglish,
    })
    .select('id, slug')
    .single();

  if (error) {
    throw new Error(`Failed to save story: ${error.message}`);
  }

  console.log(`Story saved with ID: ${data.id}, slug: ${data.slug}`);
  return { id: data.id, slug: data.slug };
}
