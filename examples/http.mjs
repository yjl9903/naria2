import { SingleBar } from 'cli-progress';
import { createClient } from 'naria2';
import { attachWebUI } from '@naria2/node/ui';
import { createChildProcess } from '@naria2/node';

const magnet = `https://cloudflare-ipfs.com/ipfs/QmYvVLJeW2FiTPtC19WWh7fnhZeMzMmK16QcBd6ervq7TD`;

// Create a aria2 child process and initialize a client
const childprocess = createChildProcess({ rpc: {}, environment: 'ignore' });
const client = await createClient(childprocess);
const { url } = await attachWebUI(childprocess);

console.log(`Web UI: ${url}`);

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
