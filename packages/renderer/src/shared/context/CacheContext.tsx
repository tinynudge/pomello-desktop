import { Cache } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface CacheProviderProps {
  cache: Cache<any>;
  children: ReactNode;
}

export const CacheContext = createContext<Cache | undefined>(undefined);

export const CacheProvider: FC<CacheProviderProps> = ({ cache, children }) => {
  return <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>;
};
