import type { ListenPorts } from '../types';

import {
  defineBasicGlobal,
  defineBasicInput,
  defineBtGlobal,
  defineBtInput,
  defineRPC
} from './types';

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

const resolveListenPorts = (strs: ListenPorts[] | undefined) => {
  if (!Array.isArray(strs)) return undefined;
  return strs
    .map((str) => {
      if (typeof str === 'number') {
        return '' + str;
      } else if (typeof str === 'string') {
        return str;
      } else if (Array.isArray(str) && str.length === 2) {
        return `${str[0]},${str[1]}`;
      }
    })
    .filter(Boolean)
    .join(',');
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
    }),
    defineBtInput<'indexOut'>('indexOut', 'index-out', (obj) => {
      const map = Object.entries(obj)
        .filter(([k, v]) => typeof k === 'string' && typeof v === 'string')
        .map(([k, v]) => `${k}=${v}`);
      return map.length > 0 ? map : undefined;
    }),
    defineBtInput<'maxUploadLimit'>('maxUploadLimit', 'max-upload-limit', resolveSize),
    defineBtInput<'seedRatio'>('seedRatio', 'seed-ratio', resolveString),
    defineBtInput<'seedTime'>('seedTime', 'seed-time', resolveString)
  ].map((r) => [r.field, r])
);

export const BtGlobalResolvers = Object.fromEntries(
  [
    defineBtGlobal<'detachSeedOnly'>('detachSeedOnly', 'bt-detach-seed-only', resolveBoolean),
    defineBtGlobal<'lpdInterface'>('lpdInterface', 'bt-lpd-interface', resolveString),
    defineBtGlobal<'maxOpenFiles'>('maxOpenFiles', 'bt-max-open-files', resolveNumber),
    defineBtGlobal<'listenPort'>('listenPort', 'listen-port', resolveListenPorts),
    defineBtGlobal<'maxOverallUploadLimit'>(
      'maxOverallUploadLimit',
      'max-overall-upload-limit',
      resolveSize
    ),
    defineBtGlobal<'peerIdPrefix'>('peerIdPrefix', 'peer-id-prefix', resolveString),
    defineBtGlobal<'peerAgent'>('peerAgent', 'peer-agent', resolveString)
  ].map((r) => [r.field, r])
);
