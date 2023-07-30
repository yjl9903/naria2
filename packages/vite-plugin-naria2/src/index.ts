import type { Plugin } from 'vite';
import type { PartialDeep } from 'type-fest';

import { onDeath } from '@breadc/death';
import { bold, cyan, green } from '@breadc/color';
import { createLogger, defineConfig } from 'vite';

import { Aria2GlobalOptions } from 'naria2';
import { type ChildProcessOptions, createChildProcess } from '@naria2/node';

export interface Naria2PluginOptions {
  childProcess?: Partial<ChildProcessOptions> & PartialDeep<Aria2GlobalOptions>;
}

export function Naria2(options: Naria2PluginOptions = {}): Plugin[] {
  const logger = createLogger();

  const childProcessRuntime = {
    url: undefined as string | undefined,
    secret: undefined as string | undefined
  };

  return [
    {
      name: 'vite-plugin-naria2:runtime',
      apply: 'serve',
      async configureServer(server) {
        const _printUrls = server.printUrls;

        const childProcess = await createChildProcess(options.childProcess);
        onDeath(() => {
          childProcess.close();
        });
        childProcessRuntime.url = `ws://127.0.0.1:${childProcess.getOptions().listenPort}/jsonrpc`;

        // Overwrite server.printUrls
        // https://github.com/kinfuy/vite-plugin-shortcuts/issues/1
        server.printUrls = () => {
          _printUrls();

          if (childProcessRuntime.url) {
            const colorUrl = (url: string) =>
              cyan(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`));
            logger.info(
              `  ${green('➜')}  ${bold('Pages')}:   ${colorUrl(childProcessRuntime.url)}\n`
            );
          }
        };
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
