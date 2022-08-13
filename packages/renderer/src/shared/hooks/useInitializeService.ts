import { Service, ServiceRegistry } from '@domain';
import { useEffect, useMemo } from 'react';

const useInitializeService = (
  services: ServiceRegistry,
  serviceId?: string
): Service | undefined => {
  const service = useMemo(() => {
    if (!serviceId) {
      return;
    }

    const serviceFactory = services[serviceId];

    if (!serviceFactory) {
      throw new Error(`Unable to find service "${serviceId}"`);
    }

    return serviceFactory();
  }, [serviceId, services]);

  useEffect(() => {
    service?.onMount?.();

    return () => {
      service?.onUnmount?.();
    };
  }, [service]);

  return service;
};

export default useInitializeService;
