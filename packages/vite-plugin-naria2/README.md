# vite-plugin-naria2

[![version](https://img.shields.io/npm/v/vite-plugin-naria2?label=vite-plugin-naria2)](https://www.npmjs.com/package/vite-plugin-naria2)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

## Installation

```bash
npm i vite-plugin-naria2
```

## Usage

```ts
import { defineConfig } from 'vite';

import Naria2 from 'vite-plugin-naria2';
import TopLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    TopLevelAwait(),
    Naria2({
      childProcess: {
        log: './aria2.log', // Used for debug
        rpc: {
          secret: '123456' // Use the fixed secret, or generate under the hood
        }
      }
    })
  ]
});
```

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
