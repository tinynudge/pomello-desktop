import { Service } from '@domain';
import { useContext } from 'react';
import { ServiceContext } from '../context/ServiceContext';

const useService = (): Service => {
  const service = useContext(ServiceContext);

  if (!service) {
    throw new Error('useService must be used inside a <ServiceProvider>');
  }

  return service;
};

export default useService;
