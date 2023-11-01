# naria2c

[![version](https://img.shields.io/npm/v/naria2c?label=naria2c)](https://www.npmjs.com/package/naria2c)
[![CI](https://github.com/yjl9903/naria2/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/naria2/actions/workflows/ci.yml)

Cross-platform wrapper of aria2c.

![home](./assets/home.png)

## Installation

```bash
npm i -g naria2c
```

## Usage

It is used in the same way as [aria2](https://aria2.github.io/manual/en/html/index.html).

```bash
naria2c --help
```

You can also launch a Web UI to manage aria2 using the `--ui` option. This feature is provided by this package, not the original aria2.

```bash
$ naria2c --ui --open
...
10/29 21:22:46 [NOTICE] WebUI is listening on the http://127.0.0.1:6801?port=6800&secret=123456
...
```

## Credits

+ [aria2](https://github.com/aria2/aria2): A lightweight multi-protocol & multi-source, cross platform download utility operated in command-line
+ [@hydrati](https://github.com/hydrati) made [maria2](https://github.com/hydrati/maria2)
+ [Motrix](https://github.com/agalwood/Motrix): Build aria2 binaries for different platforms

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
