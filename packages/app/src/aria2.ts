import { create } from 'zustand';

import { type Aria2Client, createClient, Task } from 'naria2';

import { client as debugClient } from '~naria2/jsonrpc';

import { isMagnetURI } from './utils';

interface ConnectionOptions {
  secure?: boolean;

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
removeStartupLoading();

export const useAria2 = create<Aria2State>()((set, get) => ({
  client,
  clear: () => {
    set({ client: undefined });
  },
  connect: async (options: ConnectionOptions) => {
    try {
      const isSecure = location.protocol === 'https:' ? true : !!options.secure;
      const url = `${isSecure ? 'wss' : 'ws'}://${options.host ?? '127.0.0.1'}${
        options.port ? ':' + options.port : ''
      }/jsonrpc`;
      const client = await createClient(new WebSocket(url), {
        secret: options.secret
      }).catch(() => undefined);

      if (client && (await client.getVersion())) {
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
      return isMagnetURI(text);
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
    removeStartupLoading();
    return debugClient;
  } else if (!location.pathname.startsWith('/connect')) {
    addStartupLoading();

    const search = new URLSearchParams(location.search);
    const tries = [
      {
        secure:
          search.get('secure') && !['off', 'no', 'false'].includes(search.get('secure')!)
            ? true
            : false,
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
      try {
        const isSecure = location.protocol === 'https:' ? true : opt.secure;
        const url = opt.port
          ? `${isSecure ? 'wss' : 'ws'}://127.0.0.1:${opt.port}/jsonrpc`
          : `${isSecure ? 'wss' : 'ws'}://${location.host}/jsonrpc`;
        const client = await createClient(new WebSocket(url), {
          secret: opt.secret ?? undefined
        }).catch(() => undefined);

        if (client && (await client.getVersion().catch(() => undefined))) {
          window.localStorage.setItem(
            'naria2/connection',
            JSON.stringify({ port: opt.port, secret: opt.secret })
          );
          removeStartupLoading();
          return client;
        }
      } catch (error) {
        console.error(error);
      }
    }

    removeStartupLoading();
  }
}

function addStartupLoading() {
  const dom = document.getElementById('startup-loading');
  if (dom) {
    dom.style.display = 'flex';
  }
}

function removeStartupLoading() {
  const dom = document.getElementById('startup-loading');
  if (dom) {
    dom.style.display = 'none';
  }
}
