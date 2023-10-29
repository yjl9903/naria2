import { create } from 'zustand';
import { client as debugClient } from '~naria2/jsonrpc';

import { type Aria2Client, createClient } from 'naria2';

interface ConnectionOptions {
  port: string | number;

  secret: string;
}

interface Aria2State {
  client: Aria2Client | undefined;

  connect: (conn: ConnectionOptions) => Promise<Aria2Client | undefined>;
}

const client = await inferClient();

export const useAria2 = create<Aria2State>()((set) => ({
  client,
  connect: async (options: ConnectionOptions) => {
    try {
      const client = await createClient(new WebSocket(`ws://127.0.0.1:${options.port}/jsonrpc`), {
        secret: options.secret
      });
      set({ client });
      return client;
    } catch (error) {
      return undefined;
    }
  }
}));

async function inferClient() {
  if (debugClient) {
    return debugClient;
  } else {
    const search = new URLSearchParams(location.search);
    const rpcPort = search.get('port') ?? '6800';
    const rpcSecret = search.get('secret');
    if (rpcPort && rpcSecret) {
      const client = await createClient(new WebSocket(`ws://127.0.0.1:${rpcPort}/jsonrpc`), {
        secret: rpcSecret
      });
      window.localStorage.setItem(
        'naria2/connection',
        JSON.stringify({ port: rpcPort, secret: rpcSecret })
      );
      return client;
    }

    {
      const options = JSON.parse(
        window.localStorage.getItem('naria2/connection') ?? 'null'
      ) as ConnectionOptions | null;
      if (options?.port && options.secret) {
        const client = await createClient(new WebSocket(`ws://127.0.0.1:${options.port}/jsonrpc`), {
          secret: options.secret
        });
        return client;
      }
    }
  }
}
