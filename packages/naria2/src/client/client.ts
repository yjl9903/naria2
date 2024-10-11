import type { PartialDeep } from 'type-fest';

import {
  type Conn,
  type Socket,
  type Aria2ServerVersion,
  type Aria2ServerGlobalStat,
  close,
  aria2
} from 'maria2';

import { type Aria2InputOptions, resolveInputOptions } from '@naria2/options';

import { Naria2Error } from '../error';

import type { MaybePromise } from './utils';
import type { ClientOptions, DownloadOptions } from './types';

import { sleep } from './utils';
import { Aria2Monitor } from './monitor';

export class Aria2Client {
  private _conn: Conn | undefined;

  private _monitor: Aria2Monitor | undefined;

  private _options: Required<Omit<ClientOptions, 'secret' | 'timeout' | 'openTimeout'>>;

  public constructor(conn: Conn, options: ClientOptions = {}) {
    this._conn = conn;
    this._monitor = new Aria2Monitor(this);

    this._options = { progressInterval: 1000, ...options };
    Reflect.deleteProperty(this._options, 'secret');
    Reflect.deleteProperty(this._options, 'timeout');
    Reflect.deleteProperty(this._options, 'openTimeout');
  }

  public get conn(): Conn {
    if (!this._conn) {
      throw new Error('Connection has been closed');
    }
    return this._conn;
  }

  public get options() {
    return this._options;
  }

  public get socket(): Socket {
    return this.conn.getSocket();
  }

  public get monitor(): Aria2Monitor {
    if (!this._monitor) {
      throw new Error('Connection has been closed');
    }
    return this._monitor;
  }

  public close() {
    close(this.conn);
    this._monitor?.close();
    this._conn = undefined;
    this._monitor = undefined;
  }

  /**
   * This method shuts down aria2.
   *
   * @param force Call forceShutdown or shutdown
   */
  public async shutdown(force = false) {
    const shudown = force
      ? aria2.forceShutdown(this.conn).catch(() => undefined)
      : aria2.shutdown(this.conn).catch(() => undefined);

    const resp = await shudown;
    if (resp !== 'OK') {
      // Force shutdown when failed
      for (let i = 1; i <= 5; i++) {
        await sleep(i * 100);
        try {
          const resp = await aria2.forceShutdown(this.conn).catch(() => undefined);
          if (resp === 'OK') {
            break;
          }
        } catch {}
      }
    }

    this.close();
  }

  public async downloadTorrent(
    torrent: MaybePromise<string>,
    options: PartialDeep<Aria2InputOptions> & DownloadOptions = {}
  ) {
    const uris = options.uris ?? [];
    const position = options.position ? [options.position] : [];
    delete options.uris;
    delete options.position;

    const inputOptions = resolveInputOptions(options);
    const gid = await aria2
      .addTorrent(this.conn, await torrent, uris, { ...inputOptions }, ...position)
      .catch((error) => {
        return { error: new Naria2Error(error?.message, error) };
      });
    if (typeof gid !== 'string') throw gid.error;

    return await this.monitor.getTask(gid);
  }

  public async downloadUri(
    uri: MaybePromise<string | string[]>,
    options: PartialDeep<Aria2InputOptions> & DownloadOptions = {}
  ) {
    const _uri = await uri;
    const uris = Array.isArray(_uri) ? _uri : [_uri];
    const inputOptions = resolveInputOptions(options);
    const position = options.position ? [options.position] : [];
    const gid = await aria2
      .addUri(this.conn, uris, { ...inputOptions }, ...position)
      .catch((error) => {
        return { error: new Naria2Error(error?.message, error) };
      });
    if (typeof gid !== 'string') throw gid.error;

    return await this.monitor.getTask(gid);
  }

  // --- Status ---

  /**
   * This method returns the version of aria2 and the list of enabled features.
   * The response is a struct and contains following keys.
   */
  public async getVersion(): Promise<Aria2ServerVersion> {
    try {
      return await aria2.getVersion(this.conn);
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }

  /**
   * This method returns global statistics such as the overall download and upload speeds.
   * The response is a struct and contains the following keys. Values are strings.
   */
  public async getGlobalStat(): Promise<Aria2ServerGlobalStat> {
    try {
      return await aria2.getGlobalStat(this.conn);
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }

  // --- List ---

  public async listActive() {
    try {
      return this.monitor.listActive();
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }

  public async listWaiting() {
    try {
      return this.monitor.listWaiting();
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }

  public async listPaused() {
    try {
      return this.monitor.listPaused();
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }

  public async listStopped() {
    try {
      return this.monitor.listStopped();
    } catch (error: any) {
      throw new Naria2Error(error?.message, error);
    }
  }
}
