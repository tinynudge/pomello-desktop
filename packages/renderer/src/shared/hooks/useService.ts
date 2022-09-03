import { Service } from '@domain';
import { useContext } from 'react';
import { ServiceContext } from '../context/ServiceContext';

const useService = (): Service => {
  const activeService = useContext(ServiceContext);

  if (!activeService) {
    throw new Error('useService must be used inside a <ServiceProvider>');
  }

  return activeService.service;
};

export default useService;
