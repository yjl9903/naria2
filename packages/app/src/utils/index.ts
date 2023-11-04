import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export { clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatByteSize(str: string | undefined) {
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

export function isMagnetURI(text: string) {
  return /^magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i.test(text);
}
