import { MergeDeep } from 'type-fest';

export type StrSize = `${number}${'' | 'K' | 'M'}`;

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#basic-options
 */
export interface Aria2BasicInputOptions {
  /**
   * -d, --dir=<DIR>
   *
   * The directory to store the downloaded file.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-d
   */
  dir: string;

  /**
   * -V, --check-integrity [true|false]
   *
   * Check file integrity by validating piece hashes or a hash of entire file. This option has effect only in BitTorrent, Metalink downloads with checksums or HTTP(S)/FTP downloads with [--checksum](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-checksum) option. If piece hashes are provided, this option can detect damaged portions of a file and re-download them. If a hash of entire file is provided, hash check is only done when file has been already download. This is determined by file length. If hash check fails, file is re-downloaded from scratch. If both piece hashes and a hash of entire file are provided, only piece hashes are used.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-V
   */
  checkIntegrity: boolean;

  /**
   * -c, --continue
   *
   * Continue downloading a partially downloaded file. Use this option to resume a download started by a web browser or another program which downloads files sequentially from the beginning. Currently this option is only applicable to HTTP(S)/FTP downloads.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-c
   */
  continue: boolean;
}

export interface Aria2BasicGlobalOptions {
  /**
   * The file name of the log file. If - is specified, log is written to `stdout`. If empty string("") is specified, or this option is omitted, no log is written to disk at all.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-l
   */
  log: string | undefined;

  /**
   * Set the maximum number of parallel downloads for every queue item. See also the [--split](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-s) option.
   *
   * @default 5
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-j
   */
  maxConcurrentDownloads: number;
}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#http-ftp-sftp-options
 */
export interface Aria2HTTPFTPOptions {
  /**
   * If true is given, aria2 just checks whether the remote file is available and doesn't download data. This option has effect on HTTP/FTP download. BitTorrent downloads are canceled if true is specified.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dry-run
   */
  dryRun: boolean;
}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#http-specific-options
 */
export interface Aria2HTTPOptions {}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#ftp-sftp-specific-options
 */
export interface Aria2FTPOptions {}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#bittorrent-metalink-options
 */
export interface Aria2BtMetalinkOptions {}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#bittorrent-specific-options
 */
export interface Aria2BtInputOptions {
  /**
   * Enable Local Peer Discovery. If a private flag is set in a torrent, aria2 doesn't use this feature for that download even if `true` is given.
   *
   * @default false
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-enable-lpd
   */
  enableLpd: boolean;

  /**
   * Comma separated list of BitTorrent tracker's announce URI to remove. You can use special value `*` which matches all URIs, thus removes all announce URIs. When specifying `*` in shell command-line, don't forget to escape or quote it. See also `--bt-tracker` option.
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-exclude-tracker
   */
  excludeTracker: string[];

  /**
   * Specify the external IP address to use in BitTorrent download and DHT. It may be sent to BitTorrent tracker. For DHT, this option should be set to report that local node is downloading a particular torrent. This is critical to use DHT in a private network. Although this function is named `external`, it can accept any kind of IP addresses.
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-external-ip
   */
  externalIp: string;

  /**
   * Requires BitTorrent message payload encryption with arc4. This is a shorthand of `--bt-require-crypto` `--bt-min-crypto-level=arc4`. This option does not change the option value of those options. If `true` is given, deny legacy BitTorrent handshake and only use Obfuscation handshake and always encrypt message payload.
   *
   * @default false
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-force-encryption
   */
  forceEncryption: boolean;

  /**
   * If `true` is given, after hash check using [--check-integrity](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-V) option and file is complete, continue to seed file. If you want to check file and download it only when it is damaged or incomplete, set this option to `false`. This option has effect only on BitTorrent download.
   *
   * @default true
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-hash-check-seed
   */
  hashCheckSeed: boolean;

  /**
   * Before getting torrent metadata from DHT when downloading with magnet link, first try to read file saved by [--bt-save-metadata](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-save-metadata) option. If it is successful, then skip downloading metadata from DHT.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-load-saved-metadata
   */
  loadSavedMetadata: boolean;

  /**
   * Specify the maximum number of peers per torrent. `0` means unlimited. See also [--bt-request-peer-speed-limit](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-request-peer-speed-limit) option.
   *
   * @default 55
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-max-peers
   */
  maxPeers: number;

  /**
   * Download meta data only. The file(s) described in meta data will not be downloaded. This option has effect only when BitTorrent Magnet URI is used. See also [--bt-save-metadata](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-save-metadata) option.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-metadata-only
   */
  metadataOnly: boolean;

