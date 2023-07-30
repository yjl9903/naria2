import type { Plugin } from 'vite';
import type { PartialDeep } from 'type-fest';

import { onDeath } from '@breadc/death';
import { createLogger, defineConfig } from 'vite';

import { Aria2GlobalOptions } from 'naria2';
import { type ChildProcessOptions, createChildProcess } from '@naria2/node';

export interface Naria2PluginOptions {
  childProcess?: Partial<ChildProcessOptions> & PartialDeep<Aria2GlobalOptions>;
}

export function Naria2(options: Naria2PluginOptions): Plugin[] {
  const logger = createLogger();

  const childProcessRuntime = {
    url: undefined as string | undefined,
    secret: undefined as string | undefined
  };

  return [
    {
      name: 'vite-plugin-naria2:runtime',
      apply: 'serve',
      async buildStart() {
        const childProcess = await createChildProcess(options.childProcess);
        onDeath(() => {
          childProcess.close();
        });
        childProcessRuntime.url = `ws://127.0.0.1:${childProcess.getOptions().listenPort}/jsonrpc`;
        logger.info(`aria2 is running on ${childProcessRuntime.url}`);
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
          const clientCode = `socket ? createClient(socket, { ${
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
