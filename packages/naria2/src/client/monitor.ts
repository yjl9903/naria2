import { aria2, type Conn } from 'maria2';
import mitt, { Handler, type Emitter, WildcardHandler } from 'mitt';

import { Task, Torrent } from './torrent';

interface Disposable<T = void> {
  dispose(): T;
}

type Aria2MonitorEvents = Record<
  | `start:${string}`
  | `pause:${string}`
  | `stop:${string}`
  | `complete:${string}`
  | `error:${string}`,
  Task
> &
  Record<`bt-complete:${string}`, Torrent>;

type GenericEventHandler =
  | Handler<Aria2MonitorEvents[keyof Aria2MonitorEvents]>
  | WildcardHandler<Aria2MonitorEvents>;

export class Aria2Monitor implements Pick<Emitter<Aria2MonitorEvents>, 'on' | 'off'> {
  private conn: Conn;

  private disposables: Set<Disposable<void>> = new Set();

  private emitter = mitt<Aria2MonitorEvents>();

  private map: Map<string, Task> = new Map();

  public constructor(conn: Conn) {
    this.conn = conn;
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
  }

  public close() {
    this.disposables.forEach((dis) => dis.dispose());
  }

  public async listActive() {
    const result = await aria2.tellActive(this.conn);
    return await Promise.all(
      result.map(async (status) => {
        const freshTask = !this.map.has(status.gid);
        const task = await this.getTask(status.gid);
        if (!freshTask) {
          Reflect.set(task, '_status', status);
          Reflect.set(task, '_timestamp', new Date());
        }
        return task;
      })
    );
  }

  public async getTask(gid: string) {
    if (this.map.has(gid)) {
      return this.map.get(gid)!;
    } else {
      const status = await aria2.tellStatus(this.conn, gid);
      const task = status.bittorrent ? new Torrent(this.conn, gid) : new Task(this.conn, gid);
      this.map.set(gid, task);
      Reflect.set(task, '_status', status);
      Reflect.set(task, '_timestamp', new Date());
      return task;
    }
  }

  public async watchStatus(gid: string): Promise<Task> {
    const task = await this.getTask(gid);
    return task;
  }

  // --- emitter ---
  public on<Key extends keyof Aria2MonitorEvents>(key: Key, handler: GenericEventHandler) {
    // @ts-expect-error
    this.emitter.on(key, handler);
  }

  public off<Key extends keyof Aria2MonitorEvents>(key: Key, handler?: GenericEventHandler) {
    // @ts-expect-error
    this.emitter.off(key, handler);
  }
  // ---------------

  // --- internal ---
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
    this.emitter.emit(`bt-complete:${gid}`, await this.getTask(gid));
  }
  private async onDownloadError(gid: string) {
    this.emitter.emit(`error:${gid}`, await this.getTask(gid));
  }
}
