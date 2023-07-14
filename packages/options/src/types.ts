/**
 * @link https://aria2.github.io/manual/en/html/aria2c.html#basic-options
 */
export interface Aria2BasicOptions {
  /**
   * The directory to store the downloaded file.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-d
   */
  dir: string;

  /**
   * The file name of the log file. If - is specified, log is written to stdout. If empty string("") is specified, or this option is omitted, no log is written to disk at all.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-l
   */
  log: string | undefined;

  /**
   * Set the maximum number of parallel downloads for every queue item. See also the --split option.
   *
   * @default 5
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-j
   */
  maxConcurrentDownloads: number;

  /**
   * Check file integrity by validating piece hashes or a hash of entire file. This option has effect only in BitTorrent, Metalink downloads with checksums or HTTP(S)/FTP downloads with --checksum option. If piece hashes are provided, this option can detect damaged portions of a file and re-download them. If a hash of entire file is provided, hash check is only done when file has been already download. This is determined by file length. If hash check fails, file is re-downloaded from scratch. If both piece hashes and a hash of entire file are provided, only piece hashes are used.
   *
   * @default false
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-V
   */
  checkIntegrity: boolean;

  /**
   * Continue downloading a partially downloaded file. Use this option to resume a download started by a web browser or another program which downloads files sequentially from the beginning. Currently this option is only applicable to HTTP(S)/FTP downloads.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-c
   */
  continue: boolean;
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
export interface Aria2BtOptions {}

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

export type Aria2Options = Aria2BasicOptions & {
  /**
   * Use a proxy server for all protocols. To override a previously defined proxy, use "". You also can override this setting and specify a proxy server for a particular protocol using --http-proxy, --https-proxy and --ftp-proxy options. This affects all downloads. The format of PROXY is [http://][USER:PASSWORD@]HOST[:PORT]. See also ENVIRONMENT section.
   *
   * @link https://aria2.github.io/manual/en/html/aria2c.html#cmdoption-all-proxy
   */
  proxy: Aria2ProxyOptions;

  http: Aria2HTTPFTPOptions & Aria2HTTPOptions;

  ftp: Aria2HTTPFTPOptions & Aria2FTPOptions;

  bt: Aria2BtMetalinkOptions & Aria2BtOptions;
};

export interface Aria2RPCOptions {
  pause: boolean;

  pauseMetadata: boolean;

  allowOriginAll: boolean;

  certificate: string;

  listenAll: boolean;

  listenPort: number;

  maxRequestSize: number;

  privateKey: string;

  saveUploadMetadata: boolean;

  secret: string;

  secure: boolean;
}
