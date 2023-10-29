import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-2">
        {new Array(10).fill(undefined).map((_, idx) => (
          <div className="h-8 w-full">{idx}</div>
        ))}
        <ScrollBar forceMount={true}></ScrollBar>
      </ScrollArea>
    </div>
  );
}
