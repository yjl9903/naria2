import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

import Naria2 from 'vite-plugin-naria2';
import BuildInfo from 'vite-plugin-info';
import TopLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  resolve: {
    alias: {
      naria2: path.resolve(fileURLToPath(import.meta.url), '../../packages/naria2/src/index.ts'),
      '@naria2/options': path.resolve(
        fileURLToPath(import.meta.url),
        '../../packages/options/src/index.ts'
      )
    }
  },
  plugins: [
    BuildInfo(),
    TopLevelAwait(),
    Naria2({
      childProcess: {
        log: './aria2.log',
        rpc: {
          secret: '123456'
        }
      }
    })
  ]
});
