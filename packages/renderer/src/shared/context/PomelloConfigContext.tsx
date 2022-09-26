import { PomelloServiceConfig, ServiceConfig } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface PomelloConfigProviderProps {
  children: ReactNode;
  config: ServiceConfig<PomelloServiceConfig>;
}

export const PomelloConfigContext = createContext<ServiceConfig<PomelloServiceConfig> | undefined>(
  undefined
);

export const PomelloConfigProvider: FC<PomelloConfigProviderProps> = ({ children, config }) => {
  return <PomelloConfigContext.Provider value={config}>{children}</PomelloConfigContext.Provider>;
};
