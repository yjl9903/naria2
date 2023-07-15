import type { Aria2RPCOptionsKey, Aria2RPCOptions } from '../types';

export interface Resolver<O extends string, T extends {}, F extends keyof T = keyof T> {
  field: F;

  option: O;

  resolve: (value: T[F]) => string;
}

function defineResolver<O extends string, T extends {}, F extends keyof T>(
  field: F,
  option: O,
  resolve: (value: T[F]) => string
): Resolver<O, T, F> {
  return {
    field,
    option,
    resolve
  };
}

const resolveBoolean = (flag: boolean) => (flag ? 'true' : 'false');
const resolveString = (str: string) => str;
const resolveNumber = (num: number) => '' + num;

export const RPCResolvers = [
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'pause'>('pause', 'pause', resolveBoolean),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'pauseMetadata'>(
    'pauseMetadata',
    'pause-metadata',
    resolveBoolean
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'allowOriginAll'>(
    'allowOriginAll',
    'rpc-allow-origin-all',
    resolveBoolean
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'certificate'>(
    'certificate',
    'rpc-certificate',
    resolveString
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'listenAll'>(
    'listenAll',
    'rpc-listen-all',
    resolveBoolean
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'listenPort'>(
    'listenPort',
    'rpc-listen-port',
    resolveNumber
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'maxRequestSize'>(
    'maxRequestSize',
    'rpc-max-request-size',
    resolveString
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'privateKey'>(
    'privateKey',
    'rpc-private-key',
    resolveString
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'saveUploadMetadata'>(
    'saveUploadMetadata',
    'rpc-save-upload-metadata',
    resolveBoolean
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'secret'>(
    'secret',
    'rpc-secret',
    resolveString
  ),
  defineResolver<Aria2RPCOptionsKey, Aria2RPCOptions, 'secure'>(
    'secure',
    'rpc-secure',
    resolveBoolean
  )
];
