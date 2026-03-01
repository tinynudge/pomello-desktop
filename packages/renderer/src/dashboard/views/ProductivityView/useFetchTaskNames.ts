import { useRuntime } from '@/shared/context/RuntimeContext';
import { createServiceConfig } from '@/shared/helpers/createServiceConfig';
import { FetchTaskNames, TaskNamesById, Unsubscribe } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { format } from 'date-fns/format';
import { Accessor, onCleanup } from 'solid-js';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

type UseFetchTaskNamesOptions = {
  getWeeklyProductivity: Accessor<WeeklyProductivity>;
};

type FetchTaskNameOptions = {
  date: string;
  service?: string;
  taskId: string;
};

export type FetchTaskName = (options: FetchTaskNameOptions) => Promise<string>;

export const useFetchTaskNames = ({ getWeeklyProductivity }: UseFetchTaskNamesOptions) => {
  const { logger, services, translations } = useRuntime();
  const queryClient = useQueryClient();

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

  const isToday = (date: string) => format(new Date(), 'yyyy-MM-dd') === date;

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

  const getEventsByDate = (date: string): Promise<Map<string, TrackingEvent[]>> => {
    return queryClient.fetchQuery({
      queryKey: ['eventsByDate', date],
      queryFn: () => {
        const events = getWeeklyProductivity().get(date)?.events;

        if (!events) {
          return new Map();
        }

        const eventsByService = new Map<string, TrackingEvent[]>();
        const seenEvents = new Set<string>();

        for (const event of events) {
          const key = `${event.serviceId}-${event.parentServiceId}`;

          if (!seenEvents.has(key)) {
            seenEvents.add(key);

            const service = event.service ?? 'trello';
            const events = eventsByService.get(service) ?? [];

            events.push(event);
            eventsByService.set(service, events);
          }
        }

        return eventsByService;
      },
      staleTime: isToday(date) ? 5 * 60 * 1000 : Infinity, // 5 minutes for today, infinite for past dates
    });
  };

  const fetchTaskNamesByDate = (service: string, date: string): Promise<TaskNamesById> => {
    const isToday = format(new Date(), 'yyyy-MM-dd') === date;

    return queryClient.fetchQuery({
      queryKey: ['taskNames', service, date],
      queryFn: async () => {
        const eventsByService = await getEventsByDate(date);
        const events = eventsByService.get(service);

        if (!events || events.length === 0) {
          return {};
        }

        const fetchTaskNames = await getFetchTaskNames(service);

        if (!fetchTaskNames) {
          return {};
        }

        return await fetchTaskNames(events);
      },
      staleTime: isToday ? 5 * 60 * 1000 : Infinity, // 5 minutes for today, infinite for past dates
    });
  };

  const fetchTaskName = async ({
    date,
    service = 'trello',
    taskId,
  }: FetchTaskNameOptions): Promise<string> => {
    const taskNamesById = await fetchTaskNamesByDate(service, date);

    const taskName = taskNamesById[taskId];

    if (typeof taskName === 'undefined') {
      return taskId;
    }

    if (typeof taskName !== 'string') {
      throw taskName;
    }

    return taskName;
  };

  return fetchTaskName;
};