  /**
   * Set minimum level of encryption method. If several encryption methods are provided by a peer, aria2 chooses the lowest one which satisfies the given level.
   *
   * @default 'plain'
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-min-crypto-level
   */
  minCryptoLevel: 'plain' | 'arc4';

  /**
   * --bt-prioritize-piece=head[=<SIZE>],tail[=<SIZE>]
   *
   * Try to download first and last pieces of each file first. This is useful for previewing files. The argument can contain 2 keywords: `head` and `tail`. To include both keywords, they must be separated by comma. These keywords can take one parameter, SIZE. For example, if `head=<SIZE>` is specified, pieces in the range of first SIZE bytes of each file get higher priority. `tail=<SIZE>` means the range of last SIZE bytes of each file. SIZE can include `K` or `M` (1K = 1024, 1M = 1024K). If SIZE is omitted, SIZE=1M is used.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-prioritize-piece
   */
  prioritizePiece: {
    head: '' | StrSize;
    tail: '' | StrSize;
  };

  /**
   * Removes the unselected files when download is completed in BitTorrent. To select files, use [--select-file](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-select-file) option. If it is not used, all files are assumed to be selected. Please use this option with care because it will actually remove files from your disk.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-remove-unselected-file
   */
  removeUnselectedFile: boolean;

  /**
   * If `true` is given, aria2 doesn't accept and establish connection with legacy BitTorrent handshake(\19BitTorrent protocol). Thus aria2 always uses Obfuscation handshake.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-require-crypto
   */
  requireCrypto: boolean;

  /**
   * If the whole download speed of every torrent is lower than SPEED, aria2 temporarily increases the number of peers to try for more download speed. Configuring this option with your preferred download speed can increase your download speed in some cases. You can append `K` or `M` (1K = 1024, 1M = 1024K).
   *
   * @default '50K'
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-request-peer-speed-limit
   */
  requestPeerSpeedLimit: StrSize;

  /**
   * Save meta data as ".torrent" file. This option has effect only when BitTorrent Magnet URI is used. The file name is hex encoded info hash with suffix ".torrent". The directory to be saved is the same directory where download file is saved. If the same file already exists, meta data is not saved. See also [--bt-metadata-only](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-metadata-only) option.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-save-metadata
   */
  saveMetadata: boolean;

  /**
   * Seed previously downloaded files without verifying piece hashes.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-seed-unverified
   */
  seedUnverified: boolean;

  /**
   * Stop BitTorrent download if download speed is 0 in consecutive SEC seconds. If `0` is given, this feature is disabled.
   *
   * @default 0
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-stop-timeout
   */
  stopTimeout: number;

  /**
   * Comma separated list of additional BitTorrent tracker's announce URI. These URIs are not affected by [--bt-exclude-tracker](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-exclude-tracker) option because they are added after URIs in [--bt-exclude-tracker](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-exclude-tracker) option are removed.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-tracker
   */
  tracker: string[];

  /**
   * Set the connect timeout in seconds to establish connection to tracker. After the connection is established, this option makes no effect and [--bt-tracker-timeout](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-tracker-timeout) option is used instead.
   *
   * @default 60
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-tracker-connect-timeout
   */
  trackerConnectTimeout: number;

  /**
   * Set the interval in seconds between tracker requests. This completely overrides interval value and aria2 just uses this value and ignores the min interval and interval value in the response of tracker. If `0` is set, aria2 determines interval based on the response of tracker and the download progress.
   *
   * @default 0
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-tracker-interval
   */
  trackerInterval: number;

  /**
   * Set timeout in seconds.
   *
   * @default 60
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-tracker-timeout
   */
  trackerTimeout: number;

  /**
   * Enable Peer Exchange extension. If a private flag is set in a torrent, this feature is disabled for that download even if `true` is given.
   *
   * @default true
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-enable-peer-exchange
   */
  enablePeerExchange: boolean;

  /**
   * If `true` or `mem` is specified, when a file whose suffix is `.torrent` or content type is `application/x-bittorrent` is downloaded, aria2 parses it as a torrent file and downloads files mentioned in it. If `mem` is specified, a torrent file is not written to the disk, but is just kept in memory. If `false` is specified, the `.torrent` file is downloaded to the disk, but is not parsed as a torrent and its contents are not downloaded.
   *
   * @default true
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-follow-torrent
   */
  followTorrent: boolean | 'mem';

