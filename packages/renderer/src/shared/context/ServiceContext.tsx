import { ActiveService } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface ServiceProviderProps {
  children: ReactNode;
  service?: ActiveService;
}

export const ServiceContext = createContext<ActiveService | undefined>(undefined);

export const ServiceProvider: FC<ServiceProviderProps> = ({ children, service }) => {
  return <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>;
};
