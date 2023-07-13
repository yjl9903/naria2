# naria2 (WIP)

[![version](https://img.shields.io/npm/v/naria2?label=naria2)](https://www.npmjs.com/package/naria2)
[![version](https://img.shields.io/npm/v/naria2c?label=naria2c)](https://www.npmjs.com/package/naria2c)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

High-level and Convenient BitTorrent Client based on aria2 JSON-RPC.

+ [x] Download aria2 for your platform
+ [ ] Simple BitTorrent downloading API
+ [ ] Event bus for progress, state change, and so on

## Usage

### Browser / Node.js

```bash
npm i naria2
```

Using WebSocket:

```ts
import { createClient } from 'naria2'

const client = await createClient(
  new WebSocket('ws://localhost:6800/jsonrpc')
)
```

Using HTTP:

```ts
import { createClient } from 'naria2'
import { createHTTP } from 'naria2/transport'

const client = await createClient(
  createHTTP('http://localhost:6800/jsonrpc')
)
```

### Node.js standalone

If you want to use naria2 in the Node.js standalone, you can install `@naria2/node`. It has included a [prebuilt aria2 binary](https://github.com/agalwood/Motrix/tree/master/extra) according to your architecture, so that there is no need to install a [aria2](https://github.com/aria2/aria2) on your own.

```bash
npm i naria2 @naria2/node
```

You can use the `createSubprocess` API to spawn an aria2 child process, and connect to it in WebScoket under the hood.

```ts
import { createClient } from 'naria2'
import { createSubprocess } from '@naria2/node'

const client = await createClient(
  createSubprocess()
)
```

> **Warning**
>
> You should **close the client on your own**, otherwise the aria2 process **may not be killed** even if your program finished or crashed.
>
> See [my blog post (in Chinese)](https://blog.onekuma.cn/death-of-a-node-process) or [The Death of a Node.js Process (in English)](https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process) on how to handle the exit of a Node.js process.

## Cross-platform aria2c

```bash
npm i -g naria2c
naria2c --help
```

## Credits

+ [aria2](https://github.com/aria2/aria2): A lightweight multi-protocol & multi-source, cross platform download utility operated in command-line
+ [@hydrati](https://github.com/hydrati) made [maria2](https://github.com/hydrati/maria2)
+ [Motrix](https://github.com/agalwood/Motrix): Build aria2 binaries for different platforms

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
