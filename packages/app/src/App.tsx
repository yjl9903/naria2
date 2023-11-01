import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import { useAria2 } from './aria2';

import {
  Menubar,
  MenubarButton,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

function DownloadAlert() {
  const aria2 = useAria2();
  const [text, setText] = React.useState('');

  const download = React.useCallback(async () => {
    const client = aria2.client;
    if (!client) return;
    if (!text) return;
    const uris = text.split('\n');
    try {
      await client.downloadUri(uris, {});
    } catch (error) {
      console.error(error);
    }
  }, [text, aria2]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="select-none">Download</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>添加 Torrent 链接</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="输入 Torrent 链接"
              onChange={(ev) => setText(ev.target.value)}
            ></Textarea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={download}>下载</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Menu() {
  return (
    <Menubar>
      <MenubarButton>
        <DownloadAlert></DownloadAlert>
      </MenubarButton>
      <MenubarMenu>
        <MenubarTrigger>Settings</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About</MenubarItem>
          {/* <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem> */}
        </MenubarContent>
      </MenubarMenu>
      {/* <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu> */}
    </Menubar>
  );
}

function GlobalStat() {
  const { client } = useAria2();
  const { data } = useQuery({
    queryKey: ['naria2/globalStat'],
    queryFn: async () => await client?.globalStat(),
    refetchInterval: 1000
  });

  return (
    <div className="w-full px-2 py-1 bg-gray-200/20 border-t flex select-none">
      <div className="w-1/2"></div>
      <div className="w-1/4 pl-2 border-l">下载 {formatByteSize(data?.downloadSpeed)}/s</div>
      <div className="w-1/4 pl-2 border-l">上传 {formatByteSize(data?.uploadSpeed)}/s</div>
    </div>
  );
}

function formatByteSize(str: string | undefined) {
  const num = +(str ?? 0);
  const kb = num / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

function Layout(props: { children: React.ReactElement }) {
  const { client } = useAria2();
  const { data } = useQuery({
    queryKey: ['naria2/version'],
    queryFn: async () => await client?.version()
  });

  return (
    <div className="h-screen flex flex-col">
      <header className="relative z-40 border-b text-primary px-3 sm:px-12">
        <div className="mx-auto">
          <div className="flex items-center pt-3 md:pt-4">
            <div className="items-end rounded px-4 py-3 text-2xl font-medium leading-none text-primary transition hover:bg-secondary sm:flex select-none">
              <span>naria2</span>
              <span className="ml-1 text-xs text-gray-500">{data?.version}</span>
            </div>
            <div className="flex-grow"></div>
          </div>
          <Menu></Menu>
        </div>
      </header>

      <main className="px-3 sm:px-12 flex-grow">{props.children}</main>

      <footer className="mt-12 text-gray-500">
        <GlobalStat></GlobalStat>
      </footer>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Home></Home>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
