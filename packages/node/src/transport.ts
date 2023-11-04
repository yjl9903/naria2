import type { PartialDeep } from 'type-fest';
import type { ChildProcess, SpawnOptions } from 'node:child_process';

import { randomUUID } from 'node:crypto';

import {
  type Aria2RPCOptions,
  type Aria2GlobalOptions,
  resolveGlobalOptions,
  isDef,
  resolveRPCOptions,
  stringifyCliOptions
} from '@naria2/options';
import { getPortPromise } from 'portfinder';
import { type Socket, type PreconfiguredSocket, createWebSocket } from 'maria2/transport';

import { spawn } from './child_process';

export type ChildProcessOptions = {
  rpc: Partial<Aria2RPCOptions>;

  /**
   * 'inherit': inherit the current envrionment variables
   *
   * 'ignore': remove the related environment variables
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#environment
   */
  environment:
    | 'inherit'
    | 'ignore'
    /**
     * @link https://aria2.github.io/manual/en/html/aria2c.html#environment
     */
    | Partial<{
        http_proxy: string;

        https_proxy: string;

        ftp_proxy: string;

        all_proxy: string;

        no_proxy: string[];
      }>;

  spawn: SpawnOptions;
};

export type ResolvedChildProcessOptions = Omit<ChildProcessOptions, 'environment' | 'rpc'> & {
  rpc: Pick<Aria2RPCOptions, 'listenPort' | 'secret'> & Partial<Aria2RPCOptions>;

  args: string[];
};

export class ChildProcessSocket implements PreconfiguredSocket {
  readonly socket: Socket;

  readonly childProcess: ChildProcess;

  readonly disposables: Set<() => void> = new Set();

  readonly options: ResolvedChildProcessOptions;

  constructor(socket: Socket, childProcess: ChildProcess, options: ResolvedChildProcessOptions) {
    this.socket = socket;
    this.childProcess = childProcess;
    this.options = options;
  }

  get readyState() {
    return this.socket.readyState;
  }

  public getOptions() {
    return {
      listenPort: this.options.rpc.listenPort,
      secret: this.options.rpc.secret,
      args: this.options.args
    };
  }

  public onClose(fn: () => void) {
    this.disposables.add(fn);
    return () => {
      this.disposables.delete(fn);
    };
  }

  public close(code?: number, reason?: string): void {
    for (const dp of [...this.disposables].reverse()) {
      try {
        dp();
      } catch (error) {}
    }

    this.socket.close(code, reason);
    this.childProcess.kill();
  }

  public send(data: string): void {
    return this.socket.send(data);
  }

  public addEventListener(
    type: 'message',
    listener: (event: { data: any }) => void,
    options?: { once?: boolean }
  ): void;
  public addEventListener(type: 'open', listener: () => void, options?: { once?: boolean }): void;
  public addEventListener(
    type: 'error',
    listener: (error: any) => void,
    options?: { once?: boolean }
  ): void;
  public addEventListener(type: 'close', listener: () => void, options?: { once?: boolean }): void;
  public addEventListener(
    type: 'message' | 'open' | 'error' | 'close',
    listener: (...args: any[]) => void,
    options?: { once?: boolean }
  ): void {
    return this.socket.addEventListener(type as any, listener, options);
  }
}

export async function createChildProcess(
  options: Partial<ChildProcessOptions> & PartialDeep<Aria2GlobalOptions> = {}
): Promise<ChildProcessSocket> {
  const resolvedArgs: string[] = [];

  const [environment, proxy] = inferEnv(options.environment);

  const rpcOptions = {
    ...options?.rpc,
    listenPort: options?.rpc?.listenPort ?? (await getPortPromise({ port: 6800 })),
    secret: options?.rpc?.secret ?? randomUUID()
  };
  const resolvedOptions: ResolvedChildProcessOptions = {
    rpc: rpcOptions,
    args: resolvedArgs,
    spawn: { ...options.spawn, env: { ...environment, ...proxy } }
  };

  const aria2Args = resolveGlobalOptions(options);
  const aria2RpcArgs = resolveRPCOptions(rpcOptions);

  resolvedArgs.push('--enable-rpc', ...stringifyCliOptions({ ...aria2Args, ...aria2RpcArgs }));

  const child = spawn(resolvedArgs, resolvedOptions.spawn);
  await new Promise((res, rej) => {
    let spawn = false;

    if (child.stdout) {
      child.stdout.once('data', () => {
        spawn = true;
        res(undefined);
      });
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

  const ws = createWebSocket(`ws://127.0.0.1:${rpcOptions.listenPort}/jsonrpc`);
  // @ts-ignore
  ws.addEventListener(
    'error',
    (e: any) => {
      child.kill();
    },
    { once: true }
  );

  return new ChildProcessSocket(ws, child, resolvedOptions);
}

function inferEnv(environment?: ChildProcessOptions['environment']): [
  NodeJS.ProcessEnv,
  Partial<{
    http_proxy: string;

    https_proxy: string;

    ftp_proxy: string;

    all_proxy: string;

    no_proxy: string;
  }>
] {
  const env = { ...process?.env };

  const picked = {
    http_proxy: env['http_proxy'],
    https_proxy: env['https_proxy'],
    ftp_proxy: env['ftp_proxy'],
    all_proxy: env['all_proxy'],
    no_proxy: env['no_proxy']
  };

  delete env['http_proxy'];
  delete env['https_proxy'];
  delete env['ftp_proxy'];
  delete env['all_proxy'];
  delete env['no_proxy'];

  if (!environment) return [env, picked];

  const proxy = isDef(environment)
    ? environment === 'inherit'
      ? picked
      : environment === 'ignore'
      ? {}
      : { ...environment, no_proxy: environment?.no_proxy?.join(',') }
    : picked;

  return [env, proxy];
}
