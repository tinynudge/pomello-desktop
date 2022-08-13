import { Service } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface ServiceProviderProps {
  children: ReactNode;
  service: Service;
}

export const ServiceContext = createContext<Service | undefined>(undefined);

export const ServiceProvider: FC<ServiceProviderProps> = ({ children, service }) => {
  return <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>;
};
