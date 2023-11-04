import mitt from 'mitt';
import { Aria2DownloadStatus, aria2, system } from 'maria2';

import type { Aria2Client } from './client';

import { Task, Torrent } from './torrent';
import { Aria2EventKeyPrefix } from './types';

interface Disposable<T = void> {
  dispose(): T;
}

type Aria2MonitorEvents = Record<`${Exclude<Aria2EventKeyPrefix, 'bt-complete'>}:${string}`, Task> &
  Record<`bt-complete:${string}`, Torrent>;

export class Aria2Monitor {
  private readonly client: Aria2Client;

  private readonly disposables: Set<Disposable<void>> = new Set();

  private readonly emitter = mitt<Aria2MonitorEvents & Record<`progress:${string}`, Task>>();

  private readonly map: Map<string, Task> = new Map();

  private readonly watchingIds: Map<string, number> = new Map();

  public constructor(client: Aria2Client) {
    this.client = client;
  }

  private get conn() {
    return this.client.conn;
  }

  public async start() {
    [
      aria2.when(this.conn, 'aria2.onDownloadStart', (ev) => {
        this.onDownloadStart(ev.gid);
      }),
      aria2.when(this.conn, 'aria2.onDownloadPause', (ev) => {
        this.onDownloadPause(ev.gid);
      }),
      aria2.when(this.conn, 'aria2.onDownloadStop', (ev) => {
        this.onDownloadStop(ev.gid);
      }),
      aria2.when(this.conn, 'aria2.onDownloadComplete', (ev) => {
        this.onDownloadComplete(ev.gid);
      }),
      aria2.when(this.conn, 'aria2.onBtDownloadComplete', (ev) => {
        this.onBtDownloadComplete(ev.gid);
      }),
      aria2.when(this.conn, 'aria2.onDownloadError', (ev) => {
        this.onDownloadError(ev.gid);
      })
    ].forEach((dis) => this.disposables.add(dis));

    const timeout = setInterval(async () => {
      await this.onDownloadProgress();
    }, this.client.options.progressInterval);
    this.disposables.add({
      dispose() {
        clearInterval(timeout);
      }
    });
  }

  public close() {
    [...this.disposables].reverse().forEach((dis) => dis.dispose());
    this.disposables.clear();
    this.emitter.all.clear();
  }

  private async updateStatus(status: Aria2DownloadStatus) {
    const freshTask = !this.map.has(status.gid);
    const task = await this.getTask(status.gid);
    if (!freshTask) {
      Reflect.set(task, '_status', status);
      Reflect.set(task, '_timestamp', new Date());
    }
    return task;
  }

  public async listActive() {
    const result = await aria2.tellActive(this.conn);
    return await Promise.all(result.map((status) => this.updateStatus(status)));
  }

  public async listWaiting() {
    // TODO: not hard code this
    const result = await aria2.tellWaiting(this.conn, 0, 1000);
    return await Promise.all(result.map((status) => this.updateStatus(status)));
  }

  public async listPaused() {
    // TODO: not hard code this
    const result = await aria2.tellWaiting(this.conn, 0, 1000);
    return await Promise.all(
      result.filter((s) => s.status === 'paused').map((status) => this.updateStatus(status))
    );
  }

  public async listStopped() {
    // TODO: not hard code this
    const result = await aria2.tellStopped(this.conn, 0, 1000);
    return await Promise.all(
      result.filter((s) => s.status === 'paused').map((status) => this.updateStatus(status))
    );
  }

  public async getTask(gid: string): Promise<Task> {
    if (this.map.has(gid)) {
      return this.map.get(gid)!;
    } else {
      const status = await aria2.tellStatus(this.conn, gid);
      // Concurrent
      if (this.map.has(gid)) {
        return this.map.get(gid)!;
      }

      const following = status.following ? await this.getTask(status.following) : undefined;
      const task = status.bittorrent
        ? new Torrent(this.client, gid, following as Torrent | undefined)
        : new Task(this.client, gid);

      this.map.set(gid, task);
      Reflect.set(task, '_status', status);
      Reflect.set(task, '_timestamp', new Date());

      return task;
    }
  }

