import { type Aria2DownloadBitTorrentStatus, aria2 } from 'maria2';

import type { Aria2Client } from './client';
import type { Aria2EventKeyPrefix, DownloadBitTorrentStatus } from './types';

import { sleep } from './utils';

type Aria2TorrentEvents = Record<Aria2EventKeyPrefix, Task>;

export class Task {
  protected readonly client: Aria2Client;

  public readonly gid: string;

  public readonly following: Task | undefined;

  public readonly followedBy: Task[] = [];

  private _bittorrent: DownloadBitTorrentStatus | undefined;

  private _timestamp: Date | undefined;

  private _status!: Awaited<ReturnType<(typeof aria2)['tellStatus']>>;

  public constructor(client: Aria2Client, gid: string, following?: Task) {
    this.client = client;
    this.gid = gid;
    this.following = following;
    if (following) {
      following.followedBy.push(this);
      this.client.monitor.on(`complete:${this.gid}`, async () => {
        await following.updateStatus();
      });
    } else {
      this.client.monitor.on(`complete:${this.gid}`, async () => {
        await this.updateStatus();
      });
    }
  }

  private get conn() {
    return this.client.conn;
  }

  public get status() {
    // Cache 500ms
    if (this._timestamp && new Date().getTime() - this._timestamp.getTime() < 500) {
      return this._status;
    }
    this.updateStatus().catch(() => {});
    return this._status;
  }

  public async updateStatus() {
    const status = await aria2.tellStatus(this.conn, this.gid);
    this._status = status;
    this._timestamp = new Date();

    // Generate followed by tasks
    if (Array.isArray(status.followedBy) && status.followedBy.length > 0) {
      if (this.isMetadata && this.followedBy.length === 0) {
        const childs = [];
        for (const gid of status.followedBy) {
          const child = await this.client.monitor.getTask(gid);
          childs.push(child);
        }
        this.followedBy.splice(0, this.followedBy.length, ...childs);
      }
    }

    this._bittorrent = status.bittorrent
      ? {
          announceList: status.bittorrent.announceList,
          comment:
            typeof status.bittorrent.comment === 'string'
              ? status.bittorrent.comment
              : status.bittorrent.comment?.['utf-8'],
          creationDate: new Date(status.bittorrent.creationDate),
          mode: status.bittorrent.mode,
          info: {
            name:
              typeof status.bittorrent.info?.name === 'string'
                ? status.bittorrent.info.name
                : status.bittorrent.info?.name?.['utf-8']
          }
        }
      : undefined;

    return this._status;
  }

  // --- Information ---

  public get state() {
    return this.status.status;
  }

  public get files() {
    return this.status.files;
  }

  /**
   * Progress percent, max: 100
   */
  public get progress() {
    if (this.isMetadata) {
      return 0;
    } else if (this.status.totalLength === '0') {
      return 0;
    } else {
      const status =
        (10000n * BigInt(this.status.completedLength)) / BigInt(this.status.totalLength);
      return +(+status.toString() / 100.0).toFixed(2);
    }
  }

  /**
   * Download speed measured in bytes/sec
   */
  public get downloadSpeed() {
    return this.status.downloadSpeed;
  }

  /**
   * Check this task is metadata
   */
  public get isMetadata() {
    return (
      this.status.files.length === 1 &&
      !!this.status.files.find((f) => f.path.startsWith('[METADATA]'))
    );
  }

  /**
   * Get bittorrent information
   */
  public get bittorrent(): DownloadBitTorrentStatus | undefined {
    return this._bittorrent;
  }

  // --- Control ---

  public async pause(force = false) {
    try {
      // TODO: check pause ok
      if (!force) {
        await aria2.pause(this.conn, this.gid);
      } else {
        await aria2.forcePause(this.conn, this.gid);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  public async unpause() {
    try {
      await aria2.unpause(this.conn, this.gid);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async remove(force = false) {
    try {
      if (!force) {
        await aria2.remove(this.conn, this.gid);
      } else {
        await aria2.forceRemove(this.conn, this.gid);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // TODO: transform info
  //   public get name() {
  //     const name = this.status?.bittorrent?.info?.name;
  //     return (typeof name === 'string' ? name : name?.['utf-8']) ?? '[METADATA]';
  //   }

  // --- Event emitter ---

  public on<Key extends keyof Aria2TorrentEvents>(
    key: Key,
    handler: (param: Aria2TorrentEvents[Key]) => void | Promise<void>
  ) {
    this.client.monitor.on(`${key}:${this.gid}`, handler);
  }

  public off<Key extends keyof Aria2TorrentEvents>(
    key: Key,
    handler?: (param: Aria2TorrentEvents[Key]) => void | Promise<void>
  ) {
    this.client.monitor.off(`${key}:${this.gid}`, handler);
  }

  /**
   * Watch task download state until complete or bt-complete
   *
   * @param handler Download file progress callback
   * @param target  Watch state until target event is fired
   * @returns       Watch state until target event is fired
   */
  public async watch(
    handler: (task: Task) => void | Promise<void>,
    target: `complete` | `bt-complete` = `complete`
  ) {
    return await this.client.monitor.watchStatus(this.gid, handler, target);
  }

  /**
   * Watch torrent download state until complete or bt-complete
   *
   * @param onMetadata   Download [METADATA] progress callback
   * @param onFollowedBy Download torrent file itself progress callback
   * @param target       Watch state until target event is fired
   * @returns
   */
  public async watchTorrent(
    onMetadata: ((task: Task) => void | Promise<void>) | null | undefined,
    onFollowedBy: (task: Task) => void | Promise<void>,
    target: `complete` | `bt-complete` = `complete`
  ) {
    await this.updateStatus();

    if (this.isMetadata) {
      await this.client.monitor.watchStatus(this.gid, onMetadata, 'complete');

      while (this.followedBy.length === 0) {
        await this.updateStatus();
        await sleep(500);
      }

      const followedBy = this.followedBy[0];
      const task = await this.client.monitor.watchStatus(followedBy.gid, onFollowedBy, target);
      return task;
    } else {
      return await this.watch(onFollowedBy, target);
    }
  }

  public async complete(): Promise<Task> {
    return this.waitForCompletion('complete');
  }

  public async btComplete(): Promise<Task> {
    return this.waitForCompletion('bt-complete');
  }

  /**
   * Wait for the full torrent download completion
   *
   * If this is a metadata torrent (used for downloading metadata), it has two steps:
   *
   * 1. Downloading the metadata
   * 2. Downloading the actual data
   *
   * If this is a actual data torrent, it will just wait for the download compeltion
   *
   * @param target
   *
   * @returns
   */
  public async waitForCompletion(target: `complete` | `bt-complete` = `complete`): Promise<Task> {
    await this.updateStatus();
    if (!this.isMetadata) {
      const task = await this.client.monitor.watchStatus(this.gid, undefined, 'complete');
      return task;
    } else {
      return await this.watchTorrent(undefined, () => {}, target);
    }
  }
}
