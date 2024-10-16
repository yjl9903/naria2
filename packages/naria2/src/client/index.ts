import { type Socket, type PreconfiguredSocket, open } from 'maria2';

import type { MaybePromise } from './utils';
import type { ClientOptions } from './types';

import { Aria2Client } from './client';

export * from './client';

export * from './torrent';

export * from './types';

export async function createClient(
  _socket: MaybePromise<Socket | PreconfiguredSocket>,
  options: ClientOptions = {}
) {
  const socket = await _socket;
  const conn = await open(socket, {
    ...options,
    onServerError() {}
  });

  const client = new Aria2Client(conn);
  await client.monitor.start();

  return client;
}
