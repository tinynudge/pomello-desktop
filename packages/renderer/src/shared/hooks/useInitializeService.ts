import { Service, ServiceConfig, ServiceRegistry } from '@domain';
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
    let config: ServiceConfig<void> | null = null;

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
        config = await window.app.registerServiceConfig(serviceFactory.id, serviceFactory.config);
      }

      setService(
        serviceFactory({
          // Individual service factories will have the correct type, but since
          // the ServiceFactory config defaults to void, we need to cast as null
          config: config as null,
        })
      );

      setInitializing(false);
    };

    initializeService();

    return () => {
      config?.unregister();
    };
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
