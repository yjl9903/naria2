export type MaybePromise<T> = T | Promise<T>;

export function sleep(time: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => res(), time);
  });
}
