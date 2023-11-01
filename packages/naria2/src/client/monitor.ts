import { aria2, type Conn } from 'maria2';

interface Disposable<T = void> {
  dispose(): T;
}

export class Aria2Monitor {
  private _conn: Conn;

  private disposables: Set<Disposable<void>> = new Set();

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

  public watchStatus(gid: string) {}

  // --- internal ---
  private async onDownloadStart(gid: string) {}

  private async onDownloadPause(gid: string) {}

  private async onDownloadStop(gid: string) {}

  private async onDownloadComplete(gid: string) {}

  private async onBtDownloadComplete(gid: string) {}

  private async onDownloadError(gid: string) {}
}
