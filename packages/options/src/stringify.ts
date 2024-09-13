import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type { Prettify } from './utils';
import type { Aria2RPCOptionsKey } from './types';

export function stringifyCliOptions(
  options: Prettify<
    Partial<Record<Aria2ClientInputOptionKey & Aria2ClientGlobalOptionKey, string | string[]>> &
      Partial<Record<Aria2RPCOptionsKey, string | string[]>>
  >
) {
  return Object.entries({ ...options }).flatMap(([k, v]) => {
    if (Array.isArray(v)) {
      return v.map((v) => `--${k}=${v}`);
    } else {
      return [`--${k}=${v}`];
    }
  });
}
