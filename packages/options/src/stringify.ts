import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type { Aria2RPCOptionsKey } from './types';

// See https://twitter.com/mattpocockuk/status/1622730173446557697
// export type Identity<T> = T;
// type Prettify<T> = Identity<{ [K in keyof T]: T[K] }>
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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
