import { ServiceId, TaskNamesById } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { format } from 'date-fns/format';
import { Accessor } from 'solid-js';
import { useTaskNameHelpers } from './TaskNameHelpersContext';
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
  const { extractServiceIds, getFetchTaskNames } = useTaskNameHelpers();
  const queryClient = useQueryClient();

  const isToday = (date: string) => format(new Date(), 'yyyy-MM-dd') === date;

  const getEventsByDate = (date: string): Promise<Map<string, ServiceId[]>> => {
    return queryClient.fetchQuery({
      queryKey: ['eventsByDate', date],
      queryFn: () => {
        const events = getWeeklyProductivity().get(date)?.events;

        if (!events) {
          return new Map();
        }

        return extractServiceIds(events);
      },
      staleTime: isToday(date) ? 5 * 60 * 1000 : Infinity, // 5 minutes for today, infinite for past dates
    });
  };

  const fetchServiceTaskNamesByDate = (service: string, date: string): Promise<TaskNamesById> => {
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

  const fetchTaskNamesByDate = async (date: string): Promise<TaskNamesById> => {
    const eventsByService = await getEventsByDate(date);

    const results = await Promise.allSettled(
      eventsByService.keys().map(service => fetchServiceTaskNamesByDate(service, date))
    );

    return results.reduce<TaskNamesById>((taskNames, result) => {
      if (result.status === 'fulfilled' && result.value) {
        return { ...taskNames, ...result.value };
      }

      return taskNames;
    }, {});
  };

  const fetchTaskName = async ({
    date,
    service = 'trello',
    taskId,
  }: FetchTaskNameOptions): Promise<string> => {
    const taskNamesById = await fetchServiceTaskNamesByDate(service, date);

    const taskName = taskNamesById[taskId];

    if (typeof taskName === 'undefined') {
      return taskId;
    }

    if (typeof taskName !== 'string') {
      throw taskName;
    }

    return taskName;
  };

  return { fetchTaskName, fetchTaskNamesByDate };
};