  public async watchStatus<T extends Task = Task>(
    gid: string,
    fn?: (task: T) => void | Promise<void>,
    target: `complete` | `bt-complete` = `complete`
  ): Promise<Task> {
    const checkTerminate = (task: Task) => {
      if (task.status.errorCode !== null && task.status.errorCode !== undefined) {
        throw new Error(task.status.errorMessage ?? task.status.errorCode);
      }
      if (task.status.status === 'complete') {
        return task;
      }
      if (
        task.status.status === 'active' &&
        target === 'bt-complete' &&
        countBit(task.status.bitfield).toString() === task.status.numPieces
      ) {
        return task;
      }
    };

    const task = await this.getTask(gid);
    if (checkTerminate(task)) {
      return task;
    }

    return new Promise<Task>((res, rej) => {
      if (fn) {
        this.watchingIds.set(gid, (this.watchingIds.get(gid) ?? 0) + 1);
      }

      const disposables: Array<() => void> = [
        () => {
          if (!fn) return;
          const rc = this.watchingIds.get(gid);
          if (rc) {
            if (rc > 1) {
              this.watchingIds.set(gid, rc - 1);
            } else if (rc === 1) {
              this.watchingIds.delete(gid);
            }
          } else {
            // Is this OK?
            onError(new Error(`Internal Error`));
          }
        }
      ];
      const dispose = () => {
        disposables.forEach((d) => d());
      };

      const onError = (err: any) => {
        dispose();
        rej(err);
      };
      const onTarget = (task: Task | Torrent) => {
        dispose();
        res(task);
      };

      let count = 0;
      const onProgress = async (task: Task) => {
        try {
          // Double check whether this watching task is terminated
          if (count < 5) {
            count += 1;
            if (checkTerminate(task)) {
              onTarget(task);
              return;
            }
          }

          if (fn) {
            // @ts-ignore
            await fn(task);
          }
        } catch (err) {
          onError(err);
        }
      };

      this.emitter.on(`error:${gid}`, onError);
      this.emitter.on(`${target}:${gid}`, onTarget);
      fn && this.emitter.on(`progress:${gid}`, onProgress);

      disposables.push(() => this.emitter.off(`error:${gid}`, onError));
      disposables.push(() => this.emitter.off(`${target}:${gid}`, onTarget));
      fn && disposables.push(() => this.emitter.off(`progress:${gid}`, onProgress));
    });
  }

  // --- emitter ---
  public on<Key extends keyof Aria2MonitorEvents>(
    key: Key,
    handler: (param: Aria2MonitorEvents[Key]) => void | Promise<void>
  ) {
    this.emitter.on(key, handler);
  }

  public off<Key extends keyof Aria2MonitorEvents>(
    key: Key,
    handler?: (param: Aria2MonitorEvents[Key]) => void | Promise<void>
  ) {
    this.emitter.off(key, handler);
  }
  // ---------------

  // --- internal ---
  private async onDownloadProgress() {
    if (this.watchingIds.size === 0) return;

    try {
      const statuses = await system.multicall(
        this.conn,
        ...[...this.watchingIds.keys()].map(
          (id) =>
            ({
              methodName: 'aria2.tellStatus',
              params: [id] as [string]
            } as const)
        )
      );
      for (const [status] of statuses) {
        if (!status || !status.gid) continue;
        try {
          const gid = status.gid!;
          const freshTask = !this.map.has(gid);
          const task = await this.getTask(gid);
          if (!freshTask) {
            Reflect.set(task, '_status', status);
            Reflect.set(task, '_timestamp', new Date());
          }
          this.emitter.emit(`progress:${gid}`, task);
        } catch (error) {
          // TODO: store the errors
        }
      }
    } catch (error) {
      // TODO: Handle this
    }
  }

  private async onDownloadStart(gid: string) {
    this.emitter.emit(`start:${gid}`, await this.getTask(gid));
  }

  private async onDownloadPause(gid: string) {
    this.emitter.emit(`pause:${gid}`, await this.getTask(gid));
  }

  private async onDownloadStop(gid: string) {
    this.emitter.emit(`stop:${gid}`, await this.getTask(gid));
  }

  private async onDownloadComplete(gid: string) {
    this.emitter.emit(`complete:${gid}`, await this.getTask(gid));
  }

  private async onBtDownloadComplete(gid: string) {
    const task = (await this.getTask(gid)) as Torrent;
    this.emitter.emit(`bt-complete:${gid}`, task);
  }

  private async onDownloadError(gid: string) {
    this.emitter.emit(`error:${gid}`, await this.getTask(gid));
  }
}

function countBit(hex: string | undefined) {
  if (!hex) return 0;
  let sum = 0;
  const table: Record<string, number> = {
    '0': 0,
    '1': 1,
    '2': 1,
    '3': 2,
    '4': 1,
    '5': 2,
    '6': 2,
    '7': 3,
    '8': 1,
    '9': 2,
    a: 2,
    b: 3,
    c: 2,
    d: 3,
    e: 3,
    f: 4
  };
  for (const c of hex) {
    hex += table[c] ?? 0;
  }
  return sum;
}
