import { aria2, Conn } from 'maria2';

export class Task {
  private readonly conn: Conn;

  public readonly gid: string;

  private _timestamp: Date | undefined;

  private _status!: Awaited<ReturnType<(typeof aria2)['tellStatus']>>;

  public constructor(conn: Conn, gid: string) {
    this.conn = conn;
    this.gid = gid;
  }

  public get status() {
    // Cache 500ms
    if (this._timestamp && new Date().getTime() - this._timestamp.getTime() < 500) {
      return this._status;
    }
    this.updateStatus();
    return this._status;
  }

  public async updateStatus() {
    // Cache 500ms
    this._status = await aria2.tellStatus(this.conn, this.gid);
    this._timestamp = new Date();
    return this._status;
  }

  public get progress() {
    if (this.status.totalLength === '0') {
      return 0;
    } else {
      const status =
        (10000n * BigInt(this.status.completedLength)) / BigInt(this.status.totalLength);
      return +(+status.toString() / 100.0).toFixed(2);
    }
  }
}

export class Torrent extends Task {
  public constructor(client: Conn, gid: string) {
    super(client, gid);
  }
}
