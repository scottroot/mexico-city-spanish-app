import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

const ELEVEN_V3_MODEL = 'eleven_v3';
const CHUNK_SIZE = 3000;

interface AlignmentData {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
}

interface TTSChunkResult {
  audioBuffer: Buffer;
  alignment?: AlignmentData;
  normalizedAlignment?: AlignmentData;
}

function splitTextIntoChunks(text: string, maxLength = CHUNK_SIZE): string[] {
  const lines = text.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = line;
    } else {
      if (currentChunk.length > 0) {
        currentChunk += '\n' + line;
      } else {
        currentChunk = line;
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function combineAlignmentData(alignmentDataArray: AlignmentData[]): AlignmentData | null {
  if (alignmentDataArray.length === 0) return null;
  if (alignmentDataArray.length === 1) return alignmentDataArray[0];

  const combined: AlignmentData = {
    characters: [],
    characterStartTimesSeconds: [],
    characterEndTimesSeconds: [],
  };

  let timeOffset = 0;

  for (const alignment of alignmentDataArray) {
    if (
      alignment &&
      alignment.characters &&
      alignment.characterStartTimesSeconds &&
      alignment.characterEndTimesSeconds
    ) {
      combined.characters.push(...alignment.characters);

      const adjustedStartTimes = alignment.characterStartTimesSeconds.map((t) => t + timeOffset);
      const adjustedEndTimes = alignment.characterEndTimesSeconds.map((t) => t + timeOffset);

      combined.characterStartTimesSeconds.push(...adjustedStartTimes);
      combined.characterEndTimesSeconds.push(...adjustedEndTimes);

      if (alignment.characterEndTimesSeconds.length > 0) {
        timeOffset = Math.max(...alignment.characterEndTimesSeconds) + timeOffset;
      }
    }
  }

  return combined;
}

async function generateTTSChunk(text: string, voiceId: string): Promise<TTSChunkResult | null> {
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
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

export interface GenerateTTSParams {
  text: string;
  voiceId?: string;
}

export interface GenerateTTSResult {
  audioBuffers: Buffer[];
  alignment: AlignmentData | null;
  normalizedAlignment: AlignmentData | null;
}

export async function generateTTS(params: GenerateTTSParams): Promise<GenerateTTSResult> {
  const { text, voiceId = process.env.ELEVENLABS_VOICE_ID! } = params;

  console.log('Generating TTS for text length:', text.length);

  const chunks = splitTextIntoChunks(text, CHUNK_SIZE);
  console.log(`Text split into ${chunks.length} chunks`);

  const audioBuffers: Buffer[] = [];
  const alignmentData: AlignmentData[] = [];
  const normalizedAlignmentData: AlignmentData[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);

    const result = await generateTTSChunk(chunks[i], voiceId);

    if (result) {
      audioBuffers.push(result.audioBuffer);
      if (result.alignment) alignmentData.push(result.alignment);
      if (result.normalizedAlignment) normalizedAlignmentData.push(result.normalizedAlignment);
    }
  }

  const combinedAlignment = combineAlignmentData(alignmentData);
  const combinedNormalizedAlignment = combineAlignmentData(normalizedAlignmentData);

  console.log(`Generated ${audioBuffers.length} audio chunks`);

  return {
    audioBuffers,
    alignment: combinedAlignment,
    normalizedAlignment: combinedNormalizedAlignment,
  };
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
