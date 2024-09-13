export function resolveArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr)) {
    return arr;
  } else if (isDef(arr)) {
    return [arr];
  } else {
    return [];
  }
}

export function isDef<T>(value: T | undefined | null): value is T {
  if (value !== undefined && value !== null) {
    return true;
  } else {
    return false;
  }
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
