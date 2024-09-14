import WebTorrent from 'webtorrent';

import getPort from 'get-port';

// @ts-ignore
import { Server } from 'bittorrent-tracker';

const server = new Server({
  udp: false, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true, // enable web-based statistics? [default=true]
  trustProxy: false // enable trusting x-forwarded-for header for remote IP [default=false]
});

const hostname = '127.0.0.1';
const port = await getPort();

server.listen(port, hostname, () => {});

server.on('listening', function () {
  // HTTP
  const httpAddr = server.http.address();
  const httpHost = httpAddr.address !== '::' ? httpAddr.address : 'localhost';
  const httpPort = httpAddr.port;
  // console.log(`HTTP tracker: http://${httpHost}:${httpPort}/announce`);

  // WS
  const wsAddr = server.ws.address();
  const wsHost = wsAddr.address !== '::' ? wsAddr.address : 'localhost';
  const wsPort = wsAddr.port;
  // console.log(`WebSocket tracker: ws://${wsHost}:${wsPort}`);
});

export const Tracker = `http://127.0.0.1:${port}/announce`;

export function makeSeed(filePath: string) {
  const client = new WebTorrent();

  return new Promise<string>((res, rej) => {
    client.seed(filePath, { announce: [Tracker] }, function (torrent) {
      res(torrent.magnetURI);
    });
  });
}