  /**
   * Set file path for file with index=INDEX. You can find the file index using the [--show-files](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-S) option. PATH is a relative path to the path specified in [--dir](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-d) option. You can use this option multiple times. Using this option, you can specify the output file names of BitTorrent downloads.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-O
   */
  indexOut: Record<string, string>;

  /**
   * Set max upload speed per each torrent in bytes/sec. `0` means unrestricted. You can append `K` or `M` (1K = 1024, 1M = 1024K). To limit the overall upload speed, use [--max-overall-upload-limit](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-max-overall-upload-limit) option.
   *
   * @default 0
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-0
   */
  maxUploadLimit: StrSize;

  /**
   * Specify share ratio. Seed completed torrents until share ratio reaches RATIO. You are strongly encouraged to specify equals or more than `1.0` here. Specify `0.0` if you intend to do seeding regardless of share ratio. If [--seed-time](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-seed-time) option is specified along with this option, seeding ends when at least one of the conditions is satisfied.
   *
   * @default '1.0'
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-seed-ratio
   */
  seedRatio: string;

  /**
   * Specify seeding time in (fractional) minutes. Also see the [--seed-ratio](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-seed-ratio) option.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-seed-time
   */
  seedTime: string;
}

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#bittorrent-specific-options
 */
export interface Aria2BtGlobalOptions {
  /**
   * Exclude seed only downloads when counting concurrent active downloads (See `-j` option). This means that if `-j3` is given and this option is turned on and 3 downloads are active and one of those enters seed mode, then it is excluded from active download count (thus it becomes 2), and the next download waiting in queue gets started. But be aware that seeding item is still recognized as active download in RPC method.
   *
   * @default false
   *
   * @link http://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-detach-seed-only
   */
  detachSeedOnly: boolean;

  /**
   * Use given interface for Local Peer Discovery. If this option is not specified, the default interface is chosen. You can specify interface name and IP address. Possible Values: interface, IP address.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-lpd-interface
   */
  lpdInterface: string;

  /**
   * Specify maximum number of files to open in multi-file BitTorrent/Metalink download globally.
   *
   * @default 100
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-bt-max-open-files
   */
  maxOpenFiles: number;

  /**
   * Set TCP port number for BitTorrent downloads. Multiple ports can be specified by using `,`, for example: 6881,6885. You can also use `-` to specify a range: `6881-6999`. `,` and `-` can be used together: `6881-6889,6999`. Default: `6881-6999`
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-listen-port
   */
  listenPort: number[];

  /**
   * Set max overall upload speed in bytes/sec. `0` means unrestricted. You can append `K` or `M` (1K = 1024, 1M = 1024K). To limit the upload speed per torrent, use [--max-upload-limit](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-0) option.
   *
   * @default 0
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-max-overall-upload-limit
   */
  maxOverallUploadLimit: StrSize;

  /**
   * Specify the prefix of peer ID. The peer ID in BitTorrent is 20 byte length. If more than 20 bytes are specified, only first 20 bytes are used. If less than 20 bytes are specified, random byte data are added to make its length 20 bytes.
   * Default: A2-$MAJOR-$MINOR-$PATCH-, $MAJOR, $MINOR and $PATCH are replaced by major, minor and patch version number respectively. For instance, aria2 version 1.18.8 has prefix ID A2-1-18-8-.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-peer-id-prefix
   */
  peerIdPrefix: string;

  /**
   * Specify the string used during the bitorrent extended handshake for the peer's client version.
   * Default: aria2/$MAJOR.$MINOR.$PATCH, $MAJOR, $MINOR and $PATCH are replaced by major, minor and patch version number respectively. For instance, aria2 version 1.18.8 has peer agent aria2/1.18.8.
   *
   * https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-peer-agent
   */
  peerAgent: string;
}

export interface Aria2DhtInputOptions {}

export interface Aria2DhtGlobalOptions {
  /**
   * Enable IPv4 DHT functionality. It also enables UDP tracker support. If a private flag is set in a torrent, aria2 doesn't use DHT for that download even if `true` is given.
   *
   * @default true
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-enable-dht
   */
  enable: boolean;

  /**
   * Enable IPv6 DHT functionality. If a private flag is set in a torrent, aria2 doesn't use DHT for that download even if `true` is given. Use [--dht-listen-port](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-listen-port) option to specify port number to listen on. See also [--dht-listen-addr6](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-listen-addr6) option.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-enable-dht6
   */
  enable6: boolean;

  /**
   * --dht-entry-point=<HOST>:<PORT>
   *
   * Set host and port as an entry point to IPv4 DHT network.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-entry-point
   */
  entryPoint: string;

