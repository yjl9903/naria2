interface ErrorDetail {
  /**
   * aria2 binary path
   */
  binary?: string;

  /**
   * aria2 JSON RPC server url
   */
  url?: string;

  /**
   * Raw error
   */
  cause?: Error;
}

export class Naria2NodeError extends Error {
  readonly binary: string | undefined;

  readonly url: string | undefined;

  constructor(message: string, detail?: ErrorDetail) {
    super(`[@naria2/node] ${message}`, { cause: detail?.cause });
    this.binary = detail?.binary;
    this.url = detail?.url;
  }
}
