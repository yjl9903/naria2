import { defineBasicGlobal, defineBasicInput, defineRPC } from './types';

export type { Resolver } from './types';

const resolveBoolean = (flag: boolean | undefined) =>
  typeof flag === 'boolean' ? (flag ? 'true' : 'false') : undefined;
const resolveString = (str: string | undefined) => (typeof str === 'string' ? str : undefined);
const resolveNumber = (num: number | undefined) => {
  return typeof num === 'number' ? '' + num : undefined;
};

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
