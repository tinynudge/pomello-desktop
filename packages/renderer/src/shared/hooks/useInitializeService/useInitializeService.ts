import createServiceConfig from '@/shared/helpers/createServiceConfig';
import getPomelloServiceConfig from '@/shared/helpers/getPomelloServiceConfig';
import { ActiveService, Logger, ServiceConfig, ServiceRegistry } from '@domain';
import { useEffect, useRef, useState } from 'react';
import useTranslation from '../useTranslation';
import createTranslator from './createTranslator';

interface UseInitializeServiceOptions {
  logger: Logger;
  serviceId?: string;
  services: ServiceRegistry;
}

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

type UnsubscribeHandlers = () => void;

const useInitializeService = ({
  logger,
  services,
  serviceId,
}: UseInitializeServiceOptions): UseInitializeService => {
  const { addNamespace, removeNamespace } = useTranslation();
  const [isReady, setReady] = useState(true);

  const [activeService, setActiveService] = useState<ActiveService | undefined>(undefined);

  // This is mainly used to short-circuit the initializeService call inside the
  // useEffect when running in strict mode. Since initializeService is an async
  // function, the clean up function could be called before any of the clean up
  // handlers inside initializeService have been added.
  const previousServiceId = useRef<string>();

  useEffect(() => {
    const unsubscribeHandlers: UnsubscribeHandlers[] = [];

    let config: ServiceConfig<void> | null = null;

    const initializeService = async () => {
      if (!serviceId || serviceId === previousServiceId.current) {
        return;
      }

      const serviceFactory = services[serviceId];

      setReady(false);

      if (!serviceFactory) {
        throw new Error(`Unable to find service "${serviceId}"`);
      }

      if (serviceFactory.config) {
        config = await createServiceConfig(serviceFactory.id, serviceFactory.config);
        unsubscribeHandlers.push(config.unregister);
      }

      let [pomelloConfig, settings, translations] = await Promise.all([
        getPomelloServiceConfig(),
        window.app.getSettings(),
        window.app.getTranslations(serviceFactory.id),
      ]);

      addNamespace('service', translations);

      setActiveService({
        // Individual service factories will have the correct type, but since
        // the ServiceFactory config defaults to void, we need to cast as null
        service: serviceFactory({
          config: config as null,
          getSettings: () => settings,
          getUser: () => pomelloConfig.get().user,
          logger,
          translate: createTranslator(translations),
        }),
        config,
      });

      const unsubscribeSettingsChange = window.app.onSettingsChange(updatedSettings => {
        settings = updatedSettings;
      });

      unsubscribeHandlers.push(pomelloConfig.unregister);
      unsubscribeHandlers.push(unsubscribeSettingsChange);

      setReady(true);
    };

    initializeService();

    return () => {
      unsubscribeHandlers.forEach(handler => handler());

      removeNamespace('service');

      previousServiceId.current = serviceId;
    };
  }, [addNamespace, logger, removeNamespace, serviceId, services]);

  useEffect(() => {
    const unmountService = activeService?.service.onMount?.();

    return () => {
      unmountService?.();
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
