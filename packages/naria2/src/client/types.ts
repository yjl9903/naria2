import type { Aria2DownloadBitTorrentMode } from 'maria2';

export type Aria2EventKeyPrefix = `start` | `pause` | `stop` | `complete` | `bt-complete` | `error`;

export interface ClientOptions {
  secret?: string;

  /**
   * Timeout for each request (ms).
   * @default 5000
   * @public
   */
  timeout?: number;

  /**
   * Timeout for waiting socket (ms).
   * @default 5000
   * @public
   */
  openTimeout?: number;

  /**
   * Time interval for polling download status (ms).
   *
   * @default 1000
   */
  progressInterval?: number;
}

export interface DownloadOptions {
  position?: number;
}

export interface TorrentFile {}

export interface TorrentPiece {
  readonly length: number;

  readonly missing: number;
}

export interface DownloadBitTorrentStatus {
  announceList: string[];

  comment: string | undefined;

  creationDate: Date;

  mode: Aria2DownloadBitTorrentMode;

  info: {
    name: string | undefined;
  };
}
