#!/usr/bin/env node

import { Transform } from 'stream';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

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
    childProcess.kill(signal);

    await Promise.race([
      new Promise((res) => {
        if (childProcess.exitCode !== null) {
          res();
        }
        childProcess.once('exit', () => {
          res();
        });
      }),
      sleep(5000)
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
    port: 6801
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--ui')) {
      const enable = (arg.split('=').at(1) ?? 'true').toLowerCase();
      webui.enable = ['true', 'yes', 'on', 't', 'y'].includes(enable);
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

  const serveStatic = (await import('serve-static')).default;
  const finalhandler = (await import('finalhandler')).default;
  const http = await import('http');

  const clientDir = fileURLToPath(new URL('./client', import.meta.url));
  const serve = serveStatic(clientDir, { index: ['index.html'] });
  const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(options.port);

  {
    const now = new Date();
    const date = `${padStart(now.getMonth() + 1)}/${padStart(now.getDate())}`;
    const time = `${padStart(now.getHours())}:${padStart(now.getMinutes())}:${padStart(
      now.getSeconds()
    )}`;
    console.log(
      `${date} ${time} [${bold(green('NOTICE'))}] WebUI is listening on the http://127.0.0.1:${
        options.port
      }`
    );

    function padStart(str) {
      return String(str).padStart(2, '0');
    }
  }

  return server;
}
