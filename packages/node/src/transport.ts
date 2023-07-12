import type { ChildProcess, SpawnOptions } from 'node:child_process';

import { randomUUID } from 'node:crypto';

import { getPortPromise } from 'portfinder';
import { createWebSocket, Socket } from 'maria2';

import { spawn } from './subprocess';

export interface SubprocessOptions {
  rpcListenPort: number;
  rpcSecret: string;
  args: string[];
  spawn: SpawnOptions;
}

export class SubprocessSocket implements Socket {
  readonly socket: Socket;

  readonly childProcess: ChildProcess;

  readonly options: SubprocessOptions;

  constructor(socket: Socket, childProcess: ChildProcess, options: SubprocessOptions) {
    this.socket = socket;
    this.childProcess = childProcess;
    this.options = options;
  }

  get readyState() {
    return this.socket.readyState;
  }

  close(code?: number, reason?: string): void {
    this.socket.close(code, reason);
    this.childProcess.kill();
  }

  send(data: string): void {
    return this.socket.send(data);
  }

  addEventListener(type: 'message' | 'open' | 'error' | 'close', listener: (event: any) => void, options?: { once?: boolean }): void {
    // @ts-ignore
    return this.socket.addEventListener(type, listener, options);
  }
}

export async function createSubprocess(
  options: Partial<SubprocessOptions> = {}
): Promise<SubprocessSocket> {
  const resolvedArgs: string[] = [];
  const resolvedOptions: SubprocessOptions = {
    rpcListenPort: options.rpcListenPort ?? (await getPortPromise({ port: 16800 })),
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

    if (child.stdout) {
      child.stdout.once('data', () => {
        spawn = true;
        res(undefined);
      })
    } else {
      child.once('spawn', () => {
        spawn = true;
        res(undefined);
      });
    }

    child.once('error', (e) => {
      if (!spawn) {
        rej(e);
      }
    });
  });

  const ws = createWebSocket(`ws://127.0.0.1:${resolvedOptions.rpcListenPort}/jsonrpc`);
  // @ts-ignore
  ws.addEventListener('error', (e: any) => {
    child.kill();
  }, { once: true })

  return new SubprocessSocket(ws, child, resolvedOptions);
}
