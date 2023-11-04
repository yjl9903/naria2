import { aria2 } from 'maria2';

import type { Aria2Client } from './client';
import type { Aria2EventKeyPrefix } from './types';
import { sleep } from './utils';

type Aria2TaskEvents = Record<Exclude<Aria2EventKeyPrefix, 'bt-complete'>, Task>;

type Aria2TorrentEvents = Record<Aria2EventKeyPrefix, Torrent>;

export class Task {
  protected readonly client: Aria2Client;

  public readonly gid: string;

  private _timestamp: Date | undefined;

  private _status!: Awaited<ReturnType<(typeof aria2)['tellStatus']>>;

  public constructor(client: Aria2Client, gid: string) {
    this.client = client;
    this.gid = gid;
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
    // Cache 500ms
    this._status = await aria2.tellStatus(this.conn, this.gid);
    this._timestamp = new Date();
    return this._status;
  }

  // ---
  public get state() {
    return this.status.status;
  }

  public get files() {
    return this.status.files;
  }

  /**
   * Progress percent
   */
  public get progress() {
    if (this.status.totalLength === '0') {
      return 0;
    } else {
      const status =
        (10000n * BigInt(this.status.completedLength)) / BigInt(this.status.totalLength);
      return +(+status.toString() / 100.0).toFixed(2);
    }
  }

  // --- Control ---
  public async pause(force = false) {
    if (!force) {
      await aria2.pause(this.conn, this.gid);
    } else {
      await aria2.forcePause(this.conn, this.gid);
    }
  }

  public async unpause() {
    await aria2.unpause(this.conn, this.gid);
  }

  public async remove(force = false) {
    if (!force) {
      await aria2.remove(this.conn, this.gid);
    } else {
      await aria2.forceRemove(this.conn, this.gid);
    }
  }

  // --- Event emitter ---
  public on<Key extends keyof Aria2TaskEvents>(
    key: Key,
    handler: (param: Aria2TaskEvents[Key]) => void | Promise<void>
  ) {
    this.client.monitor.on(`${key}:${this.gid}`, handler);
  }

  public off<Key extends keyof Aria2TaskEvents>(
    key: Key,
    handler?: (param: Aria2TaskEvents[Key]) => void | Promise<void>
  ) {
    this.client.monitor.off(`${key}:${this.gid}`, handler);
  }

  public async waitComplete(): Promise<Task> {
    if (this.state === 'complete') {
      return this;
    } else {
      return new Promise((res, rej) => {
        this.on('complete', (task: Task) => res(task));
        this.on('error', (err: any) => rej(err));
      });
    }
  }
}

export class Torrent extends Task {
  private _following: Torrent | undefined;

  private readonly _followedBy: Torrent[] = [];

  public constructor(client: Aria2Client, gid: string, following?: Torrent) {
    super(client, gid);

    if (following) {
      this._following = following;
    } else {
      this.client.monitor.on(`complete:${this.gid}`, async () => {
        await this.updateStatus();
        await this.setFollowedBy();
      });
    }
  }

  public get name() {
    const name = this.status?.bittorrent?.info?.name;
    return (typeof name === 'string' ? name : name?.['utf-8']) ?? '[METADATA]';
  }

  public get progress() {
    if (this.isMetadata) {
      return 0;
    } else {
      return super.progress;
    }
  }

  public get followedBy(): Torrent | undefined {
    return this._followedBy.length > 0 ? this._followedBy[0] : undefined;
  }

  private async setFollowedBy() {
    if (this.status.followedBy) {
      const followedBy: Torrent[] = [];
      for (const gid of this.status.followedBy) {
        const child = await this.client.monitor.getTask(gid);
        if (child instanceof Torrent) {
          followedBy.push(child);
        }
      }
      if (followedBy.length === 1) {
        this._followedBy.splice(0, this._followedBy.length, ...followedBy);
      } else if (followedBy.length > 1) {
        // Something went wrong?
      }
    }
  }

  public get following(): Torrent | undefined {
    return this._following;
  }

  public get isMetadata() {
    return this._following === undefined;
  }

  public get bittorrent() {
    return this.status.bittorrent;
  }

  // --- Event emitter ---
  public on<Key extends keyof Aria2TorrentEvents>(
    key: Key,
    handler: (param: Aria2TorrentEvents[Key]) => void | Promise<void>
  ) {
    // @ts-expect-error
    this.client.monitor.on(`${key}:${this.gid}`, handler);
  }

  public off<Key extends keyof Aria2TorrentEvents>(
    key: Key,
    handler?: (param: Aria2TorrentEvents[Key]) => void | Promise<void>
  ) {
    // @ts-expect-error
    this.client.monitor.off(`${key}:${this.gid}`, handler);
  }

  public async waitComplete(): Promise<Torrent> {
    if (this.following) {
      const following = this.following;
      if (this.state === 'complete') {
        return this;
      } else {
        return new Promise((res, rej) => {
          this.on('complete', () => res(following));
          this.on('error', (err: any) => rej(err));
        });
      }
    } else {
      if (this.followedBy) {
        return this.followedBy.waitComplete();
      } else {
        return new Promise((res, rej) => {
          this.client.monitor.on(`complete:${this.gid}`, async () => {
            if (!this.followedBy) {
              await this.updateStatus();
              await this.setFollowedBy();
            }
            if (!this.followedBy) {
              await sleep(1000);
              await this.updateStatus();
              await this.setFollowedBy();
            }

            if (!this.followedBy) {
              rej(new Error(`Can not find followed download task`));
            } else {
              try {
                res(await this.followedBy.waitComplete());
              } catch (err: any) {
                rej(err);
              }
            }
          });

          this.client.monitor.on(`error:${this.gid}`, (err: any) => {
            rej(err);
          });
        });
      }
    }
  }
}
