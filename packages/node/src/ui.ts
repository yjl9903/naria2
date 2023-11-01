import { fileURLToPath } from 'node:url';

export interface WebUIOptions {
  port: number;

  open: boolean;

  rpc: {
    port: number;

    secret: string;
  };
}

export async function attachWebUI(options: WebUIOptions) {
  const serveStatic = (await import('serve-static')).default;
  const finalhandler = (await import('finalhandler')).default;
  const http = await import('http');

  const clientDir = fileURLToPath(new URL('../client', import.meta.url));
  const serve = serveStatic(clientDir, { index: ['index.html'] });
  const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(options.port);

  return server;
}
