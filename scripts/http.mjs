import { SingleBar } from 'cli-progress';
import { createClient } from 'naria2';
import { attachWebUI } from '@naria2/node/ui';
import { createChildProcess } from '@naria2/node';

const magnet = `https://cloudflare-ipfs.com/ipfs/QmYvVLJeW2FiTPtC19WWh7fnhZeMzMmK16QcBd6ervq7TD`;

// Create a aria2 child process and initialize a client
const childprocess = await createChildProcess({
  log: './aria2.log',
  rpc: { listenPort: 6800 },
  environment: 'ignore'
});
const client = await createClient(childprocess);
await attachWebUI(childprocess, { port: 6801 });

console.log(
  'Web UI: http://127.0.0.1:6801?port=6800&secret=' + childprocess.getOptions().secret + '\n'
);

// Start downloading a http
const download = await client.downloadUri(magnet);

// Watch its progress, and await for its completion
const bar = new SingleBar({});
bar.start(100, 0);
await download.watch((task) => {
  bar.update(task.progress);
});
bar.stop();

console.log(`Download OK:`, download.status.completedLength);

// Close client
await client.shutdown();
