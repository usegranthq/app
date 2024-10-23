import fs from 'node:fs/promises';

export async function readFile(path: string) {
  return await fs.readFile(path, 'utf-8');
}
