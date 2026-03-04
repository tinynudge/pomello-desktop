import { useRuntime, useTranslate } from '@/shared/context/RuntimeContext';
import { TaskNamesById } from '@pomello-desktop/domain';
import {
  BreakTrackingEvent,
  OverBreakTrackingEvent,
  TrackingEvent,
} from '@tinynudge/pomello-service';

type ParsedEvent = {
  allottedTime: number | null;
  date: string;
  duration: number;
  parentServiceId: string | null;
  parentTaskName: string | null;
  pomodoros: number | null;
  service: string;
  serviceId: string;
  startTime: string;
  taskName: string;
  time: string;
  type: string;
};

type TrackingEventWithBreakParent =
  | Exclude<TrackingEvent, OverBreakTrackingEvent>
  | (OverBreakTrackingEvent & { parent: BreakTrackingEvent });

const escapeCsv = (value: string): string => {
  // RFC 4180 compliant: escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

const getTime = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.round((duration % 3600) / 60);

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const useExportHelpers = () => {
  const { services } = useRuntime();
  const t = useTranslate();

  const getEventType = (event: TrackingEventWithBreakParent): string => {
    switch (event.type) {
      case 'break':
        return t(`event.type.break.${event.meta.type}`);
      case 'over_break':
        return t(`event.type.overBreak.${event.parent.meta.type}`);
      case 'over_task':
        return t('event.type.overTask');
      default:
        return t(`event.type.${event.type}`);
    }
  };

  const getTaskName = (id: string, taskNamesById: TaskNamesById): string => {
    const taskName = taskNamesById[id];

    if (taskName instanceof Error) {
      return t('taskNameError');
    }

    if (typeof taskName === 'string') {
      return escapeCsv(taskName);
    }

    return escapeCsv(id);
  };

  const parseEvents = (
    events: TrackingEvent[],
    taskNamesById: TaskNamesById,
    callback: (parsedEvent: ParsedEvent) => void
  ): void => {
    const eventsRemaining = [...events] as TrackingEventWithBreakParent[];

    while (eventsRemaining.length > 0) {
      const event = eventsRemaining.shift()!;

      if (event.type === 'note') {
        continue;
      }

      if ('children' in event) {
        if (event.type === 'break') {
          eventsRemaining.unshift(...event.children.map(child => ({ ...child, parent: event })));
        } else {
          eventsRemaining.unshift(...event.children);
        }
      }

      const { service = 'trello', serviceId, parentServiceId, meta } = event;
      const { duration } = meta;

      const allottedTime = 'allotedTime' in meta ? meta.allotedTime : null;
      const parentTaskName = parentServiceId ? getTaskName(parentServiceId, taskNamesById) : null;
      const pomodoros = 'pomodoros' in event.meta ? event.meta.pomodoros : null;
      const serviceDisplayName = services[service]?.displayName ?? service;
      const taskName = getTaskName(serviceId, taskNamesById);
      const time = getTime(duration);
      const type = getEventType(event);

      const date = new Date(event.startTime);
      const startDate = date.toLocaleDateString();
      const startTime = date.toLocaleTimeString();

      callback({
        taskName,
        parentTaskName,
        service: serviceDisplayName,
        serviceId,
        parentServiceId,
        type,
        time,
        duration,
        allottedTime,
        pomodoros,
        date: startDate,
        startTime,
      });
    }
  };

  const transformToCsv = (events: TrackingEvent[], taskNamesById: TaskNamesById): string => {
    const headers = [
      t('export.csv.taskName'),
      t('export.csv.parentTaskName'),
      t('export.csv.service'),
      t('export.csv.serviceId'),
      t('export.csv.parentServiceId'),
      t('export.csv.type'),
      t('export.csv.time'),
      t('export.csv.duration'),
      t('export.csv.allottedTime'),
      t('export.csv.pomodoros'),
      t('export.csv.date'),
      t('export.csv.startTime'),
    ];

    const rows: string[] = [headers.join(',')];

    parseEvents(events, taskNamesById, parsedEvent => {
      const row = [
        parsedEvent.taskName,
        parsedEvent.parentTaskName || '',
        parsedEvent.service,
        parsedEvent.serviceId,
        parsedEvent.parentServiceId || '',
        parsedEvent.type,
        parsedEvent.time,
        parsedEvent.duration.toString(),
        parsedEvent.allottedTime?.toString() || '',
        parsedEvent.pomodoros?.toString() || '',
        parsedEvent.date,
        parsedEvent.startTime,
      ];

      rows.push(row.join(','));
    });

    return rows.join('\n');
  };

  const transformToJson = (events: TrackingEvent[], taskNamesById: TaskNamesById): string => {
    const transformedEvents: ParsedEvent[] = [];

    parseEvents(events, taskNamesById, parsedEvent => {
      transformedEvents.push(parsedEvent);
    });

    return JSON.stringify(transformedEvents, null, 2);
  };

  return { transformToCsv, transformToJson };
};
