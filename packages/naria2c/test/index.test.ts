import { execa } from 'execa';
import { describe, it, expect } from 'vitest';

describe('naria2c', () => {
  it('should work', async () => {
    await execa('node', ['./narai2c.mjs', '--version']);
  });
});
