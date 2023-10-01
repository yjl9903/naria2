#!/usr/bin/env node

import { readFile } from 'fs/promises';

import { run } from '@naria2/node';
import { onDeath } from '@breadc/death';

try {
  const args = process.argv.slice(2);
  const childProcess = run(args);

  onDeath((signal) => {
    childProcess.kill(signal);
  });

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

    const banner = `naria2c/${version}`;
    console.log(banner);
    console.log('-'.repeat(banner.length));
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
  if (error.message) {
    console.log(error.message);
  }
  if (process.env.DEBUG === 'naria2' || process.env.DEBUG === 'naria2c') {
    console.error(error);
  }
  process.exit(process.exitCode ?? 1);
}

async function getPackage() {
  return JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
}
