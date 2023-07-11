import { createSubprocess } from 'naria2';

async function bootstrap() {
  try {
    const socket = await createSubprocess({ spawn: { stdio: 'inherit' } });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
