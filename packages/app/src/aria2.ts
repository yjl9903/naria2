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
    const tries = [
      {
        port: search.get('port'),
        secret: search.get('secret')
      }
    ];
    if (window.localStorage.getItem('naria2/connection')) {
      try {
        const options = JSON.parse(
          window.localStorage.getItem('naria2/connection') ?? 'null'
        ) as ConnectionOptions | null;
        if (options) {
          tries.push(options as any);
        }
      } catch {}
    }

    for (const opt of tries) {
      const url = opt.port ? `ws://127.0.0.1:${opt.port}/jsonrpc` : `ws://${location.host}/jsonrpc`;
      const client = await createClient(new WebSocket(url), {
        secret: opt.secret ?? undefined
      }).catch(() => undefined);

      if (client) {
        window.localStorage.setItem(
          'naria2/connection',
          JSON.stringify({ port: opt.port, secret: opt.secret })
        );
        return client;
      }
    }
  }
}
