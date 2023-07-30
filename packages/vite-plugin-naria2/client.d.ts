declare module '~naria2/jsonrpc' {
  import { Aria2Client } from 'naria2';
  import { Socket } from 'maria2/transport';

  export const socket: Socket | undefined;

  export const client: Aria2Client | undefined;
}
