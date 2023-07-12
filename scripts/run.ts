import { run } from '../packages/node/src';

async function bootstrap() {
  try {
    await run(['--help'], { stdio: 'inherit' });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
