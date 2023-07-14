#!/usr/bin/env node

import { run } from '@naria2/node';
import { readFile } from 'fs/promises';

try {
  const args = process.argv.slice(2);
  const childProcess = run(args);

  if (args.includes('-h') || args.includes('--help')) {
    const result = await childProcess;
    const help = result.stdout.replace(/aria2c/g, 'naria2c');
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log();
    console.log(`naria2c is a cross-platform wrapper of aria2c.`);
    console.log();
    console.log(help);
  } else if (args.includes('-v') || args.includes('--version')) {
    const result = await childProcess;
    const content = result.stdout;
    const { version } = await getPackage();

    console.log(`naria2c/${version}`);
    console.log(`--------------------`);
    console.log(content);
  } else {
    childProcess.pipeStdout(process.stdout);
    childProcess.pipeStderr(process.stderr);
    await childProcess;
  }

  if (childProcess.exitCode !== 0) {
    process.exit(childProcess.exitCode);
  } else if (childProcess.signal !== undefined) {
    process.kill(childProcess.signal);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}

async function getPackage() {
  return JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
}
