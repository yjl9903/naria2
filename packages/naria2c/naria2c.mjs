#!/usr/bin/env node

import { run } from '@naria2/node';
import { readFile } from 'fs/promises';

try {
  const args = process.argv.slice(2);
  const subprocess = run(args);

  if (args.includes('-h') || args.includes('--help')) {
    const result = await subprocess;
    const help = result.stdout.replace(/aria2c/g, 'naria2c');
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log();
    console.log(`naria2c is a cross-platform wrapper of aria2c.`);
    console.log();
    console.log(help);
  } else if (args.includes('-v') || args.includes('--version')) {
    const result = await subprocess;
    const content = result.stdout;
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log(`--------------------`);
    console.log(content);
  } else {
    subprocess.pipeStdout(process.stdout);
    subprocess.pipeStderr(process.stderr);
    await subprocess;
  }

  if (subprocess.exitCode !== 0) {
    process.exit(subprocess.exitCode);
  } else if (subprocess.signal !== undefined) {
    process.kill(subprocess.signal);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}

async function getPackage() {
  return JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
}
