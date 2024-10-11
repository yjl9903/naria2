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
  /**
   *  uris is an array of URIs (string). uris is used for Web-seeding. For single file torrents, the URI can be a complete URI pointing to the resource; if URI ends with /, name in torrent file is added. For multi-file torrents, name and path in torrent are added to form a URI for each file. options is a struct and its members are pairs of option name and value.
   */
  uris?: string[];

  /**
   * If position is given, it must be an integer starting from 0. The new download will be inserted at position in the waiting queue. If position is omitted or position is larger than the current size of the queue, the new download is appended to the end of the queue.
   */
  position?: number;
}

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
