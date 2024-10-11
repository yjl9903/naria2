// Commands to run this example (ensure you have built this package):
// $ pnpm i && pnpm build
// $ node ./examples/magnet.mjs

import { SingleBar } from 'cli-progress';
import { createClient } from 'naria2';
import { attachWebUI } from '@naria2/node/ui';
import { createChildProcess } from '@naria2/node';

const magnet = `magnet:?xt=urn:btih:DWZF43GLQCL4ZNOGR4PRIJCBTANP76CG&dn=&tr=http%3A%2F%2F104.143.10.186%3A8000%2Fannounce&tr=udp%3A%2F%2F104.143.10.186%3A8000%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=http%3A%2F%2Ftracker3.itzmx.com%3A6961%2Fannounce&tr=http%3A%2F%2Ftracker4.itzmx.com%3A2710%2Fannounce&tr=http%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=http%3A%2F%2Ftracker.prq.to%2Fannounce&tr=http%3A%2F%2Fopen.acgtracker.com%3A1096%2Fannounce&tr=https%3A%2F%2Ft-115.rhcloud.com%2Fonly_for_ylbud&tr=http%3A%2F%2Ftracker1.itzmx.com%3A8080%2Fannounce&tr=http%3A%2F%2Ftracker2.itzmx.com%3A6961%2Fannounce&tr=udp%3A%2F%2Ftracker1.itzmx.com%3A8080%2Fannounce&tr=udp%3A%2F%2Ftracker2.itzmx.com%3A6961%2Fannounce&tr=udp%3A%2F%2Ftracker3.itzmx.com%3A6961%2Fannounce&tr=udp%3A%2F%2Ftracker4.itzmx.com%3A2710%2Fannounce&tr=http%3A%2F%2Ftr.bangumi.moe%3A6969%2Fannounce&tr=http%3A%2F%2Ft.nyaatracker.com%2Fannounce&tr=http%3A%2F%2Fopen.nyaatorrents.info%3A6544%2Fannounce&tr=http%3A%2F%2Ft2.popgo.org%3A7456%2Fannonce&tr=http%3A%2F%2Fshare.camoe.cn%3A8080%2Fannounce&tr=http%3A%2F%2Fopentracker.acgnx.se%2Fannounce&tr=http%3A%2F%2Ftracker.acgnx.se%2Fannounce&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=http%3A%2F%2Ftracker.kamigami.org%3A2710%2Fannounce&tr=http%3A%2F%2Fanidex.moe%3A6969%2Fannounce&tr=http%3A%2F%2Ft.acg.rip%3A6699%2Fannounce&tr=https%3A%2F%2Ftr.bangumi.moe%3A9696%2Fannounce&tr=https%3A%2F%2Fopentracker.i2p.rocks%3A443%2Fannounce&tr=https%3A%2F%2Ftracker.nanoha.org%3A443%2Fannounce&tr=https%3A%2F%2Ftracker.lilithraws.org%3A443%2Fannounce&tr=https%3A%2F%2Ftr.burnabyhighstar.com%3A443%2Fannounce`;

// Create a aria2 child process and initialize a client
const childprocess = createChildProcess({ rpc: {}, environment: 'ignore' });
const client = await createClient(childprocess);
const { url } = await attachWebUI(childprocess);

console.log(`Web UI: ${url}`);

// Start downloading a magnet
const torrent = await client.downloadUri(magnet);

// Watch its progress, and await for its completion
const bar = new SingleBar({});
bar.start(100, 0);
await torrent.watchTorrent(
  () => {},
  (task) => {
    bar.update(task.progress);
  },
  'bt-complete'
);
bar.stop();

console.log(`Download OK:`, torrent.followedBy?.bittorrent?.name);

// Close client
await client.shutdown();
