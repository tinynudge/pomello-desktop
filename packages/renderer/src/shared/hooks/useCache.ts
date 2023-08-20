import { Signal } from '@domain';
import { useContext } from 'react';
import { CacheContext } from '../context/CacheContext';
import assertNonNullish from '../helpers/assertNonNullish';

const useCache = <TCache>(): Signal<TCache> => {
  const cache = useContext(CacheContext) as Signal<TCache> | undefined;

  assertNonNullish(cache, 'useCache must be used inside a <CacheProvider>');

  return cache;
};

export default useCache;
