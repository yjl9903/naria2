import { open } from 'maria2';
import { createChildProcess } from '@naria2/node';

async function main() {
  const socket = await createChildProcess({ spawn: { stdio: 'inherit' } });
  try {
    await open(socket, { openTimeout: 10 * 1000 });
    console.log('Connect OK');
  } catch (err) {
    console.error('Failed connecting to aria2:', err);
  } finally {
    socket.close();
  }
}

main();
