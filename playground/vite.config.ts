import { defineConfig } from 'vite';

import BuildInfo from 'vite-plugin-info';
import { Naria2 } from 'vite-plugin-naria2';
import TopLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    BuildInfo(),
    Naria2({
      childProcess: {
        rpc: {
          secret: '123456'
        }
      }
    }),
    TopLevelAwait()
  ]
});
