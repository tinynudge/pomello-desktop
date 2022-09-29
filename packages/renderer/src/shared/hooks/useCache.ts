import { Cache } from '@domain';
import { useContext, useSyncExternalStore } from 'react';
import { CacheContext } from '../context/CacheContext';
import assertNonNullish from '../helpers/assertNonNullish';

type Selector<TCache, TValue> = (cache: TCache) => TValue;

const useCache = <TCache>(): Cache<TCache> => {
  const cache = useContext(CacheContext) as Cache<TCache> | undefined;

  assertNonNullish(cache, 'useCache must be used inside a <CacheProvider>');

  return cache;
};

export const useCacheSelector = <TCache, TValue = unknown>(
  selector: Selector<TCache, TValue>
): TValue => {
  const cache = useCache<TCache>();

  return useSyncExternalStore(cache.onChange, () => selector(cache.get()));
};

export const useCacheUpdater = <TCache>() => {
  const cache = useCache<TCache>();

  return cache.set;
};
