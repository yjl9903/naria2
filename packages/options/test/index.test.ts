import { describe, it, expect } from 'vitest';

import { resolveGlobalOptions, resolveRPCOptions, stringifyCliOptions } from '../src';

describe('aria2 options', () => {
  it('resolve RPC options', async () => {
    expect(
      resolveRPCOptions({
        pause: false,
        pauseMetadata: true,
        allowOriginAll: false,
        certificate: 'file',
        listenAll: true,
        listenPort: 6800,
        maxRequestSize: '4M',
        saveUploadMetadata: false,
        secret: '666666',
        secure: false
      })
    ).toMatchInlineSnapshot(`
      {
        "pause": "false",
        "pause-metadata": "true",
        "rpc-allow-origin-all": "false",
        "rpc-certificate": "file",
        "rpc-listen-all": "true",
        "rpc-listen-port": "6800",
        "rpc-max-request-size": "4M",
        "rpc-save-upload-metadata": "false",
        "rpc-secret": "666666",
        "rpc-secure": "false",
      }
    `);
  });

  it('resolve global options', () => {
    expect(
      stringifyCliOptions(
        resolveGlobalOptions({
          bt: {
            indexOut: {
              a: 'b',
              c: 'd'
            }
          }
        })
      )
    ).toMatchInlineSnapshot(`
      [
        "--index-out=a=b",
        "--index-out=c=d",
      ]
    `);
  });
});
