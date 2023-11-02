import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';

import type { ChildProcessSocket } from './transport';

export interface WebUIOptions {
  port?: number;

  rpc: {
    port: number;

    secret: string;
  };
}

export async function launchWebUI(options: WebUIOptions) {
  const serveStatic = (await import('serve-static')).default;
  const finalhandler = (await import('finalhandler')).default;
  const http = await import('http');

  const port = options.port ?? 6801;
  const clientDir = fileURLToPath(new URL('../client', import.meta.url));
  const serve = serveStatic(clientDir, { index: ['index.html'] });
  const server = http.createServer(async (req, res) => {
    if (req.url) {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (url.pathname === '/jsonrpc') {
          return;
        } else if (url.pathname === '/_/open') {
          const auth = req.headers.authorization;
          if (!options.rpc.secret || options.rpc.secret === auth) {
            res.statusCode = 400;
          } else {
            const dir = url.searchParams.get('dir');
            if (dir) {
              const open = (await import('open')).default;
              const p = decodeURIComponent(dir);
              const stat = await fs.stat(p);
              if (stat.isDirectory()) {
                await open(p).catch(() => {});
              } else {
                await open(path.dirname(p)).catch(() => {});
              }
            }
          }
          res.end();
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
    serve(req, res, finalhandler(req, res));
  });

  server.listen(port);

  return server;
}

export async function attachWebUI(
  process: ChildProcessSocket,
  options: Pick<WebUIOptions, 'port'> = {}
) {
  return await launchWebUI({
    port: options?.port ?? 6801,
    rpc: {
      port: process.getOptions().listenPort,
      secret: process.getOptions().secret
    }
  });
}
