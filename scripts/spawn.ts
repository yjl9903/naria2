import { createSubprocess } from '../packages/naria2/src';

async function bootstrap() {
  try {
    const socket = await createSubprocess({ spawn: { stdio: 'inherit' } });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
