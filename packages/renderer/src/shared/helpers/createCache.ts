import { Cache, CacheChangeEventHandler, CacheUpdateAction } from '@domain';
import produce from 'immer';

const createCache = <TCache = Record<string, unknown>>(): Cache<TCache> => {
  let cache = {} as TCache;

  const listeners = new Set<CacheChangeEventHandler<TCache>>();

  const get = () => cache;

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
    get,
    set,
    onChange,
  };
};

export default createCache;
