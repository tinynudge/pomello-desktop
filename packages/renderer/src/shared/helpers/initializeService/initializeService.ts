import { getPomelloServiceConfigContext } from '@/shared/contexts/pomelloServiceConfigContext';
import { getSettingsContext } from '@/shared/contexts/settingsContext';
import type {
  ActiveService,
  Logger,
  ServiceConfig,
  ServiceRegistry,
  UnsubscribeHandler,
} from '@domain';
import { derived, get, readable, type Readable } from 'svelte/store';
import createTranslator from './createTranslator';

interface InitializeServiceParams {
  initialServiceId?: string;
  logger: Logger;
  services: ServiceRegistry;
}

type InitializeServiceResult = ServiceIdle | ServiceInitializing | ServiceReady;

type ServiceIdle = {
  activeService: null;
  status: 'IDLE';
};

type ServiceInitializing = {
  activeService: null;
  status: 'INITIALIZING';
};

type ServiceReady = {
  activeService: ActiveService | null;
  status: 'READY';
};

const initializeService = ({
  initialServiceId,
  logger,
  services,
}: InitializeServiceParams): Readable<InitializeServiceResult> => {
  const settings = getSettingsContext();
  const pomelloServiceConfig = getPomelloServiceConfigContext();

  const activeServiceId = readable<string | undefined>(initialServiceId, set => {
    window.app.onServicesChange(services => {
      set(services.activeServiceId);
    });
  });

  return derived<Readable<string | undefined>, InitializeServiceResult>(
    activeServiceId,
    ($activeServiceId, set) => {
      const unsubscribeHandlers: UnsubscribeHandler[] = [];

      const initializeService = async () => {
        if (!$activeServiceId) {
          return set({
            activeService: null,
            status: 'READY',
          });
        }

        const serviceFactory = services[$activeServiceId];

        set({
          activeService: null,
          status: 'INITIALIZING',
        });

        if (!serviceFactory) {
          throw new Error(`Unable to find service "${$activeServiceId}"`);
        }

        let config: ServiceConfig<void> | null = null;

        if (serviceFactory.config) {
          config = await window.app.registerServiceConfig(serviceFactory.id, serviceFactory.config);

          unsubscribeHandlers.push(config.unregister);
        }

        const translations = await window.app.getTranslations(serviceFactory.id);

        const service = serviceFactory({
          config: config as null,
          getSettings: () => get(settings),
          getUser: () => pomelloServiceConfig.get().user,
          logger,
          translate: createTranslator(translations),
        });

        if (service.onUnmount) {
          unsubscribeHandlers.push(service.onUnmount);
        }

        set({
          activeService: { config, service },
          status: 'READY',
        });

        service.onMount?.();
      };

      initializeService();

      return () => {
        unsubscribeHandlers.forEach(unsubscribe => unsubscribe());
      };
    },
    {
      activeService: null,
      status: 'IDLE',
    }
  );
};

export default initializeService;
