import { describe, it, expect } from 'vitest';

import { createChildProcess } from '@naria2/node';

import { createClient } from '../src';

describe('@naria2/node', () => {
  it('should spawn childprocess', async () => {
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

  it('should print version', async () => {
    const client = await createClient(createChildProcess());
    const { version } = await client.getVersion();
    expect(['1.35.0', '1.36.0', '1.37.0'].includes(version)).toBeTruthy();
    await client.shutdown();
  });
});
