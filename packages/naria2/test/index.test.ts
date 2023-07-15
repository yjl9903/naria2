import { describe, it, expect, afterAll } from 'vitest';

import { createChildProcess, ChildProcessSocket } from '@naria2/node';

describe('spawn aria2 childprocess', () => {
  let conn: ChildProcessSocket;

  it('should work', async () => {
    conn = await createChildProcess({
      rpc: { secret: '12345678', listenPort: 16800, listenAll: true, allowOriginAll: true }
    });

    expect(conn.getOptions().secret).toBe('12345678');
    expect(conn.getOptions().args).toMatchInlineSnapshot(`
      [
        "--enable-rpc",
        "--rpc-secret=12345678",
        "--rpc-listen-port=16800",
        "--rpc-listen-all=true",
        "--rpc-allow-origin-all=true",
      ]
    `);

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
