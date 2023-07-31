import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type { Aria2RPCOptionsKey } from './types';

export function stringifyCliOptions(
  options: Partial<Record<Aria2ClientInputOptionKey & Aria2ClientGlobalOptionKey, string>> &
    Partial<Record<Aria2RPCOptionsKey, string>>
) {
  return Object.entries({ ...options }).flatMap(([k, v]) => {
    if (Array.isArray(v)) {
      return v.map((v) => `--${k}=${v}`);
    } else {
      return [`--${k}=${v}`];
    }
  });
}
