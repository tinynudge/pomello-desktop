import { Service } from '@domain';
import { useContext } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import assertNonNullish from '../helpers/assertNonNullish';

const useService = (): Service => {
  const activeService = useContext(ServiceContext);

  assertNonNullish(activeService, 'useService must be used inside a <ServiceProvider>');

  return activeService.service;
};

export default useService;
