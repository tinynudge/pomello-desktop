import { Cache, CacheUpdateAction } from '@domain';
import { useContext, useEffect, useState } from 'react';
import { CacheContext } from '../context/CacheContext';

type UseCache<TCache> = [TCache, (action: CacheUpdateAction<TCache>) => void];

const useCache = <TCache>(): UseCache<TCache> => {
  const cache = useContext(CacheContext) as Cache<TCache> | undefined;

  if (!cache) {
    throw new Error('useCache must be used inside a <CacheProvider>');
  }

  const [contents, setContents] = useState(cache.get());

  useEffect(() => {
    return cache.onChange(setContents);
  }, [cache]);

  return [contents, cache.set];
};

export default useCache;
