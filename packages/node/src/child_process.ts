import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn as rawSpawn, SpawnOptions } from 'node:child_process';

import { execa, Options as ExecaOptions, ExecaError } from 'execa';

// @ts-expect-error
import { BINARY } from './binding.mjs';

const require = createRequire(import.meta.url);

function getBinary() {
  const pkg = require.resolve(BINARY + '/package.json');
  const { platform } = process;
  const binary = path.join(path.dirname(pkg), platform === 'win32' ? 'aria2c.exe' : 'aria2c');
  return binary;
}

export function run(args: string[], options: ExecaOptions & { binary?: string } = {}) {
  if (!options.binary) {
    const binary = getBinary();
    return execa(binary, args, options);
  } else {
    const binary = options.binary;
    delete options['binary'];
    return execa(binary, args, options);
  }
}

export function spawn(args: ReadonlyArray<string>, options?: SpawnOptions & { binary?: string }) {
  const binary = options?.binary ?? getBinary();
  return rawSpawn(binary, args, options ?? {});
}

export type Naria2Error = ExecaError;
