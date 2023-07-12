import { describe, it, expect, afterAll } from 'vitest';

import { createSubprocess, SubprocessSocket } from '@naria2/node';

describe('spawn aria2 subprocess', () => {
  let conn: SubprocessSocket;

  it('should work', async () => {
    conn = await createSubprocess();
    await new Promise((r) => conn.addEventListener('open', () => r(undefined)));
  });

  afterAll(() => {
    conn.close();
  });
});
