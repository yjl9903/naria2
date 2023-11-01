import { aria2, type Conn } from 'maria2';
import mitt, { Handler, type Emitter, WildcardHandler } from 'mitt';

interface Disposable<T = void> {
  dispose(): T;
}

type Aria2MonitorEvents = {
  'download.start': string;
  'download.pause': string;
  'download.stop': string;
  'download.complete': string;
  'bt.download.complete': string;
  'download.error': string;
};

type GenericEventHandler =
  | Handler<Aria2MonitorEvents[keyof Aria2MonitorEvents]>
  | WildcardHandler<Aria2MonitorEvents>;

export class Aria2Monitor implements Pick<Emitter<Aria2MonitorEvents>, 'on' | 'off'> {
  private _conn: Conn;

  private disposables: Set<Disposable<void>> = new Set();

  private emitter = mitt<Aria2MonitorEvents>();

  public constructor(conn: Conn) {
    this._conn = conn;
  }

  public async start() {
    [
      aria2.when(this._conn, 'aria2.onDownloadStart', (ev) => {
        this.onDownloadStart(ev.gid);
      }),
      aria2.when(this._conn, 'aria2.onDownloadPause', (ev) => {
        this.onDownloadPause(ev.gid);
      }),
      aria2.when(this._conn, 'aria2.onDownloadStop', (ev) => {
        this.onDownloadStop(ev.gid);
      }),
      aria2.when(this._conn, 'aria2.onDownloadComplete', (ev) => {
        this.onDownloadComplete(ev.gid);
      }),
      aria2.when(this._conn, 'aria2.onBtDownloadComplete', (ev) => {
        this.onBtDownloadComplete(ev.gid);
      }),
      aria2.when(this._conn, 'aria2.onDownloadError', (ev) => {
        this.onDownloadError(ev.gid);
      })
    ].forEach((dis) => this.disposables.add(dis));
  }

  public close() {
    this.disposables.forEach((dis) => dis.dispose());
  }

  public watchStatus(gid: string): Promise<void> {
    return new Promise((res, rej) => {});
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
  private async onDownloadStart(gid: string) {}

  private async onDownloadPause(gid: string) {}

  private async onDownloadStop(gid: string) {}

  private async onDownloadComplete(gid: string) {}

  private async onBtDownloadComplete(gid: string) {}

  private async onDownloadError(gid: string) {}
}
