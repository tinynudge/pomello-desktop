import { Signal } from '@domain';
import { FC, ReactNode, createContext } from 'react';

interface CacheProviderProps {
  cache: Signal<any>;
  children: ReactNode;
}

export const CacheContext = createContext<Signal | undefined>(undefined);

export const CacheProvider: FC<CacheProviderProps> = ({ cache, children }) => {
  return <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>;
};
