import { describe, it, expect } from 'vitest';

import {
  resolveGlobalOptions,
  resolveInputOptions,
  resolveRPCOptions,
  stringifyCliOptions
} from '../src';

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

    expect(
      resolveGlobalOptions({
        log: './log.txt',
        bt: {
          detachSeedOnly: true,
          listenPort: ['10000-10100']
        },
        dht: {
          listenPort: ['20000-20200']
        },
        rpc: {
          listenAll: true,
          listenPort: 16800,
          allowOriginAll: true,
          secret: '123456'
        }
      })
    ).toMatchInlineSnapshot(`
      {
        "bt-detach-seed-only": "true",
        "dht-listen-port": "20000-20200",
        "listen-port": "10000-10100",
        "log": "./log.txt",
        "rpc-allow-origin-all": "true",
        "rpc-listen-all": "true",
        "rpc-listen-port": "16800",
        "rpc-secret": "123456",
      }
    `);
  });

  it('resolve input options', () => {
    expect(
      resolveInputOptions({
        dir: './download',
        bt: {
          saveMetadata: true,
          tracker: ['123', '456']
        },
        proxy: {
          no: undefined,
          all: 'http://127.0.0.1:1080'
        }
      })
    ).toMatchInlineSnapshot(`
      {
        "all-proxy": "http://127.0.0.1:1080",
        "bt-save-metadata": "true",
        "bt-tracker": "123,456",
        "dir": "./download",
      }
    `);
  });
});
