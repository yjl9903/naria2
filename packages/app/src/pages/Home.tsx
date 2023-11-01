import { useQuery } from '@tanstack/react-query';

import { useAria2 } from '@/aria2';
import { Progress } from '@/components/ui/progress';
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
  const item = props.item;
  const completed = Math.ceil((100.0 * +item.completedLength) / +item.totalLength);

  return (
    <div className="px-4 py-3 space-y-2 rounded-md bg-gray-200/10 hover:bg-gray-300/10">
      <h4>{props.item.bittorrent?.info?.name ?? '[METADATA]'}</h4>
      <Progress value={completed}></Progress>
    </div>
  );
}
