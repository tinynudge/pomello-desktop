import { Cache, CacheChangeEventHandler, CacheUpdateAction } from '@domain';
import produce from 'immer';
import { vi } from 'vitest';

const createMockCache = <TCache = Record<string, unknown>>(): Cache<TCache> => {
  let cache = {} as TCache;

  const listeners = new Set<CacheChangeEventHandler<TCache>>();

  const set = (setCacheAction: CacheUpdateAction<TCache>) => {
    cache = produce(cache, setCacheAction);

    listeners.forEach(callback => callback(cache));
  };

  const onChange = (callback: CacheChangeEventHandler<TCache>) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  };

  return {
    get: vi.fn(() => cache),
    set: vi.fn(set),
    onChange: vi.fn(onChange),
  };
};

export default createMockCache;
