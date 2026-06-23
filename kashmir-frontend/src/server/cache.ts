/**
 * Tiny in-memory TTL cache — mirror of the Python `cachetools.TTLCache`.
 *
 * Used by the news and social routes to avoid re-fetching upstream on every
 * request, exactly as the original FastAPI services did (news: 900s, social: 1800s).
 *
 * Module-level state persists for the lifetime of the Node server process, which
 * matches the single-process behaviour of the old uvicorn server.
 */

interface Entry<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<T> {
  private store = new Map<string, Entry<T>>();
  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
