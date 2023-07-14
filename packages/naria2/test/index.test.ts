import { describe, it, expect, afterAll } from 'vitest';

import { createChildProcess, ChildProcessSocket } from '@naria2/node';

describe('spawn aria2 childprocess', () => {
  let conn: ChildProcessSocket;

  it('should work', async () => {
    conn = await createChildProcess();
    const ok = await new Promise<boolean>((r) => {
      conn.addEventListener('open', () => r(true));
      conn.addEventListener('error', () => r(false));
      conn.addEventListener('close', () => r(false));
    });
    expect(ok).toBeTruthy();
  });

  afterAll(() => {
    conn?.close();
  });
});
