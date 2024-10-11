// Commands to run this example (ensure you have built this package):
// $ pnpm i && pnpm build
// $ node ./examples/torrent.mjs

import { SingleBar } from 'cli-progress';
import { createClient } from 'naria2';
import { attachWebUI } from '@naria2/node/ui';
import { createChildProcess, readTorrentSync } from '@naria2/node';

// Create a aria2 child process and initialize a client
const childprocess = createChildProcess({ rpc: {}, environment: 'ignore' });
const client = await createClient(childprocess);
const { url } = await attachWebUI(childprocess);

console.log(`Web UI: ${url}`);

// Start downloading a magnet
const torrent = await client.downloadTorrent(
  readTorrentSync(`./assets/9d37cf4eb76b4318913341d487a0a76f36067cec.torrent`)
);

// Watch its progress, and await for its completion
const bar = new SingleBar({});
bar.start(100, 0);
await torrent.watchTorrent(
  () => {},
  (task) => {
    bar.update(task.progress);
  }
);
bar.stop();

await torrent.updateStatus();
console.log(`Download OK:`, torrent.followedBy[0]);

// Close client
await client.shutdown();
