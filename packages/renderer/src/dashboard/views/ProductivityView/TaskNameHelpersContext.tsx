import { useRuntime } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { createServiceConfig } from '@/shared/helpers/createServiceConfig';
import { FetchTaskNames, ServiceId, Unsubscribe } from '@pomello-desktop/domain';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { ParentComponent, createContext, onCleanup, useContext } from 'solid-js';

type TaskNameHelpersContextValue = {
  extractServiceIds: (events: TrackingEvent[]) => Map<string, ServiceId[]>;
  getFetchTaskNames: (serviceId: string) => Promise<FetchTaskNames | null>;
};

const TaskNameHelpersContext = createContext<TaskNameHelpersContextValue | undefined>(undefined);

export const useTaskNameHelpers = (): TaskNameHelpersContextValue => {
  const value = useContext(TaskNameHelpersContext);

  assertNonNullish(value, 'useTaskNameHelpers must be used inside a <TaskNameHelpersProvider>');

  return value;
};

export const TaskNameHelpersProvider: ParentComponent = props => {
  const { logger, services, translations } = useRuntime();

  const fetchTaskNamesByService: Partial<Record<string, FetchTaskNames>> = {};

  const cleanUpCallbacks = new Set<Unsubscribe>();

  const onClientCleanUp = (callback: Unsubscribe) => {
    cleanUpCallbacks.add(callback);
  };

  onCleanup(() => {
    if (cleanUpCallbacks.size) {
      cleanUpCallbacks.forEach(callback => callback());
    }
  });

  const getFetchTaskNames = async (serviceId: string): Promise<FetchTaskNames | null> => {
    const cachedFetchTaskNames = fetchTaskNamesByService[serviceId];

    if (cachedFetchTaskNames) {
      return cachedFetchTaskNames;
    }

    const createService = services[serviceId];

    if (!createService.createFetchTaskNames) {
      return null;
    }

    let config;
    if (createService.config) {
      config = await createServiceConfig(createService.id, createService.config);
    }

    const fetchTaskNames = createService.createFetchTaskNames({
      config: config as never,
      logger,
      onCleanUp: onClientCleanUp,
      translate: (key, mappings) => translations.t(`service:${key}`, mappings),
    });

    fetchTaskNamesByService[serviceId] = fetchTaskNames;

    return fetchTaskNames;
  };

  const extractServiceIds = (events: TrackingEvent[]): Map<string, ServiceId[]> => {
    const serviceIdsByService = new Map<string, ServiceId[]>();
    const seenEvents = new Set<string>();

    for (const event of events) {
      const key = `${event.serviceId}-${event.parentServiceId}`;

      if (!seenEvents.has(key)) {
        seenEvents.add(key);

        const service = event.service ?? 'trello';
        const serviceIds = serviceIdsByService.get(service) ?? [];

        serviceIds.push([event.serviceId, event.parentServiceId]);

        if (event.parentServiceId) {
          const parentKey = `${event.parentServiceId}-${null}`;

          if (!seenEvents.has(parentKey)) {
            seenEvents.add(parentKey);
            serviceIds.push([event.parentServiceId, null]);
          }
        }

        serviceIdsByService.set(service, serviceIds);
      }
    }

    return serviceIdsByService;
  };

  return (
    <TaskNameHelpersContext.Provider value={{ extractServiceIds, getFetchTaskNames }}>
      {props.children}
    </TaskNameHelpersContext.Provider>
  );
};
