import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { promises as fs } from 'fs';
import { AlignmentData } from './elevenlabs';


async function concatMp3Files(inputFiles: string[], outFile: string): Promise<void> {
  if (inputFiles.length === 0) {
    throw new Error('No input files provided');
  }

  if (inputFiles.length === 1) {
    // Just read the single file
    const fs = require('fs').promises;
    const buffer = await fs.readFile(inputFiles[0]);
    await fs.writeFile(outFile, buffer);
    return;
  }

  // Build FFmpeg arguments for multiple inputs
  const args: string[] = [];

  // Add input files
  for (const file of inputFiles) {
    args.push('-i', file);
  }

  // Build filter complex for concatenation
  const inputLabels = inputFiles.map((_, i) => `[${i}:a]`).join('');
  const filterComplex = `${inputLabels}concat=n=${inputFiles.length}:v=0:a=1[a]`;

  args.push(
    '-filter_complex',
    filterComplex,
    '-map',
    '[a]',
    '-c:a',
    'libmp3lame',
    '-q:a',
    '2',
    outFile
  );

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args, { stdio: 'inherit' });
    ffmpeg.on('error', reject);
    ffmpeg.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}


function combineAlignmentObjects(alignmentDataArray: AlignmentData[]): AlignmentData | null {
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
      Array.isArray(alignment.characters) &&
      Array.isArray(alignment.characterStartTimesSeconds) &&
      Array.isArray(alignment.characterEndTimesSeconds)
    ) {
      combined.characters.push(...alignment.characters);

      const adjustedStartTimes = alignment.characterStartTimesSeconds.map((t) => t + timeOffset);
      const adjustedEndTimes = alignment.characterEndTimesSeconds.map((t) => t + timeOffset);

      combined.characterStartTimesSeconds.push(...adjustedStartTimes);
      combined.characterEndTimesSeconds.push(...adjustedEndTimes);

      if (alignment.characterEndTimesSeconds.length > 0) {
        timeOffset += Math.max(...alignment.characterEndTimesSeconds);
      }
    }
  }

  return combined;
}

/**
 * Reads per-chunk alignment JSON files, combines them into one timeline, writes a consolidated JSON file,
 * and returns the consolidated file path.
 *
 * - Each input file should contain either an AlignmentData object or `null`.
 * - Output is written next to the first input file unless outFile is provided.
 */
export async function combineAlignmentFiles(params: {
  alignmentFiles: string[];
  outFile: string;
}): Promise<string | undefined> {
  const { alignmentFiles, outFile } = params;

  if (!alignmentFiles || alignmentFiles.length === 0) return undefined;

  // Load and filter
  const loaded: AlignmentData[] = [];
  for (const file of alignmentFiles) {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as AlignmentData | null;

    if (
      parsed &&
      Array.isArray(parsed.characters) &&
      Array.isArray(parsed.characterStartTimesSeconds) &&
      Array.isArray(parsed.characterEndTimesSeconds)
    ) {
      loaded.push(parsed);
    }
  }

  const combined = combineAlignmentObjects(loaded);
  if (!combined) return undefined;

  // Idempotency: if already exists, reuse it
  try {
    await fs.access(outFile);
    return outFile;
  }
  catch {
    // continue
  }

  await fs.writeFile(outFile, JSON.stringify(combined));
  return outFile;
}


export async function combineAudio(params: {
  audioFiles: string[];
  alignmentFiles: string[];
  normalizedAlignmentFiles: string[];
}): Promise<{
  audioFile: string;
  alignmentFile: string;
  normalizedAlignmentFile: string;
}> {
  const { audioFiles, alignmentFiles, normalizedAlignmentFiles } = params;

  console.log(`Combining ${audioFiles.length} audio chunks`);

  if (!audioFiles || audioFiles.length === 0) {
    throw new Error('No audio files provided');
  }

  // If only one file, just return it
  if (audioFiles.length === 1) {
    return { 
      audioFile: audioFiles[0],
      alignmentFile: alignmentFiles[0],
      normalizedAlignmentFile: normalizedAlignmentFiles[0]
    };
  }

  // Put output next to the chunks (same base dir) so the next Activity can find it
  const baseDir = dirname(audioFiles[0]);
  const outputFile = join(baseDir, `audio.mp3`);

  const outputAlignmentFile = join(baseDir, `alignment.json`);
  const outputNormalizedAlignmentFile = join(baseDir, `normalized-alignment.json`);

  // Idempotency: if it already exists, reuse it
  try {
    await fs.access(outputFile);
    console.log(`Combined audio already exists at ${outputFile}`);
    return {
      audioFile: outputFile,
      alignmentFile: outputAlignmentFile,
      normalizedAlignmentFile: outputNormalizedAlignmentFile
    };
  } catch {
    // continue
  }

  await concatMp3Files(audioFiles, outputFile);

  await combineAlignmentFiles({ alignmentFiles, outFile: outputAlignmentFile });
  await combineAlignmentFiles({ alignmentFiles: normalizedAlignmentFiles, outFile: outputNormalizedAlignmentFile });

  console.log(`Audio combined successfully: ${outputFile}`);

  return { 
    audioFile: outputFile,
    alignmentFile: outputAlignmentFile,
    normalizedAlignmentFile: outputNormalizedAlignmentFile
  };
}
