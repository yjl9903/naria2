import type { PartialDeep } from 'type-fest';
import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type {
  Aria2GlobalOptions,
  Aria2RPCOptions,
  Aria2InputOptions,
  Aria2ProxyOptions,
  Aria2RPCOptionsKey,
  Aria2BasicInputOptions,
  Aria2BasicGlobalOptions,
  Aria2BtInputOptions,
  Aria2BtGlobalOptions,
  Aria2BtGlobalOptionsKey
} from '../types';

import { resolveArray, isDef } from '../utils';
import {
  BasicGlobalResolvers,
  BasicInputResolvers,
  BtGlobalResolvers,
  BtInputResolvers,
  RPCResolvers,
  Resolver
} from './resolver';

export function resolveProxyOptions(
  options?: PartialDeep<Aria2ProxyOptions>
): Partial<Record<Aria2ClientInputOptionKey, string>> {
  if (typeof options === 'string') {
    return {
      'all-proxy': options
    };
  } else if (typeof options === 'object') {
    if ('proxy' in options) {
      return {
        'all-proxy': options.proxy,
        'all-proxy-user': options.user,
        'all-proxy-passwd': options.passwd,
        'no-proxy': isDef(options.no) ? resolveArray(options.no).join(',') : undefined,
        'proxy-method': options.method
      };
    } else {
      const all: Partial<Record<Aria2ClientInputOptionKey, string>> =
        'all' in options
          ? typeof options.all === 'string'
            ? { 'all-proxy': options.all }
            : {
                'all-proxy': options.all?.proxy,
                'all-proxy-user': options.all?.user,
                'all-proxy-passwd': options.all?.passwd
              }
          : {};
      const http: Partial<Record<Aria2ClientInputOptionKey, string>> =
        'http' in options
          ? typeof options.http === 'string'
            ? { 'http-proxy': options.http }
            : {
                'http-proxy': options.http?.proxy,
                'http-proxy-user': options.http?.user,
                'http-proxy-passwd': options.http?.passwd
              }
          : {};
      const https: Partial<Record<Aria2ClientInputOptionKey, string>> =
        'https' in options
          ? typeof options.https === 'string'
            ? { 'https-proxy': options.https }
            : {
                'https-proxy': options.https?.proxy,
                'https-proxy-user': options.https?.user,
                'https-proxy-passwd': options.https?.passwd
              }
          : {};
      const ftp: Partial<Record<Aria2ClientInputOptionKey, string>> =
        'ftp' in options
          ? typeof options.ftp === 'string'
            ? { 'ftp-proxy': options.ftp }
            : {
                'ftp-proxy': options.ftp?.proxy,
                'ftp-proxy-user': options.ftp?.user,
                'ftp-proxy-passwd': options.ftp?.passwd
              }
          : {};

      return {
        ...all,
        ...http,
        ...https,
        ...ftp,
        'no-proxy': isDef(options.no) ? resolveArray(options.no).join(',') : undefined,
        'proxy-method': options.method
      };
    }
  } else {
    return {};
  }
}

function useResolver<T extends {}, K extends string>(
  resolvers: Record<string, Resolver<K, T, keyof T>>
) {
  return (options?: PartialDeep<T>): Partial<Record<K, string>> => {
    const result: Partial<Record<K, string>> = {};
    Object.entries(options ?? {}).forEach(([k, v]) => {
      if (k in resolvers) {
        const resolver = resolvers[k];
        const resolved = resolver.resolve(v);
        if (resolved !== undefined && resolved !== null) {
          result[resolver.option] = resolved;
        }
      }
    });
    return result;
  };
}

export const resolveRPCOptions: (
  options?: PartialDeep<Aria2RPCOptions>
) => Partial<Record<Aria2RPCOptionsKey, string>> = useResolver(RPCResolvers);

const resolveBasicInputOptions: (
  options?: PartialDeep<Aria2BasicInputOptions>
) => Partial<Record<Aria2ClientInputOptionKey, string>> = useResolver(BasicInputResolvers);

const resolveBtInputOptions: (
  options?: PartialDeep<Aria2BtInputOptions>
) => Partial<Record<Aria2ClientInputOptionKey, string | string[]>> = useResolver(BtInputResolvers);

const resolveBasicGlobalOptions: (
  options?: PartialDeep<Aria2BasicGlobalOptions>
) => Partial<Record<Aria2ClientInputOptionKey, string>> = useResolver(BasicGlobalResolvers);

const resolveBtGlobalOptions: (
  options?: PartialDeep<Aria2BtGlobalOptions>
) => Partial<Record<Aria2BtGlobalOptionsKey, string | string[]>> = useResolver(BtGlobalResolvers);

export function resolveInputOptions(
  options: PartialDeep<Aria2InputOptions>
): Partial<Record<Aria2ClientInputOptionKey, string | string[]>> {
  return {
    ...('proxy' in options ? resolveProxyOptions(options.proxy) : {}),
    ...resolveBasicInputOptions(options),
    ...resolveBtInputOptions(options.bt)
  };
}

export function resolveGlobalOptions(
  options: PartialDeep<Aria2GlobalOptions>
): Partial<Record<Aria2ClientInputOptionKey & Aria2ClientGlobalOptionKey, string | string[]>> {
  return {
    ...('proxy' in options ? resolveProxyOptions(options.proxy) : {}),
    ...resolveBasicInputOptions(options),
    ...resolveBasicGlobalOptions(options),
    ...resolveBtInputOptions(options.bt),
    ...resolveBtGlobalOptions(options.bt)
  };
}
