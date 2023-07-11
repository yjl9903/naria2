import path from 'node:path';
import { createRequire } from 'node:module';
import { execa, Options as ExecaOptions, ExecaError } from 'execa';

// @ts-expect-error
import { BINARY } from './binding.mjs';

const require = createRequire(import.meta.url);

export function run(args: string[], options: ExecaOptions & { binary?: string } = {}) {
  if (!options.binary) {
    const pkg = require.resolve(BINARY + '/package.json');
    const { platform } = process;
    const binary = path.join(path.dirname(pkg), platform === 'win32' ? 'aria2c.exe' : 'aria2c');
    return execa(binary, args, options);
  } else {
    const binary = options.binary;
    delete options['binary'];
    return execa(binary, args, options);
  }
}

export type Naria2Error = ExecaError;
