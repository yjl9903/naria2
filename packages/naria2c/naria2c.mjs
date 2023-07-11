#!/usr/bin/env node

import { run } from '@naria2/core';

try {
  const subprocess = await run(process.argv, { stdio: 'inherit' });
  if (subprocess.exitCode !== 0) {
    process.exit(subprocess.exitCode);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
