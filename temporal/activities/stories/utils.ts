import { promises as fs } from 'fs';

export async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}
