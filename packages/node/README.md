# @naria2/node

[![version](https://img.shields.io/npm/v/@naria2/node?label=@naria2/node)](https://www.npmjs.com/package/@naria2/node)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

Cross-platform wrapper of aria2.

+ Download aria2 according to your platform
+ Web UI for aria2c (more features is working in progress)

## Installation

```bash
npm i naria2 @naria2/node
```

## Usage

It has included a [prebuilt aria2 binary](https://github.com/agalwood/Motrix/tree/master/extra) according to your architecture, so that there is no need to install a [aria2](https://github.com/aria2/aria2) on your own.

```bash
npm i naria2 @naria2/node
```

You can use the `createChildProcess` API to spawn an aria2 child process, and connect to it in WebScoket under the hood.

```ts
import { createClient } from 'naria2'
import { createChildProcess } from '@naria2/node'

// Create a aria2 child process and initialize a client
const client = await createClient(createChildProcess())

// Start downloading a magnet
const torrent = await client.downloadUri('...')

// Watch metadata progress
await torrent.watch((torrent) => {
  console.log(`Downloading [MEATADATA]`)
})
// Watch torrent progress
await torrent.watchFollowedBy((torrent) => {
  console.log(`Downloading ${torrent.name}`)
})

// Shutdown client
await client.shutdown()
```

Due to the implementation of [aria2](https://aria2.github.io/manual/en/html/index.html), the downloading progress of a magnet uri includes **two steps**:

1. Download the torrent metadata which contains only a special file named `[METADATA]`;
2. Download the torrent content itself.

So that, in the above code, you should first wait for downloading metadata, and then wait for downloading the followed by task which is the torrent content itself.

You can find an example using Node.js [here](https://github.com/yjl9903/naria2/blob/main/scripts/download.mjs).

> **Warning**
>
> You should **close the client on your own**, otherwise the aria2 process **may not be killed** even if your program finished or crashed.
>
> See [my blog post (in Chinese)](https://blog.onekuma.cn/death-of-a-node-process) or [The Death of a Node.js Process (in English)](https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process) on how to handle the exit of a Node.js process.

## Support platforms

| Pacakge | Platform | Arch |
| :-----: | :------: | :--: |
| [![version](https://img.shields.io/npm/v/@naria2/darwin-arm64?label=@naria2/darwin-arm64)](https://www.npmjs.com/package/@naria2/darwin-arm64) | darwin | arm64 |
| [![version](https://img.shields.io/npm/v/@naria2/darwin-x64?label=@naria2/darwin-x64)](https://www.npmjs.com/package/@naria2/darwin-x64)       | darwin | x64   |
| [![version](https://img.shields.io/npm/v/@naria2/linux-arm64?label=@naria2/linux-arm64)](https://www.npmjs.com/package/@naria2/linux-arm64)    | linux  | arm64 |
| [![version](https://img.shields.io/npm/v/@naria2/linux-arm64?label=@naria2/linux-x64)](https://www.npmjs.com/package/@naria2/linux-x64)        | linux  | x64   |
| [![version](https://img.shields.io/npm/v/@naria2/win32-ia32?label=@naria2/win32-ia32)](https://www.npmjs.com/package/@naria2/win32-ia32)       | win32  | ia32  |
| [![version](https://img.shields.io/npm/v/@naria2/win32-x64?label=@naria2/win32-x64)](https://www.npmjs.com/package/@naria2/win32-x64)          | win32  | x64   |

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
