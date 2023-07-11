import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

import { BINARY } from './src/binding.mjs';

const require = createRequire(import.meta.url);

async function validate() {
  const pkg = require.resolve(BINARY + '/package.json');
  const { platform } = process;
  const binary = path.join(path.dirname(pkg), platform === 'win32' ? 'aria2c.exe' : 'aria2c');
  if (fs.existsSync(binary)) {
    return true;
  } else {
    throw new Error(`${binary} is not found`);
  }
}

validate();
