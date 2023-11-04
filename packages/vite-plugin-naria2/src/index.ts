import type { Plugin } from 'vite';
import type { PartialDeep } from 'type-fest';

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { createLogger } from 'vite';
import { bold, cyan, green } from '@breadc/color';

import { Aria2GlobalOptions } from 'naria2';
import {
  type ChildProcessOptions,
  type ChildProcessSocket,
  createChildProcess
} from '@naria2/node';
import { handleWebUIOpenRequest } from '@naria2/node/ui';

export interface Naria2PluginOptions {
  childProcess?: Partial<ChildProcessOptions> & PartialDeep<Aria2GlobalOptions>;
}

export default function Naria2(options: Naria2PluginOptions = {}): Plugin[] {
  let root: string;
  const logger = createLogger();

  const childProcessRuntime = {
    dir: path.join(process.cwd(), '.aria2'),
    process: undefined as ChildProcessSocket | undefined,
    url: undefined as string | undefined,
    secret: undefined as string | undefined
  };

  return [
    {
      name: 'vite-plugin-naria2:runtime',
      apply: 'serve',
      configResolved(config) {
        root = config.root;
      },
      async configureServer(server) {
        server.middlewares.use('/_/open', async (req, res, next) => {
          try {
            if (
              await handleWebUIOpenRequest(new URL(req.url!), req, res, {
                rpc: {
                  port: childProcessRuntime.process?.getOptions().listenPort ?? 6800,
                  secret: childProcessRuntime.secret
                }
              })
            ) {
              return;
            }
          } catch {}

          next();
        });

        const _printUrls = server.printUrls;

        if (!childProcessRuntime.process) {
          childProcessRuntime.dir = path.join(root, '.aria2');
          await fs.mkdir(childProcessRuntime.dir, { recursive: true }).catch(() => {});

          const childProcess = await createChildProcess({
            dir: childProcessRuntime.dir,
            ...options.childProcess
          });

          childProcessRuntime.process = childProcess;
          childProcessRuntime.url = `ws://127.0.0.1:${
            childProcess.getOptions().listenPort
          }/jsonrpc`;
          childProcessRuntime.secret = childProcess.getOptions().secret;
        }

        // Overwrite server.printUrls
        // https://github.com/kinfuy/vite-plugin-shortcuts/issues/1
        server.printUrls = () => {
          _printUrls();

          if (childProcessRuntime.url) {
            const colorUrl = (url: string) =>
              cyan(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`));
            logger.info(
              `  ${green('➜')}  ${bold('Naria2')}:  ${colorUrl(childProcessRuntime.url)}\n`
            );
          }
        };
      },
      closeBundle() {
        childProcessRuntime.process?.close?.();
        childProcessRuntime.url = undefined;
        childProcessRuntime.secret = undefined;
      }
    },
    {
      name: 'vite-plugin-naria2:build',
      resolveId(id) {
        if (id === '~naria2/jsonrpc') {
          return '\0' + id;
        }
      },
      load(id) {
        if (id === '\0~naria2/jsonrpc') {
          const socketCode = childProcessRuntime.url
            ? `new WebSocket(${JSON.stringify(childProcessRuntime.url)})`
            : 'undefined';
          const clientCode = `socket ? await createClient(socket, { ${
            childProcessRuntime.secret
              ? 'secret: ' + JSON.stringify(childProcessRuntime.secret)
              : ''
          } }) : undefined`;

          return [
            `import { createClient } from 'naria2';`,
            `export const socket = ${socketCode};`,
            `export const client = ${clientCode};`
          ].join('\n');
        }
      }
    }
  ];
}
