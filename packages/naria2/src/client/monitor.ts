import type { Conn } from 'maria2';

export class Aria2Monitor {
  private _conn: Conn | undefined;

  constructor(conn: Conn) {
    this._conn = conn;
  }

  public async start() {}

  public close() {}

  public watchStatus(gid: string) {}
}
