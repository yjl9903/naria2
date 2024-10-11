import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';

export async function readTorrent(file: string) {
  const buffer = await readFile(file);
  return buffer.toString('base64');
}

export function readTorrentSync(file: string) {
  const buffer = readFileSync(file);
  return buffer.toString('base64');
}

export async function fetchTorrent(...args: Parameters<typeof fetch>) {
  const resp = await fetch(...args);
  const buffer = await resp.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}
