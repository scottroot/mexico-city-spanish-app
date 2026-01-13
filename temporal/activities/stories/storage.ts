import { createClient } from '@supabase/supabase-js';
import { Context } from '@temporalio/activity';
import { readFile } from 'fs/promises';
import { safe } from './utils';
import path from 'path';


export function getTempDir(): string {
  const info = Context.current().info;
  const wfId = safe(info.workflowExecution.workflowId);
  const runId = safe(info.workflowExecution.runId);
  const actId = safe(info.activityId);

  return path.join('/tmp', wfId, runId, actId);
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STORIES_BUCKET = 'stories';

export interface UploadAudioParams {
  filePath: string; // Local path to the audio file
  fileName: string; // e.g., "story-slug/audio.mp3"
}

export interface UploadImageParams {
  filePath: string; // Local path to the image file
  fileName: string; // e.g., "story-slug/featured.png"
}

export interface UploadResult {
  publicUrl: string;
  path: string;
}

export async function uploadAudio(params: UploadAudioParams): Promise<UploadResult> {
  const { filePath, fileName } = params;

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
  const { filePath, fileName } = params;

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
