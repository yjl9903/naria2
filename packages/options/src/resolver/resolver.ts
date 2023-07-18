import type { Aria2ClientGlobalOptionKey, Aria2ClientInputOptionKey } from 'maria2';

import type {
  Aria2RPCOptionsKey,
  Aria2RPCOptions,
  Aria2BasicInputOptions,
  Aria2BasicGlobalOptions
} from '../types';

export interface Resolver<O extends string, T extends {}, F extends keyof T = keyof T> {
  field: F;

  option: O;

  resolve: (value: any) => string | undefined;
}

const resolveBoolean = (flag: boolean | undefined) =>
  typeof flag === 'boolean' ? (flag ? 'true' : 'false') : undefined;
const resolveString = (str: string | undefined) => (typeof str === 'string' ? str : undefined);
const resolveNumber = (num: number | undefined) => {
  return typeof num === 'number' ? '' + num : undefined;
};

function defineRPC<F extends keyof Aria2RPCOptions>(
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

export const RPCResolvers = Object.fromEntries(
  [
    defineRPC<'pause'>('pause', 'pause', resolveBoolean),
    defineRPC<'pauseMetadata'>('pauseMetadata', 'pause-metadata', resolveBoolean),
    defineRPC<'allowOriginAll'>('allowOriginAll', 'rpc-allow-origin-all', resolveBoolean),
    defineRPC<'certificate'>('certificate', 'rpc-certificate', resolveString),
    defineRPC<'listenAll'>('listenAll', 'rpc-listen-all', resolveBoolean),
    defineRPC<'listenPort'>('listenPort', 'rpc-listen-port', resolveNumber),
    defineRPC<'maxRequestSize'>('maxRequestSize', 'rpc-max-request-size', resolveString),
    defineRPC<'privateKey'>('privateKey', 'rpc-private-key', resolveString),
    defineRPC<'saveUploadMetadata'>(
      'saveUploadMetadata',
      'rpc-save-upload-metadata',
      resolveBoolean
    ),
    defineRPC<'secret'>('secret', 'rpc-secret', resolveString),
    defineRPC<'secure'>('secure', 'rpc-secure', resolveBoolean)
  ].map((r) => [r.field, r])
);

export const BasicInputResolvers = Object.fromEntries(
  [
    defineBasicInput<'dir'>('dir', 'dir', resolveString),
    defineBasicInput<'checkIntegrity'>('checkIntegrity', 'check-integrity', resolveBoolean),
    defineBasicInput<'continue'>('continue', 'continue', resolveBoolean)
  ].map((r) => [r.field, r])
);

export const BasicGlobalResolvers = Object.fromEntries(
  [
    defineBasicGlobal<'log'>('log', 'log', resolveString),
    defineBasicGlobal<'maxConcurrentDownloads'>(
      'maxConcurrentDownloads',
      'max-concurrent-downloads',
      resolveNumber
    )
  ].map((r) => [r.field, r])
);

function defineBasicInput<F extends keyof Aria2BasicInputOptions>(
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

function defineBasicGlobal<F extends keyof Aria2BasicGlobalOptions>(
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
