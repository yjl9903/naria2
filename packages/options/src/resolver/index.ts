import type { PartialDeep } from 'type-fest';
import type { Aria2ClientInputOptionKey } from 'maria2';

import type {
  Aria2Options,
  Aria2ProxyOptions,
  Aria2RPCOptionsKey,
  Aria2RPCOptions
} from '../types';

import { resolveArray, isDef } from '../utils';

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

export function resolveRPCOptions(
  options?: PartialDeep<Aria2RPCOptions>
): Partial<Record<Aria2RPCOptionsKey, string>> {
  return {};
}

export function resolveOptions(
  options: PartialDeep<Aria2Options>
): Partial<Record<Aria2ClientInputOptionKey, string>> {
  return {
    ...('proxy' in options ? resolveProxyOptions(options.proxy) : {})
  };
}
