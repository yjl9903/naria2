import { createClient } from '../packages/naria2/src';
import { createChildProcess } from '../packages/node/src';

const client = await createClient(createChildProcess());

console.log('aria2:', await client.getVersion());
