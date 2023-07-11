import { describe, it, expect } from 'vitest';

import { createSubprocess } from '../src';

describe('spawn aria2 subprocess', () => {
  it('should work', async () => {
    const conn = await createSubprocess();
    await new Promise((r) => conn.addEventListener('open', () => r(undefined)));
    conn.close();
  });
});
