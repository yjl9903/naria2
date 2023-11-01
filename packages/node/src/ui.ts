import { fileURLToPath } from 'node:url';

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

  const clientDir = fileURLToPath(new URL('../client', import.meta.url));
  const serve = serveStatic(clientDir, { index: ['index.html'] });
  const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(options.port ?? 6801);

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
