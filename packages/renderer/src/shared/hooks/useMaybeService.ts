import { Service } from '@domain';
import { useContext } from 'react';
import { ServiceContext } from '../context/ServiceContext';

const useMaybeService = (): Service | undefined => {
  const activeService = useContext(ServiceContext);

  return activeService?.service;
};

export default useMaybeService;
