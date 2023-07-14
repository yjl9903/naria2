# @naria2/node

[![version](https://img.shields.io/npm/v/@naria2/node?label=@naria2/node)](https://www.npmjs.com/package/@naria2/node)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

Cross-platform wrapper of aria2

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

const client = await createClient(createChildProcess())
```

> **Warning**
>
> You should **close the client on your own**, otherwise the aria2 process **may not be killed** even if your program finished or crashed.
>
> See [my blog post (in Chinese)](https://blog.onekuma.cn/death-of-a-node-process) or [The Death of a Node.js Process (in English)](https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process) on how to handle the exit of a Node.js process.

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
