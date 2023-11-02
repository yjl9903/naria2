import { create } from 'zustand';
import { client as debugClient } from '~naria2/jsonrpc';

import { type Aria2Client, createClient } from 'naria2';

interface ConnectionOptions {
  host?: string;

  port?: string | number;

  secret?: string;
}

interface Aria2State {
  client: Aria2Client | undefined;

  connect: (conn: ConnectionOptions) => Promise<Aria2Client | undefined>;

  clear: () => void;
}

const client = await inferClient();

export const useAria2 = create<Aria2State>()((set, get) => ({
  client,
  clear: () => {
    set({ client: undefined });
  },
  connect: async (options: ConnectionOptions) => {
    try {
      {
        // Close old client
        const oldClient = get().client;
        if (oldClient) {
          oldClient.close();
          set({ client: undefined });
        }
      }

      const url = `ws://${options.host ?? '127.0.0.1'}${
        options.port ? ':' + options.port : ''
      }/jsonrpc`;
      const client = await createClient(new WebSocket(url), {
        secret: options.secret
      }).catch(() => undefined);
      if (client && (await client.version())) {
        window.localStorage.setItem(
          'naria2/connection',
          JSON.stringify({ port: options.port, secret: options.secret })
        );
        set({ client });

        return client;
      }
      return undefined;
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

      if (client && (await client.version().catch(() => undefined))) {
        window.localStorage.setItem(
          'naria2/connection',
          JSON.stringify({ port: opt.port, secret: opt.secret })
        );
        return client;
      }
    }
  }
}
