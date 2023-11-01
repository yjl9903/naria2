import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <div>
      <ScrollArea className="h-full w-full px-4">
        {new Array(10).fill(undefined).map((_, idx) => (
          <div className="h-8 w-full flex items-center">{idx}</div>
        ))}
        <ScrollBar forceMount={true}></ScrollBar>
      </ScrollArea>
    </div>
  );
}
