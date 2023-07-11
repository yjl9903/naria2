import type { ChildProcess, SpawnOptions } from 'node:child_process';

import { randomUUID } from 'node:crypto';

import { spawn } from '@naria2/core';
import { createHTTP, createWebSocket, Socket } from 'maria2';

export { createHTTP, createWebSocket };

export interface SubprocessOptions {
  rpcListenPort: number;
  rpcSecret: string;
  args: string[];
  spawn: SpawnOptions;
}

export type SubprocessSocket = Socket & { options: SubprocessOptions; childProcess: ChildProcess };

export async function createSubprocess(
  options: Partial<SubprocessOptions> = {}
): Promise<SubprocessSocket> {
  const resolvedArgs: string[] = [];
  const resolvedOptions: SubprocessOptions = {
    rpcListenPort: options.rpcListenPort ?? 16800 + Math.round(Math.random() * 10000),
    rpcSecret: options.rpcSecret ?? randomUUID(),
    args: resolvedArgs,
    spawn: options.spawn ?? {}
  };

  resolvedArgs.push(
    '--enable-rpc',
    '--rpc-listen-all',
    '--rpc-allow-origin-all',
    `--rpc-listen-port=${resolvedOptions.rpcListenPort}`,
    `--rpc-secret=${resolvedOptions.rpcSecret}`,
    ...(options.args ?? [])
  );

  const child = spawn(resolvedArgs, resolvedOptions.spawn);
  await new Promise((res, rej) => {
    let spawn = false;
    child.once('spawn', () => {
      spawn = true;
      res(undefined);
    });
    child.once('error', (e) => {
      if (!spawn) {
        rej(e);
      }
    });
  });

  const ws = createWebSocket(`ws://localhost:${resolvedOptions.rpcListenPort}/jsonrpc`);

  return new (class extends EventTarget {
    readonly options = resolvedOptions;

    readonly childProcess = child;

    get readyState() {
      return ws.readyState;
    }

    close(code?: number, reason?: string): void {
      ws.close(code, reason);
      child.kill();
    }

    send(data: string): void {
      ws.send(data);
    }
  })() as unknown as SubprocessSocket;
}
