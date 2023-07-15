import type { Aria2RPCOptionsKey, Aria2RPCOptions } from '../types';

export interface Resolver<O extends string, T extends {}, F extends keyof T = keyof T> {
  field: F;

  option: O;

  resolve: (value: any) => string | undefined;
}

const resolveBoolean = (flag: boolean) =>
  typeof flag === 'boolean' ? (flag ? 'true' : 'false') : undefined;
const resolveString = (str: string) => (typeof str === 'string' ? str : undefined);
const resolveNumber = (num: number) => {
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
