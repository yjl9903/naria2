import { createWebSocket } from 'maria2/transport';

// pnpm naria2c --enable-rpc=true --rpc-listen-all=true --rpc-allow-origin-all=true --rpc-listen-port=6800
async function main() {
  const socket = createWebSocket(`ws://localhost:6800/jsonrpc`);
  await new Promise((res, rej) => {
    socket.addEventListener('open', () => res(undefined));
  });
  console.log('Connect OK');
}

main();
