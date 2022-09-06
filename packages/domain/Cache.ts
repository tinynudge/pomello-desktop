import { CacheChangeEventHandler } from './CacheChangeEventHandler';
import { CacheUpdateAction } from './CacheUpdateAction';

export interface Cache<TCache = Record<string, unknown>> {
  get(): TCache;
  onChange(handler: CacheChangeEventHandler<TCache>): () => void;
  set(action: CacheUpdateAction<TCache>): void;
}
