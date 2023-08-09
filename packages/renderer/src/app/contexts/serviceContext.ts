import type { Service } from '@domain';
import { getContext, setContext } from 'svelte';

const serviceContext = 'service';

const setServiceContext = (service: Service) => {
  setContext(serviceContext, service);
};

const getServiceContext = (): Service => {
  return getContext(serviceContext);
};

export { getServiceContext, setServiceContext };
