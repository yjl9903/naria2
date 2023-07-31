import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type {
  Aria2RPCOptionsKey,
  Aria2RPCOptions,
  Aria2BasicInputOptions,
  Aria2BasicGlobalOptions,
  Aria2BtInputOptions
} from '../types';

type OptionValueType<O extends string> = O extends 'header' | 'index-out' | 'indexOut'
  ? string[]
  : string;

export interface Resolver<O extends string, T extends {}, F extends keyof T = keyof T> {
  field: F;

  option: O;

  resolve: (value: any) => OptionValueType<O> | undefined;
}

export function defineRPC<F extends keyof Aria2RPCOptions>(
  field: F,
  option: Aria2RPCOptionsKey,
  resolve: (value: Aria2RPCOptions[F]) => string | undefined
): Resolver<Aria2RPCOptionsKey, Aria2RPCOptions, F> {
  return {
    field,
    option,
    resolve
  };
}

export function defineBasicInput<F extends keyof Aria2BasicInputOptions>(
  field: F,
  option: Aria2ClientInputOptionKey,
  resolve: (value: Aria2BasicInputOptions[F]) => string | undefined
): Resolver<Aria2ClientInputOptionKey, Aria2BasicInputOptions, F> {
  return {
    field,
    option,
    resolve
  };
}

export function defineBasicGlobal<F extends keyof Aria2BasicGlobalOptions>(
  field: F,
  option: Aria2ClientGlobalOptionKey,
  resolve: (value: Aria2BasicGlobalOptions[F]) => string | undefined
): Resolver<Aria2ClientGlobalOptionKey, Aria2BasicGlobalOptions, F> {
  return {
    field,
    option,
    resolve
  };
}

export function defineBtInput<F extends keyof Aria2BtInputOptions>(
  field: F,
  option: Aria2ClientInputOptionKey,
  resolve: (value: Aria2BtInputOptions[F]) => OptionValueType<F> | undefined
): Resolver<Aria2ClientInputOptionKey, Aria2BtInputOptions, F> {
  return {
    field,
    option,
    resolve
  };
}
