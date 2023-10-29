#!/usr/bin/env node

import { Transform } from 'stream';
import { readFile } from 'fs/promises';

import { run } from '@naria2/node';
import { onDeath } from '@breadc/death';

try {
  const { aria2: args, webui, debug: DEBUG } = resolveCliArgs(process.argv.slice(2));
  if (DEBUG) {
    console.log(`Args: ${args.join(' ')}`);
  }

  const childProcess = run(args, { detached: true });

  const cancelDeath = onDeath((signal) => {
    childProcess.kill(signal);
  });

  if (args.includes('-h') || args.includes('--help')) {
    const result = await childProcess;
    const help = result.stdout.replace(/aria2c/g, 'naria2c');
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log();
    console.log(`naria2c is a cross-platform wrapper of aria2c.`);
    console.log();
    console.log(help);
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
    await childProcess;

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
  process.exit(process.exitCode ?? 1);
}

async function getPackage() {
  return JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
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

  const serveStatic = await import('serve-static');
  const finalhandler = await import('finalhandler');
  const http = await import('http');

  const clientDir = new URL('./client', import.meta.url);
  const serve = serveStatic(clientDir, { index: ['index.html'] });
  const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(options.port);

  return server;
}
