import type { Readable, Writable } from 'node:stream';

import path from 'node:path';
import {
  spawn as rawSpawn,
  SpawnOptions,
  ChildProcess,
  SpawnOptionsWithoutStdio,
  ChildProcessWithoutNullStreams,
  SpawnOptionsWithStdioTuple,
  StdioPipe,
  ChildProcessByStdio,
  StdioNull
} from 'node:child_process';
import { createRequire } from 'node:module';
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

export function spawn(
  args: ReadonlyArray<string>,
  options?: SpawnOptionsWithoutStdio
): ChildProcessWithoutNullStreams;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
): ChildProcessByStdio<Writable, Readable, Readable>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
): ChildProcessByStdio<Writable, Readable, null>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
): ChildProcessByStdio<Writable, null, Readable>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
): ChildProcessByStdio<null, Readable, Readable>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
): ChildProcessByStdio<Writable, null, null>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
): ChildProcessByStdio<null, Readable, null>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
): ChildProcessByStdio<null, null, Readable>;
export function spawn(
  args: ReadonlyArray<string>,
  options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
): ChildProcessByStdio<null, null, null>;
export function spawn(args: ReadonlyArray<string>, options: SpawnOptions): ChildProcess;
export function spawn(args: ReadonlyArray<string>, options?: SpawnOptions) {
  const binary = getBinary();
  return rawSpawn(binary, args, options ?? {});
}

export type Naria2Error = ExecaError;
