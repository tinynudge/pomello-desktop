import {
  ActiveService,
  RendererEvent,
  Service,
  ServiceCleanUpCallback,
  Unsubscribe,
} from '@pomello-desktop/domain';
import {
  Accessor,
  ParentComponent,
  Resource,
  createContext,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js';
import { assertNonNullish } from '../helpers/assertNonNullish';
import { createServiceConfig } from '../helpers/createServiceConfig';
import { useRuntime } from './RuntimeContext';

type ServiceProviderProps = {
  freezeServiceId?: boolean;
  initialServiceId?: string;
};

const ServiceContext = createContext<Resource<ActiveService | undefined> | undefined>(undefined);

export const useServiceResource = (): Resource<ActiveService | undefined> => {
  const context = useContext(ServiceContext);

  assertNonNullish(context, 'useServiceResource must be used inside a <ServiceProvider>');

  return context;
};

export const useService = (): Accessor<Service> => {
  const resource = useContext(ServiceContext);

  assertNonNullish(resource, 'useService must be used inside a <ServiceProvider>');

  return () => {
    const activeService = resource();

    if (resource.state !== 'ready' || !activeService) {
      throw new Error('A service is not currently active');
    }

    return activeService.service;
  };
};

export const useMaybeService = (): Accessor<Service | undefined> => {
  const resource = useContext(ServiceContext);

  assertNonNullish(resource, 'useService must be used inside a <ServiceProvider>');

  return () => (resource.state === 'ready' ? resource()?.service : undefined);
};

export const ServiceProvider: ParentComponent<ServiceProviderProps> = props => {
  const { pomelloConfig, logger, services, settings, translations } = useRuntime();

  let onMountUnsubscribe: Unsubscribe | undefined = undefined;

  const [getServiceId, setServiceId] = createSignal<string>(props.initialServiceId ?? '');

  const cleanUpCallbacks = new Set<ServiceCleanUpCallback>();

  const onServiceCleanUp = (callback: ServiceCleanUpCallback) => {
    cleanUpCallbacks.add(callback);
  };

  createEffect(() => {
    if (!props.freezeServiceId) {
      const unsubscribe = window.app.onServicesChange(service => {
        setServiceId(service.activeServiceId ?? '');
      });

      onCleanup(unsubscribe);
    }
  });

  const [activeService] = createResource(getServiceId, async serviceId => {
    if (!serviceId) {
      return;
    }

    const createService = services[serviceId];

    if (!createService) {
      throw new Error(`Unable to find service "${serviceId}"`);
    }

    const [config, serviceTranslations] = await Promise.all([
      createService.config ? createServiceConfig(createService.id, createService.config) : null,
      window.app.getTranslations({ serviceId: createService.id }),
    ]);

    const reinitializePomelloService = () => {
      window.postMessage(RendererEvent.ReinitializePomelloService, window.location.origin);
    };

    translations.addNamespace('service', serviceTranslations);

    const service = createService({
      config: config as null,
      getUser: () => pomelloConfig.store.user,
      logger,
      onServiceCleanUp,
      reinitializePomelloService,
      settings,
      translate: (key, mappings) => translations.t(`service:${key}`, mappings),
    });

    onMountUnsubscribe = service.onMount?.();

    return { config, service };
  });

  createEffect(() => {
    if (activeService.state === 'refreshing') {
      if (onMountUnsubscribe) {
        onMountUnsubscribe();

        onMountUnsubscribe = undefined;
      }

      if (cleanUpCallbacks.size) {
        cleanUpCallbacks.forEach(callback => callback());
        cleanUpCallbacks.clear();
      }

      const service = activeService()?.service;

      if (service) {
        translations.removeNamespace(service.id);
      }
    }
  });

  return <ServiceContext.Provider value={activeService}>{props.children}</ServiceContext.Provider>;
};
