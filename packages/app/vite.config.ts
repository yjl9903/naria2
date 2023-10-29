import fs from 'fs-extra';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, Plugin } from 'vite';

import BuildInfo from 'vite-plugin-info';
import react from '@vitejs/plugin-react-swc';
import TopLevelAwait from 'vite-plugin-top-level-await';

import Naria2 from '../vite-plugin-naria2/src';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      naria2: path.resolve(__dirname, '../naria2/src/index.ts'),
      '@naria2/options': path.resolve(__dirname, '../options/src/index.ts'),
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react(),
    BuildInfo(),
    TopLevelAwait(),
    Naria2({
      childProcess: {
        log: './aria2.log',
        rpc: {
          secret: '123456'
        }
      }
    }),
    Copy()
  ]
});

function Copy() {
  let outDir = './dist';

  return <Plugin>{
    name: 'naria2c-copy',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const clientDir = path.resolve(__dirname, '../naria2c/client');
      await fs.rmdir(clientDir, { recursive: true }).catch(() => undefined);
      await fs.mkdir(clientDir);
      await fs.copy(outDir, clientDir);
    }
  };
}