  /**
   * --dht-entry-point=<HOST>:<PORT>
   *
   * Set host and port as an entry point to IPv6 DHT network.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-entry-point6
   */
  entryPoint6: string;

  /**
   * Change the IPv4 DHT routing table file to PATH. Default: `$HOME/.aria2/dht.dat` if present, otherwise `$XDG_CACHE_HOME/aria2/dht.dat`.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-file-path
   */
  filePath: string;

  /**
   * Change the IPv6 DHT routing table file to PATH. Default: `$HOME/.aria2/dht6.dat` if present, otherwise `$XDG_CACHE_HOME/aria2/dht6.dat`.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-file-path6
   */
  filePath6: string;

  /**
   * https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-listen-addr6
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-listen-addr6
   */
  listenAddr6: string;

  /**
   * Set UDP listening port used by DHT(IPv4, IPv6) and UDP tracker. Multiple ports can be specified by using `,`, for example: `6881,6885`. You can also use `-` to specify a range: `6881-6999`. `,` and `-` can be used together. Default: `6881-6999`
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-listen-port
   */
  listenPort: number[];

  /**
   * Set timeout in seconds.
   *
   * @default 10
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-dht-message-timeout
   */
  messageTimeout: number;
}

/**
 * Use a proxy server for all protocols. To override a previously defined proxy, use "". You also can override this setting and specify a proxy server for a particular protocol using --http-proxy, --https-proxy and --ftp-proxy options. This affects all downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]. See also ENVIRONMENT section.
 *
 * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
 */
export type Aria2ProxyOptions =
  | string
  | {
      /**
       * Use a proxy server for all protocols.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
       */
      proxy: string;

      /**
       * Set user for --all-proxy option.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy-user
       */
      user: string;

      /**
       * Set password for --all-proxy option.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy-passwd
       */
      passwd: string;

      /**
       * Specify a comma separated list of host names, domains and network addresses with or without a subnet mask where no proxy should be used.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-no-proxy
       */
      no: string | string[];

      /**
       * Set the method to use in proxy request. METHOD is either get or tunnel. HTTPS downloads always use tunnel regardless of this option.
       *
       * @default 'get'
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-proxy-method
       */
      method: 'get' | 'tunnel';
    }
  | {
      /**
       * Use a proxy server for all protocols. To override a previously defined proxy, use "". You also can override this setting and specify a proxy server for a particular protocol using --http-proxy, --https-proxy and --ftp-proxy options. This affects all downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]. See also ENVIRONMENT section.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
       */
      all:
        | string
        | {
            /**
             * Use a proxy server for all protocols.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
             */
            proxy: string;

            /**
             * Set user for --all-proxy option.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy-user
             */
            user: string;

            /**
             * Set password for --all-proxy option.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy-passwd
             */
            passwd: string;
          };

      /**
       * Use a proxy server for HTTP. To override a previously defined proxy, use "". See also the --all-proxy option. This affects all http downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-http-proxy
       */
      http:
        | string
        | {
            /**
             * Set user for --http-proxy.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-http-proxy
             */
            proxy: string;

            /**
             * Set password for --http-proxy.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-http-proxy-user
             */
            user: string;

            /**
             * Set password for --http-proxy.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-http-proxy-passwd
             */
            passwd: string;
          };

      /**
       * Use a proxy server for HTTPS. To override a previously defined proxy, use "". See also the --all-proxy option. This affects all https download. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-https-proxy
       */
      https:
        | string
        | {
            /**
             * Use a proxy server for HTTPS.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-https-proxy
             */
            proxy: string;

            /**
             * Set user for --https-proxy.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-https-proxy-user
             */
            user: string;

            /**
             * Set password for --https-proxy.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-https-proxy-passwd
             */
            passwd: string;
          };

      /**
       * Use a proxy server for FTP. To override a previously defined proxy, use "". See also the --all-proxy option. This affects all ftp downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-ftp-proxy
       */
      ftp:
        | string
        | {
            /**
             * Use a proxy server for FTP.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-ftp-proxy
             */
            proxy: string;

            /**
             * Set user for --ftp-proxy option.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-ftp-proxy-user
             */
            user: string;

            /**
             * Set password for --ftp-proxy option.
             *
             * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-ftp-proxy-passwd
             */
            passwd: string;
          };

      /**
       * Specify a comma separated list of host names, domains and network addresses with or without a subnet mask where no proxy should be used.
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-no-proxy
       */
      no: string | string[];

      /**
       * Set the method to use in proxy request. METHOD is either get or tunnel. HTTPS downloads always use tunnel regardless of this option.
       *
       * @default 'get'
       *
       * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-proxy-method
       */
      method: 'get' | 'tunnel';
    };

