import * as React from 'react';

import { useAria2 } from '@/aria2';
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

export function DownloadAlert(props: { children: React.ReactElement }) {
  const aria2 = useAria2();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const download = React.useCallback(async () => {
    const client = aria2.client;
    if (!client) return;
    if (!text) return;
    const uris = text.split('\n');
    try {
      const torrent = await client.downloadUri(uris, {});
      torrent.on('progress', (torrent) => {
        console.log(torrent);
      });
    } catch (error) {
      console.error(error);
    }
  }, [text, aria2]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent onClickOverlay={() => open && setOpen(false)}>
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
