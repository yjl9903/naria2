import { createSubprocess } from '@naria2/node';

async function bootstrap() {
  try {
    const socket = await createSubprocess({ spawn: { stdio: 'inherit' } });
    await new Promise((r) => socket.addEventListener('open', () => r(undefined)));
    console.log('Connect OK');
    socket.close();
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
