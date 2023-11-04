import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type {
  Aria2RPCOptionsKey,
  Aria2RPCOptions,
  Aria2BasicInputOptions,
  Aria2BasicGlobalOptions,
  Aria2BtInputOptions,
  Aria2BtGlobalOptions,
  Aria2BtGlobalOptionsKey,
  Aria2DhtGlobalOptions,
  Aria2DhtGlobalOptionsKey
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

export function defineBtGlobal<F extends keyof Aria2BtGlobalOptions>(
  field: F,
  option: Aria2BtGlobalOptionsKey,
  resolve: (value: Aria2BtGlobalOptions[F]) => OptionValueType<F> | undefined
): Resolver<Aria2BtGlobalOptionsKey, Aria2BtGlobalOptions, F> {
  return {
    field,
    option,
    resolve
  };
}

export function defineDhtGlobal<F extends keyof Aria2DhtGlobalOptions>(
  field: F,
  option: Aria2DhtGlobalOptionsKey,
  resolve: (value: Aria2DhtGlobalOptions[F]) => OptionValueType<F> | undefined
): Resolver<Aria2DhtGlobalOptionsKey, Aria2DhtGlobalOptions, F> {
  return {
    field,
    option,
    resolve
  };
}
