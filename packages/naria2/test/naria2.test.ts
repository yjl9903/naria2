import fs from 'node:fs/promises';

import { describe, it, expect, beforeAll } from 'vitest';

import { createChildProcess } from '@naria2/node';

import { createClient } from '../src';

import { makeSeed, Tracker } from './seed';

const FIXTURES_DIR = '__fixtures';
const DOWNLOAD_DIR = '__download';
const FILENAME = `naria2.txt`;

/**
 * Mock magnet uri
 */
let seed: string;

beforeAll(async () => {
  await fs.rm(FIXTURES_DIR, { recursive: true }).catch(() => {});
  await fs.rm(DOWNLOAD_DIR, { recursive: true }).catch(() => {});
  await fs.mkdir(FIXTURES_DIR).catch(() => {});

  const filename = `${FIXTURES_DIR}/${FILENAME}`;
  await fs.writeFile(filename, new Date().toLocaleString());
  seed = await makeSeed(filename);
}, 20 * 1000);

describe('naria2', { timeout: 20 * 1000 }, () => {
  it('should download torrent', async () => {
    const client = await createClient(createChildProcess());

    const task = await client.downloadUri(seed, {
      dir: DOWNLOAD_DIR,
      bt: { tracker: [Tracker] }
    });

    await task.watchTorrent(
      () => {},
      () => {},
      'bt-complete'
    );

    expect(await fs.readFile(`${DOWNLOAD_DIR}/${FILENAME}`, 'utf-8')).toEqual(
      await fs.readFile(`${FIXTURES_DIR}/${FILENAME}`, 'utf-8')
    );

    await client.shutdown();
  });
});
