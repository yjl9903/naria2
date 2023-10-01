# naria2 (WIP)

[![version](https://img.shields.io/npm/v/naria2?label=naria2)](https://www.npmjs.com/package/naria2)
[![version](https://img.shields.io/npm/v/naria2c?label=naria2c)](https://www.npmjs.com/package/naria2c)
[![version](https://img.shields.io/npm/v/vite-plugin-naria2?label=vite-plugin-naria2)](https://www.npmjs.com/package/vite-plugin-naria2)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

High-level and Convenient BitTorrent Client based on aria2 JSON-RPC.

+ [x] Download aria2 for your platform
+ [x] Vite plugin which helps you develop aria2 client application
+ [ ] Simple BitTorrent downloading API
+ [ ] Event bus for progress, state change, and so on

## Usage

### Browser

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

You can use the `createChildProcess` API to spawn an aria2 child process, and connect to it in WebScoket under the hood.

```ts
import { createClient } from 'naria2'
import { createChildProcess } from '@naria2/node'

const client = await createClient(createChildProcess())
```

> **Warning**
>
> You should **close the client on your own**, otherwise the aria2 process **may not be killed** even if your program finished or crashed.
>
> See [my blog post (in Chinese)](https://blog.onekuma.cn/death-of-a-node-process) or [The Death of a Node.js Process (in English)](https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process) on how to handle the exit of a Node.js process.

## Cross-platform aria2c

It is used in the same way as [aria2](https://aria2.github.io/manual/en/html/index.html).

```bash
$ npm i -g naria2c

$ naria2c --version
naria2c/0.0.9-beta.4
--------------------
aria2 version 1.36.0
Copyright (C) 2006, 2019 Tatsuhiro Tsujikawa

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

** Configuration **
Enabled Features: Async DNS, BitTorrent, Firefox3 Cookie, GZip, HTTPS, Message Digest, Metalink, XML-RPC, SFTP
Hash Algorithms: sha-1, sha-224, sha-256, sha-384, sha-512, md5, adler32
Libraries: zlib/1.2.13 expat/2.2.8 sqlite3/3.30.0 AppleTLS c-ares/1.15.0 libssh2/1.10.0
Compiler: Apple LLVM 14.0.3 (clang-1403.0.22.14.1)
  built by  aarch64-apple-darwin22.4.0
  on        Apr 28 2023 15:20:19
System: Darwin 23.0.0 Darwin Kernel Version 23.0.0: Fri Sep 15 14:41:34 PDT 2023; root:xnu-10002.1.13~1/RELEASE_ARM64_T8103 arm64

Report bugs to https://github.com/aria2/aria2/issues
Visit https://aria2.github.io/

$ naria2c --help
```

## Credits

+ [aria2](https://github.com/aria2/aria2): A lightweight multi-protocol & multi-source, cross platform download utility operated in command-line
+ [@hydrati](https://github.com/hydrati) made [maria2](https://github.com/hydrati/maria2)
+ [Motrix](https://github.com/agalwood/Motrix): Build aria2 binaries for different platforms

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
