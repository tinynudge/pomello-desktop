import { PomelloApi } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface PomelloApiProviderProps {
  children: ReactNode;
  pomelloApi: PomelloApi;
}

export const PomelloApiContext = createContext<PomelloApi | undefined>(undefined);

export const PomelloApiProvider: FC<PomelloApiProviderProps> = ({ children, pomelloApi }) => {
  return <PomelloApiContext.Provider value={pomelloApi}>{children}</PomelloApiContext.Provider>;
};
