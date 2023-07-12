import { describe, it, expect, afterAll } from 'vitest';

import { createSubprocess, SubprocessSocket } from '@naria2/node';

describe('spawn aria2 subprocess', () => {
  let conn: SubprocessSocket;

  it('should work', async () => {
    conn = await createSubprocess();
    const ok = await new Promise<boolean>((r) => {
      conn.addEventListener('open', () => r(true));
      conn.addEventListener('error', () => r(false));
      conn.addEventListener('close', () => r(false));
    });
    expect(ok).toBeTruthy();
  });

  afterAll(() => {
    conn.close();
  });
});
