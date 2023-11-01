import { useQuery } from '@tanstack/react-query';

import { useAria2 } from '@/aria2';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Home() {
  const aria2 = useAria2();
  const client = aria2.client!;

  const { data } = useQuery({
    queryKey: ['naria2/active'],
    queryFn: () => {
      return client.listActive();
    },
    refetchInterval: 1000
  });

  return (
    <div className="h-full w-full mt-2">
      <ScrollArea>
        <div className="space-y-2">
          {data && data.map((d) => <DownloadItem key={d.gid} item={d}></DownloadItem>)}
        </div>
        <ScrollBar forceMount={true}></ScrollBar>
      </ScrollArea>
    </div>
  );
}

function DownloadItem(props: { item: any }) {
  return (
    <div className="px-4 py-2 rounded-md bg-gray-200/10 hover:bg-gray-300/10">
      {props.item.bittorrent?.info?.name ?? '[METADATA]'}
    </div>
  );
}
