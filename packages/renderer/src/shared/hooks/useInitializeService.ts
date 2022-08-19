import { Service, ServiceRegistry } from '@domain';
import { useEffect, useState } from 'react';

interface UseInitializeService {
  isInitializing: boolean;
  service?: Service;
}

const useInitializeService = (
  services: ServiceRegistry,
  serviceId?: string
): UseInitializeService => {
  const [isInitializing, setInitializing] = useState(false);
  const [service, setService] = useState<Service | undefined>(undefined);

  useEffect(() => {
    const initializeService = async () => {
      if (!serviceId) {
        return;
      }

      const serviceFactory = services[serviceId];

      setInitializing(true);

      if (!serviceFactory) {
        throw new Error(`Unable to find service "${serviceId}"`);
      }

      if (serviceFactory.config) {
        await window.app.registerServiceConfig(serviceFactory.id, serviceFactory.config);
      }

      setService(serviceFactory());

      setInitializing(false);
    };

    initializeService();
  }, [serviceId, services]);

  useEffect(() => {
    service?.onMount?.();

    return () => {
      service?.onUnmount?.();
    };
  }, [service]);

  return { isInitializing, service };
};

export default useInitializeService;
