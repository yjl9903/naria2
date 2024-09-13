export class Naria2Error extends Error {
  constructor(message?: string, cause?: { code?: number; message?: string }) {
    super(message ?? 'Unknown naria2 error', { cause });
  }
}
