import { useQuery } from '@tanstack/react-query';

import { Task } from 'naria2';

import { useAria2 } from '@/aria2';
import { formatByteSize } from '@/utils';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Home() {
  const aria2 = useAria2();
  const client = aria2.client!;

  const { data } = useQuery({
    queryKey: ['naria2/active'],
    queryFn: async () => {
      return await client.listActive();
    },
    structuralSharing: false,
    refetchInterval: 1000
  });

  return (
    <div className="h-full w-full mt-2">
      <ScrollArea>
        <div className="space-y-2">
          {data && data.map((t) => <DownloadItem key={t.gid} task={t}></DownloadItem>)}
        </div>
        <ScrollBar forceMount={true}></ScrollBar>
      </ScrollArea>
    </div>
  );
}

function DownloadItem(props: { task: Task }) {
  const task = props.task;
  const name =
    typeof task.status.bittorrent?.info?.name === 'string'
      ? task.status.bittorrent?.info?.name
      : task.status.bittorrent?.info?.name?.['utf-8'] ?? '[METADATA]';

  return (
    <div className="px-4 py-3 space-y-2 rounded-md border bg-gray-200/10 hover:bg-gray-300/10">
      <div className="flex">
        <span className="block">{name}</span>
        <div></div>
      </div>
      <Progress value={task.progress}></Progress>
      <div className="flex">
        <div className="text-sm select-none text-gray-500">
          <span>{formatByteSize(task.status.completedLength)}</span>
          <span> / </span>
          <span>{formatByteSize(task.status.totalLength)}</span>
        </div>
        <div className="flex-auto"></div>
        <div className="text-sm select-none text-gray-500 flex items-center">
          <span className="i-material-symbols-network-node text-base mr-1"></span>
          <span>{task.status.connections}</span>
        </div>
        <div className="ml-4 text-sm select-none text-gray-500 flex items-center min-w-[80px]">
          <span className="i-fluent-arrow-download-24-filled text-base mr-1"></span>
          <span>{formatByteSize(task.status.downloadSpeed)}/s</span>
        </div>
        <div className="ml-4 text-sm select-none text-gray-500 flex items-center min-w-[80px]">
          <span className="i-fluent-arrow-upload-24-filled text-base mr-1"></span>
          <span>{formatByteSize(task.status.uploadSpeed)}/s</span>
        </div>
      </div>
    </div>
  );
}
