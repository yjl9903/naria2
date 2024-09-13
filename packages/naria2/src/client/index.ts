import { type Socket, type PreconfiguredSocket, open } from 'maria2';

import type { ClientOptions } from './types';

import { Aria2Client } from './client';

export * from './client';

export * from './torrent';

export * from './types';

type MaybePromise<T> = T | Promise<T>;

export async function createClient(
  _socket: MaybePromise<Socket | PreconfiguredSocket>,
  _options: ClientOptions = {}
) {
  const socket = await _socket;
  // Use preconfigured options
  const options = {
    ...('getOptions' in socket ? socket.getOptions() : {}),
    ..._options
  };

  const conn = await open(socket, {
    secret: options.secret,
    timeout: options.timeout ?? 5000,
    openTimeout: options.openTimeout ?? 5000
  });

  const client = new Aria2Client(conn);
  await client.monitor.start();

  return client;
}