export type Aria2InputOptions = Aria2BasicInputOptions & {
  /**
   * Use a proxy server for all protocols. To override a previously defined proxy, use "". You also can override this setting and specify a proxy server for a particular protocol using --http-proxy, --https-proxy and --ftp-proxy options. This affects all downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]. See also ENVIRONMENT section.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
   */
  proxy: Aria2ProxyOptions;

  http: Aria2HTTPFTPOptions & Aria2HTTPOptions;

  ftp: Aria2HTTPFTPOptions & Aria2FTPOptions;

  bt: Aria2BtMetalinkOptions & Aria2BtInputOptions & Aria2DhtInputOptions;
};

export type Aria2GlobalOptions = MergeDeep<
  Aria2InputOptions & Aria2BasicGlobalOptions,
  {
    rpc: Aria2RPCOptions;
    bt: Aria2BtGlobalOptions & Aria2DhtGlobalOptions;
  }
>;

export type Aria2RPCOptionsKey =
  | 'pause'
  | 'pause-metadata'
  | 'rpc-allow-origin-all'
  | 'rpc-certificate'
  | 'rpc-listen-all'
  | 'rpc-listen-port'
  | 'rpc-max-request-size'
  | 'rpc-private-key'
  | 'rpc-save-upload-metadata'
  | 'rpc-secret'
  | 'rpc-secure';

/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#rpc-options
 */
export interface Aria2RPCOptions {
  /**
   * Pause download after added. This option is effective only when --enable-rpc=true is given.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-pause
   */
  pause: boolean;

  /**
   * Pause downloads created as a result of metadata download. There are 3 types of metadata downloads in aria2: (1) downloading .torrent file. (2) downloading torrent metadata using magnet link. (3) downloading metalink file. These metadata downloads will generate downloads using their metadata. This option pauses these subsequent downloads. This option is effective only when --enable-rpc=true is given.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-pause-metadata
   */
  pauseMetadata: boolean;

  /**
   * Add Access-Control-Allow-Origin header field with value * to the RPC response.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-allow-origin-all
   */
  allowOriginAll: boolean;

  /**
   * Use the certificate in FILE for RPC server. The certificate must be either in PKCS12 (.p12, .pfx) or in PEM format.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-certificate
   */
  certificate: string;

  /**
   * Listen incoming JSON-RPC/XML-RPC requests on all network interfaces. If false is given, listen only on local loopback interface.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-listen-all
   */
  listenAll: boolean;

  /**
   * Specify a port number for JSON-RPC/XML-RPC server to listen to. Possible Values: `1024` - `65535`.
   *
   * @default 6800
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-listen-port
   */
  listenPort: number;

  /**
   * Set max size of JSON-RPC/XML-RPC request. If aria2 detects the request is more than SIZE bytes, it drops connection.
   *
   * @default '2M'
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-max-request-size
   */
  maxRequestSize: StrSize;

  /**
   * Use the private key in FILE for RPC server. The private key must be decrypted and in PEM format. Use [--rpc-secure](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-secure) option to enable encryption. See also [--rpc-certificate](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-certificate) option.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-private-key
   */
  privateKey: string;

  /**
   * Save the uploaded torrent or metalink meta data in the directory specified by [--dir](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-d) option. The file name consists of SHA-1 hash hex string of meta data plus extension. For torrent, the extension is '.torrent'. For metalink, it is '.meta4'. If false is given to this option, the downloads added by [aria2.addTorrent()](https://aria2.github.io/manual/en/html/aria2c.html#aria2.addTorrent) or [aria2.addMetalink()](https://aria2.github.io/manual/en/html/aria2c.html#aria2.addMetalink) will not be saved by [--save-session](https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-save-session) option.
   *
   * @default true
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-save-upload-metadata
   */
  saveUploadMetadata: boolean;

  /**
   * Set RPC secret authorization token. Read [RPC authorization secret token](https://aria2.github.io/manual/en/html/aria2c.html#rpc-auth) to know how this option value is used.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-secret
   */
  secret: string;

  /**
   * RPC transport will be encrypted by SSL/TLS. The RPC clients must use https scheme to access the server. For WebSocket client, use wss scheme. Use --rpc-certificate and --rpc-private-key options to specify the server certificate and private key.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-rpc-secure
   */
  secure: boolean;
}
