import { defineConfig } from 'vite';

import Naria2 from 'vite-plugin-naria2';
import BuildInfo from 'vite-plugin-info';
import TopLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
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
