import { execa } from 'execa';
import { describe, it, expect } from 'vitest';

import { version } from '../package.json';

describe('naria2c', () => {
  it('should output version', async () => {
    const result = await execa('node', ['./naria2c.mjs', '--version']);
    expect(result.stdout.split('\n')[0]).toBe(`naria2c/${version}`);
  });

  it('should output help', async () => {
    const result = await execa('node', ['./naria2c.mjs', '-h']);
    expect(result.stdout.split('\n')[0]).toBe(`naria2c/${version}`);
  });
});
