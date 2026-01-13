import { promises as fs } from 'fs';

export async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function createTempDir(tempDir: string): Promise<void> {
  await fs.mkdir(tempDir, { recursive: true });
}
