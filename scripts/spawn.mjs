import { createChildProcess } from '@naria2/node';

async function main() {
  const socket = await createChildProcess({ spawn: { stdio: 'inherit' } });
  try {
    await new Promise((res, rej) => {
      socket.addEventListener('open', () => res(undefined));
      socket.addEventListener('error', (e) => rej(e));
    });
    console.log('Connect OK');
  } catch (err) {
    console.error(err);
  } finally {
    socket.close();
  }
}

main();
