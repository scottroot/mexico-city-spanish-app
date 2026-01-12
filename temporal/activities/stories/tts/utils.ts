import { promises as fs } from 'fs';


export async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

export function safe(s: string) {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function splitTextIntoChunks(text: string, maxLength: number): string[] {
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
