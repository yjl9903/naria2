#!/usr/bin/env node

import { run } from '@naria2/node';

try {
  const subprocess = await run(process.argv.slice(2), { stdio: 'inherit' });

  if (subprocess.exitCode !== 0) {
    process.exit(subprocess.exitCode);
  } else if (subprocess.signal !== undefined) {
    process.kill(subprocess.signal);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
