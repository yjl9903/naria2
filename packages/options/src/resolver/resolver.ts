import { defineBasicGlobal, defineBasicInput, defineBtInput, defineRPC } from './types';

export type { Resolver } from './types';

const resolveBoolean = (flag: boolean | undefined) =>
  typeof flag === 'boolean' ? (flag ? 'true' : 'false') : undefined;
const resolveString = (str: string | undefined) => (typeof str === 'string' ? str : undefined);
const resolveNumber = (num: number | undefined) => {
  return typeof num === 'number' ? '' + num : undefined;
};
const resolveStringArray = (arr: string[] | undefined, split = ',') => {
  return Array.isArray(arr) ? arr.join(split) : undefined;
};
const resolveEnums =
  <T extends string>(enums: T[]) =>
  (str: string | undefined): T | undefined =>
    typeof str === 'string' && enums.includes(str as T) ? (str as T) : undefined;
const resolveSize = (str: string | undefined) => {
  return typeof str === 'string' && /^(\d+)[KM]?$/.test(str) ? str : undefined;
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

export const BtInputResolvers = Object.fromEntries(
  [
    defineBtInput<'enableLpd'>('enableLpd', 'bt-enable-lpd', resolveBoolean),
    defineBtInput<'excludeTracker'>('excludeTracker', 'bt-exclude-tracker', resolveStringArray),
    defineBtInput<'externalIp'>('externalIp', 'bt-external-ip', resolveString),
    defineBtInput<'forceEncryption'>('forceEncryption', 'bt-force-encryption', resolveBoolean),
    defineBtInput<'hashCheckSeed'>('hashCheckSeed', 'bt-hash-check-seed', resolveBoolean),
    defineBtInput<'loadSavedMetadata'>(
      'loadSavedMetadata',
      'bt-load-saved-metadata',
      resolveBoolean
    ),
    defineBtInput<'maxPeers'>('maxPeers', 'bt-max-peers', resolveNumber),
    defineBtInput<'metadataOnly'>('metadataOnly', 'bt-metadata-only', resolveBoolean),
    defineBtInput<'minCryptoLevel'>(
      'minCryptoLevel',
      'bt-min-crypto-level',
      resolveEnums(['plain', 'arc4'])
    ),
    defineBtInput<'prioritizePiece'>('prioritizePiece', 'bt-prioritize-piece', (input) => {
      if (input !== undefined) {
        const head = resolveSize(input.head) ?? '1M';
        const tail = resolveSize(input.tail) ?? '1M';
        return `head=${head},tail=${tail}`;
      }
      return undefined;
    }),
    defineBtInput<'removeUnselectedFile'>(
      'removeUnselectedFile',
      'bt-remove-unselected-file',
      resolveBoolean
    ),
    defineBtInput<'requireCrypto'>('requireCrypto', 'bt-require-crypto', resolveBoolean),
    defineBtInput<'requestPeerSpeedLimit'>(
      'requestPeerSpeedLimit',
      'bt-request-peer-speed-limit',
      resolveSize
    ),
    defineBtInput<'saveMetadata'>('saveMetadata', 'bt-save-metadata', resolveBoolean),
    defineBtInput<'seedUnverified'>('seedUnverified', 'bt-seed-unverified', resolveBoolean),
    defineBtInput<'stopTimeout'>('stopTimeout', 'bt-stop-timeout', resolveNumber),
    defineBtInput<'tracker'>('tracker', 'bt-tracker', resolveStringArray),
    defineBtInput<'trackerConnectTimeout'>(
      'trackerConnectTimeout',
      'bt-tracker-connect-timeout',
      resolveNumber
    ),
    defineBtInput<'trackerInterval'>('trackerInterval', 'bt-tracker-interval', resolveNumber),
    defineBtInput<'trackerTimeout'>('trackerTimeout', 'bt-tracker-timeout', resolveNumber),
    defineBtInput<'enablePeerExchange'>(
      'enablePeerExchange',
      'enable-peer-exchange',
      resolveBoolean
    ),
    defineBtInput<'followTorrent'>('followTorrent', 'follow-torrent', (str) => {
      if (str === 'mem') return 'mem';
      else return typeof str === 'boolean' ? (str ? 'true' : 'false') : undefined;
    })
    // defineBtInput<'indexOut'>('indexOut', 'index-out', (obj) => {
    //   return undefined;
    // })
  ].map((r) => [r.field, r])
);
