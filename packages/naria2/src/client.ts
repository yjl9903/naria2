import { type Socket, type Conn, open, OpenOptions } from 'maria2';

export class Aria2Client {
  readonly _conn: Conn;

  constructor(conn: Conn) {
    this._conn = conn;
  }

  get conn(): Conn {
    return this._conn;
  }

  get socket(): Socket {
    return this._conn.getSocket();
  }

  async close() {
    await this.socket.close();
  }
}

export async function createClient(_socket: Socket | Promise<Socket>, options: OpenOptions = {}) {
  const socket = await _socket;
  // Hack: get secret from the socket
  // @ts-ignore
  const secret = options?.secret ?? socket?.options?.rpcSecret;
  const conn = await open(socket, { secret });
  return new Aria2Client(conn);
}
