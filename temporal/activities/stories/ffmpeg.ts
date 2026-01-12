import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export interface CombineAudioParams {
  audioBuffers: Buffer[];
}

export interface CombineAudioResult {
  combinedAudioBuffer: Buffer;
}

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

export async function combineAudio(params: CombineAudioParams): Promise<CombineAudioResult> {
  const { audioBuffers } = params;

  console.log(`Combining ${audioBuffers.length} audio chunks`);

  if (audioBuffers.length === 0) {
    throw new Error('No audio buffers provided');
  }

  if (audioBuffers.length === 1) {
    return { combinedAudioBuffer: audioBuffers[0] };
  }

  // Create temporary files for each chunk
  const tempDir = tmpdir();
  const tempFiles: string[] = [];
  const outputFile = join(tempDir, `combined-${Date.now()}.mp3`);

  try {
    // Write all chunks to temp files
    for (let i = 0; i < audioBuffers.length; i++) {
      const tempFile = join(tempDir, `chunk-${Date.now()}-${i}.mp3`);
      await writeFile(tempFile, audioBuffers[i]);
      tempFiles.push(tempFile);
    }

    // Combine with FFmpeg
    await concatMp3Files(tempFiles, outputFile);

    // Read the combined file
    const fs = require('fs').promises;
    const combinedBuffer = await fs.readFile(outputFile);

    console.log('Audio combined successfully');

    return { combinedAudioBuffer: combinedBuffer };
  } finally {
    // Clean up temp files
    for (const file of [...tempFiles, outputFile]) {
      try {
        await unlink(file);
      } catch (error) {
        console.warn(`Failed to delete temp file ${file}:`, error);
      }
    }
  }
}
