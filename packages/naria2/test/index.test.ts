import { describe, it, expect } from 'vitest';

import { createChildProcess } from '@naria2/node';

describe('spawn aria2 childprocess', () => {
  it('should work', async () => {
    const conn = await createChildProcess({
      dir: '.',
      checkIntegrity: false,
      rpc: { secret: '12345678', listenPort: 16800, listenAll: true, allowOriginAll: true }
    });

    expect(conn.getOptions().secret).toBe('12345678');
    expect(conn.getOptions().args).toMatchInlineSnapshot(`
      [
        "--dir=.",
        "--check-integrity=false",
        "--enable-rpc=true",
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

    conn.close();
  });
});
