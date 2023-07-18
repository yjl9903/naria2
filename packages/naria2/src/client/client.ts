import type { PartialDeep } from 'type-fest';
import { type Socket, type Conn, open, close, aria2, Aria2ServerVersion } from 'maria2';

import type { Aria2InputOptions } from '@naria2/options';

import type { ClientOptions } from './types';

export class Aria2Client {
  private _conn: Conn | undefined;

  constructor(conn: Conn) {
    this._conn = conn;
  }

  get conn(): Conn {
    if (!this._conn) {
      throw new Error('Connection has been closed');
    }
    return this._conn;
  }

  get socket(): Socket {
    return this.conn.getSocket();
  }

  async close() {
    close(this.conn);
    this._conn = undefined;
  }

  async version(): Promise<Aria2ServerVersion> {
    return await aria2.getVersion(this.conn);
  }

  async downloadMagnet(magnet: string, options: PartialDeep<Aria2InputOptions> = {}) {}

  async downloadTorrent(torrent: string, options: PartialDeep<Aria2InputOptions> = {}) {}

  async downloadUri(uris: string | string[], options: PartialDeep<Aria2InputOptions> = {}) {
    await aria2.addUri(this.conn, Array.isArray(uris) ? uris : [uris], {});
  }
}

export async function createClient(_socket: Socket | Promise<Socket>, options: ClientOptions = {}) {
  const socket = await _socket;
  const conn = await open(socket, {
    secret: options.secret,
    timeout: options.timeout,
    openTimeout: options.openTimeout
  });

  return new Aria2Client(conn);
}
