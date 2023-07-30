# vite-plugin-naria2

[![version](https://img.shields.io/npm/v/vite-plugin-naria2?label=vite-plugin-naria2)](https://www.npmjs.com/package/vite-plugin-naria2)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

Make it easy to debug a aria2 client application.

## Installation

```bash
npm i vite-plugin-naria2
```

## Usage

```ts
// vite.config.ts

import { defineConfig } from 'vite';

import Naria2 from 'vite-plugin-naria2';
import TopLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    TopLevelAwait(), // Used for transforming the top-level await syntax
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

Use the aria2 child process in your application code.

```ts
// main.ts

import { socket, client } from '~naria2/jsonrpc';

console.log('naria2 socket:', socket);
console.log('naria2 client:', client);
```

> **Warning**
>
> The aria2 child process only created in your development so that these exported variables will be `undefined` in production.

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
