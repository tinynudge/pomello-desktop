import { ActiveService, ServiceConfig, ServiceRegistry } from '@domain';
import { useEffect, useState } from 'react';
import useTranslation from '../useTranslation';
import createTranslator from './createTranslator';

type UseInitializeService = ServiceIdle | ServiceInitializing | ServiceReady;

type ServiceIdle = {
  activeService: undefined;
  status: 'IDLE';
};

type ServiceInitializing = {
  activeService: undefined;
  status: 'INITIALIZING';
};

type ServiceReady = {
  activeService: ActiveService;
  status: 'READY';
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
        service: serviceFactory({
          config: config as null,
          translate: createTranslator(translations),
        }),
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

  if (!serviceId) {
    return {
      activeService: undefined,
      status: 'IDLE',
    };
  }

  if (!isReady || !activeService) {
    return {
      activeService: undefined,
      status: 'INITIALIZING',
    };
  }

  return {
    activeService,
    status: 'READY',
  };
};

export default useInitializeService;
