import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';

import {
  Menubar,
  MenubarButton,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar';

import Home from './pages/Home';
import { useAria2 } from './aria2';
import { DownloadAlert } from './components/Download';
import { formatByteSize } from './utils';

function Menu() {
  return (
    <Menubar>
      <MenubarButton>
        <DownloadAlert>
          <span className="select-none">Download</span>
        </DownloadAlert>
      </MenubarButton>
      <MenubarButton>
        <Link to="/connect" className="select-none cursor-default">
          Connect
        </Link>
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
  const navigate = useNavigate();
  const { client, clear } = useAria2();
  const { data, isError } = useQuery({
    queryKey: ['naria2/globalStat'],
    queryFn: async () => {
      const resp = await client?.globalStat();
      if (!resp) throw new Error('Can not get global stat');
      return resp;
    },
    refetchInterval: 1000
  });
  if (isError) {
    clear();
    navigate('/connect');
  }

  return (
    <div className="w-full px-2 py-1 bg-gray-200/20 border-t flex select-none">
      <div className="md:w-1/2"></div>
      <div className="w-1/2 md:w-1/4 pl-2 md:border-l flex items-center gap-1">
        <span className="i-solar-download-minimalistic-bold text-xl font-bold text-green-500"></span>
        <span className="text-sm">下载 {formatByteSize(data?.downloadSpeed)}/s</span>
      </div>
      <div className="w-1/2 md:w-1/4 pl-2 border-l flex items-center gap-1">
        <span className="i-solar-upload-minimalistic-bold text-xl font-bold text-blue-500"></span>
        <span className="text-sm">上传 {formatByteSize(data?.uploadSpeed)}/s</span>
      </div>
    </div>
  );
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

      <footer className="mt-4 text-gray-500">
        <GlobalStat></GlobalStat>
      </footer>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { client } = useAria2();
  React.useEffect(() => {
    if (!client) {
      navigate('/connect');
    }
  }, [client]);

  return (
    <Layout>
      <Home></Home>
    </Layout>
  );
}
