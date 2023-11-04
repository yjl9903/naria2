import { create } from 'zustand';

import { type Aria2Client, createClient, Task } from 'naria2';

import { client as debugClient } from '~naria2/jsonrpc';

interface ConnectionOptions {
  host?: string;

  port?: string | number;

  secret?: string;
}

interface Aria2State {
  client: Aria2Client | undefined;

  connect: (conn: ConnectionOptions) => Promise<Aria2Client | undefined>;

  clear: () => void;

  downloadUri: (uris: string, options?: Parameters<Aria2Client['downloadUri']>[1]) => Promise<Task>;
}

const client = await inferClient();
// @ts-ignore
window.__client = client;

export const useAria2 = create<Aria2State>()((set, get) => ({
  client,
  clear: () => {
    set({ client: undefined });
  },
  connect: async (options: ConnectionOptions) => {
    try {
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
        set((state) => {
          // Close old client
          if (state.client) {
            state.client.close();
          }

          // @ts-ignore
          window.__client = client;

          return { client };
        });

        return client;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  },
  async downloadUri(text: string, options) {
    const client = get().client;
    if (!client) throw new Error('client is not connected');

    const isSupport = (text: string) => {
      return /^magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i.test(text);
    };
    const uris = text
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter(isSupport);
    if (uris.length === 0) {
      throw new Error('No input');
    }

    return await client.downloadUri(uris, options);
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
