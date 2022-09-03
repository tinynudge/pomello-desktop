import { ActiveService, ServiceConfig, ServiceRegistry } from '@domain';
import { useEffect, useState } from 'react';
import useTranslation from './useTranslation';

type UseInitializeService = ServiceInitializing | ServiceReady;

type ServiceInitializing = {
  activeService: undefined;
  isReady: false;
};

type ServiceReady = {
  activeService: ActiveService;
  isReady: true;
};

const useInitializeService = (
  services: ServiceRegistry,
  serviceId?: string
): UseInitializeService => {
  const { addNamespace, removeNamespace } = useTranslation();
  const [isReady, setReady] = useState(true);

  const [activeService, setActiveService] = useState<ActiveService | undefined>(undefined);

  useEffect(() => {
    let config: ServiceConfig<void> | null = null;

    const initializeService = async () => {
      if (!serviceId) {
        return;
      }

      const serviceFactory = services[serviceId];

      setReady(false);

      if (!serviceFactory) {
        throw new Error(`Unable to find service "${serviceId}"`);
      }

      if (serviceFactory.config) {
        config = await window.app.registerServiceConfig(serviceFactory.id, serviceFactory.config);
      }

      const translations = await window.app.getTranslations(serviceFactory.id);
      addNamespace('service', translations);

      setActiveService({
        // Individual service factories will have the correct type, but since
        // the ServiceFactory config defaults to void, we need to cast as null
        service: serviceFactory({ config: config as null }),
        config,
      });

      setReady(true);
    };

    initializeService();

    return () => {
      config?.unregister();

      removeNamespace('service');
    };
  }, [addNamespace, removeNamespace, serviceId, services]);

  useEffect(() => {
    activeService?.service.onMount?.();

    return () => {
      activeService?.service.onUnmount?.();
    };
  }, [activeService]);

  if (!isReady || !activeService) {
    return {
      activeService: undefined,
      isReady: false,
    };
  }

  return {
    activeService,
    isReady: true,
  };
};

export default useInitializeService;
