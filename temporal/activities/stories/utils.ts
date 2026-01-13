import { promises as fs } from 'fs';


export async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

export function safe(s: string) {
  return s.replace(/[^a-zA-Z0-9._-]/g, '_');
}
