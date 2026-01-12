import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Context } from '@temporalio/activity';
import { promises as fs } from 'fs';
import path from 'path';
import { exists, safe, splitTextIntoChunks } from './utils';


const ELEVEN_V3_MODEL = 'eleven_v3';
const CHUNK_SIZE = 3000;

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});


export interface AlignmentData {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
}

async function generateTTSChunk(text: string, voiceId: string): Promise<{
  audioBuffer: Buffer;
  alignment?: AlignmentData;
  normalizedAlignment?: AlignmentData;
} | null> {
  try {
    const response = await elevenlabs.textToSpeech.convertWithTimestamps(voiceId, {
      text,
      modelId: ELEVEN_V3_MODEL,
    });

    if (response && typeof response === 'object' && response.audioBase64) {
      const audioBuffer = Buffer.from(response.audioBase64, 'base64');
      return {
        audioBuffer,
        alignment: response.alignment,
        normalizedAlignment: response.normalizedAlignment,
      };
    }

    return null;
  } 
  catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}


export async function generateTTS(params: {
  text: string;
  voiceId?: string;
}): Promise<{
  audioFiles: string[];
  alignmentFiles: string[];
  normalizedAlignmentFiles: string[];
}> {
  const { text, voiceId = process.env.ELEVENLABS_VOICE_ID! } = params;

  console.log('Generating TTS for text length:', text.length);

  // Activity execution info  https://typescript.temporal.io/api/classes/activity.Context
  const info = Context.current().info;
  const wfId = safe(info.workflowExecution.workflowId);
  const runId = safe(info.workflowExecution.runId);
  const actId = safe(info.activityId);

  const baseDir = path.join('/tmp', 'tts', wfId, runId, actId);
  await fs.mkdir(baseDir, { recursive: true });

  const chunks = splitTextIntoChunks(text, CHUNK_SIZE);
  console.log(`Text split into ${chunks.length} chunks`);

  const audioFiles: string[] = [];
  const alignmentFiles: string[] = [];
  const normalizedAlignmentFiles: string[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    const audioPath = path.join(baseDir, `chunk-${i}.mp3`);
    const alignPath = path.join(baseDir, `alignment-chunk-${i}.json`);
    const normAlignPath = path.join(baseDir, `normalized-alignment-chunk-${i}.json`);

    const haveAll = await exists(audioPath) && await exists(alignPath) && await exists(normAlignPath);

    if (!haveAll) {
      const result = await generateTTSChunk(chunks[i], voiceId);
      if (!result?.audioBuffer) throw new Error(`TTS chunk ${i} failed`);

      await fs.writeFile(audioPath, result.audioBuffer);
      await fs.writeFile(alignPath, JSON.stringify(result.alignment ?? null));
      await fs.writeFile(normAlignPath, JSON.stringify(result.normalizedAlignment ?? null));
    }

    audioFiles.push(audioPath);
    alignmentFiles.push(alignPath);
    normalizedAlignmentFiles.push(normAlignPath);    
  }

  return { audioFiles, alignmentFiles, normalizedAlignmentFiles };
}


export async function enhanceText(text: string): Promise<string> {
  const url = process.env.ELEVENLABS_V3_ENHANCE_URL;
  if (!url) return text;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        dialogue_blocks: [text],
      }),
    });

    if (!response.ok) {
      console.warn(`Enhance API returned ${response.status}, using original text`);
      return text;
    }

    const data = (await response.json()) as { enhanced_blocks?: string[] };
    return data?.enhanced_blocks?.[0] ?? text;
  } catch (error) {
    console.warn('Text enhancement failed, using original text:', error);
    return text;
  }
}
