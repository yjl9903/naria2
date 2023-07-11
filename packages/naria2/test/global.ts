import { webcrypto } from 'node:crypto';

import WebSocket from 'ws';
import { vi, beforeAll } from 'vitest';

beforeAll(() => {
  vi.stubGlobal('WebSocket', WebSocket);
  vi.stubGlobal('crypto', webcrypto);
});
