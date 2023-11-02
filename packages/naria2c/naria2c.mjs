#!/usr/bin/env node

import { Transform } from 'stream';
import { readFile } from 'fs/promises';

import { run } from '@naria2/node';
import { onDeath } from '@breadc/death';
import { bold, green } from '@breadc/color';

const { aria2: args, webui, debug: DEBUG } = resolveCliArgs(process.argv.slice(2));

/**
 * @type {import('http').Server}
 */
let server;

try {
  const childProcess = run(args, { detached: true });

  const cancelDeath = onDeath(async (signal) => {
    server?.close();

    const killChildProcess = () => {
      childProcess.kill(signal);
      return new Promise((res) => {
        if (childProcess.exitCode !== null || childProcess.killed) {
          res();
        } else {
          childProcess.once('exit', () => {
            res();
          });
        }
      });
    };

    await Promise.race([
      killChildProcess(),
      new Promise(async (res) => {
        for (let i = 1; i <= 4; i++) {
          await sleep(1000 * (5 - i));
          childProcess.kill(signal);
        }
        res();
      })
    ]);
  });

  if (args.includes('-h') || args.includes('--help')) {
    const result = await childProcess;
    const help = result.stdout.replace(/aria2c/g, 'naria2c');
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log();
    console.log(`naria2c is a cross-platform wrapper of aria2c.`);
    console.log();

    const idx = help.indexOf('\n -l, --log=LOG');
    console.log(help.slice(0, idx));
    console.log(' --ui                         Launch the naria2c Web UI.');
    console.log(
      '                              Note: This is provided by naria2c instead of the original aria2c'
    );
    console.log();
    console.log(' --open                       Open the Web UI after launching.');
    console.log('                              Default: true');
    console.log();
    console.log(' --port=PORT                  Specify the listen port of Web UI.');
    console.log('                              Default: 6801');
    console.log(
      '                              Note: This is provided by naria2c instead of the original aria2c'
    );
    console.log(help.slice(idx));
  } else if (args.includes('-v') || args.includes('--version')) {
    const result = await childProcess;
    const content = result.stdout;
    const { version } = await getPackage();

    const banner = `naria2c/${version}`;
    console.log(banner);
    console.log('-'.repeat(banner.length));
    console.log(content);
  } else {
    function transformStderr() {
      const replacers = [
        [
          `aria2c [OPTIONS] [URI | MAGNET | TORRENT_FILE | METALINK_FILE]...`,
          `naria2c [OPTIONS] [URI | MAGNET | TORRENT_FILE | METALINK_FILE]...`
        ],
        [`'aria2c -h'`, `'naria2c -h'`]
      ];

      return new Transform({
        transform(chunk, encoding, callback) {
          let text = chunk.toString();
          for (const [key, value] of replacers) {
            text = text.replace(key, value);
          }
          callback(null, text);
        }
      });
    }

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(transformStderr()).pipe(process.stderr);
    childProcess.once('spawn', async () => {
      server = await attachWebUI(webui);
    });

    await childProcess;
    server?.close();

    cancelDeath();
  }

  if (childProcess.exitCode !== 0) {
    process.exit(childProcess.exitCode);
  } else if (childProcess.signal !== undefined) {
    process.kill(childProcess.signal);
  }
} catch (error) {
  if (DEBUG) {
    console.error(error);
  }

  server?.close();
  process.exit(process.exitCode ?? 1);
}

async function getPackage() {
  return JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
}

function sleep(time = 1000) {
  return new Promise((res) => {
    setTimeout(() => res(), time);
  });
}

/**
 * @param {string[]} args
 */
function resolveCliArgs(args) {
  if (args[0] === '--') {
    args = args.slice(1);
  }

  const aria2 = [];
  const webui = {
    enable: false,
    open: true,
    port: 6801,
    rpc: undefined
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    const resolveBoolean = () => {
      const enable = (arg.split('=').at(1) ?? 'true').toLowerCase();
      return ['true', 'yes', 'on', 't', 'y'].includes(enable);
    };

    if (arg.startsWith('--ui')) {
      webui.enable = resolveBoolean();
    } else if (arg.startsWith('--open')) {
      webui.open = resolveBoolean();
    } else if (arg.startsWith('--no-open')) {
      webui.open = !resolveBoolean();
    } else if (arg.startsWith('--port')) {
      let port = arg.split('=').at(1);
      if (port === undefined && i + 1 < args.length && /^\d+$/.test(args[i + 1])) {
        port = args[++i];
      }
      if (port) {
        webui.port = +port;
      }
    } else {
      aria2.push(arg);
    }
  }

  if (webui.enable) {
    const rpc = {
      port: 6800,
      secret: '123456'
    };
    const missing = {
      enable: true,
      cors: true,
      port: true,
      secret: true
    };

    for (let i = 0; i < aria2.length; i++) {
      const arg = aria2[i];

      const fixBoolean = (opt) => {
        const enable = arg.split('=').at(1);
        if (enable !== undefined) {
          if (enable.toLowerCase() !== 'true') {
            aria2[i] = opt;
          }
        } else {
          if (i + 1 < aria2.length && aria2[i + 1].toLowerCase() === 'false') {
            aria2[i + 1] = 'true';
          }
        }
      };

      const readString = () => {
        const text = arg.split('=').slice(1).join('=');
        if (text) {
          return text;
        }
        return aria2[i + 1] ?? '';
      };

      if (arg.startsWith('--enable-rpc')) {
        missing.enable = false;
        fixBoolean(`--enable-rpc=true`);
      } else if (arg.startsWith('--rpc-allow-origin-all')) {
        missing.cors = false;
        fixBoolean(`--rpc-allow-origin-all=true`);
      } else if (arg.startsWith('--rpc-listen-port')) {
        missing.port = false;
        rpc.port = +readString();
      } else if (arg.startsWith('--rpc-secret')) {
        missing.secret = false;
        rpc.secret = readString();
      }
    }

    webui.rpc = rpc;
    if (missing.enable) {
      aria2.push('--enable-rpc');
    }
    if (missing.cors) {
      aria2.push('--rpc-allow-origin-all');
    }
    if (missing.secret) {
      aria2.push(`--rpc-secret=${rpc.secret}`);
    }
  }

  return {
    aria2,
    webui,
    debug: process.env.DEBUG === 'naria2' || process.env.DEBUG === 'naria2c'
  };
}

async function attachWebUI(options) {
  if (!options.enable) {
    return undefined;
  }

  const { launchWebUI } = await import('@naria2/node/ui');
  const server = await launchWebUI(options);

  const link = `http://127.0.0.1:${options.port}?port=${options.rpc.port}&secret=${options.rpc.secret}`;
  {
    const now = new Date();
    const date = `${padStart(now.getMonth() + 1)}/${padStart(now.getDate())}`;
    const time = `${padStart(now.getHours())}:${padStart(now.getMinutes())}:${padStart(
      now.getSeconds()
    )}`;

    console.log(`${date} ${time} [${bold(green('NOTICE'))}] Web UI is running on the ${link}`);

    function padStart(str) {
      return String(str).padStart(2, '0');
    }
  }

  if (options.open) {
    const open = (await import('open')).default;
    await open(link);
  }

  return server;
}
