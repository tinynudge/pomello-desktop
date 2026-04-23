import { PrimaryTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { addSeconds, format } from 'date-fns';

export const removeEvent = (
  events: PrimaryTrackingEvent[] | undefined,
  eventId: string
): PrimaryTrackingEvent[] => {
  if (!events) {
    return [];
  }

  const result = structuredClone(events);

  for (let index = 0; index < result.length; index++) {
    const event = result[index];

    if (event.id === eventId) {
      result.splice(index, 1);
      return result;
    }

    if ('children' in event) {
      const childIndex = event.children.findIndex(child => child.id === eventId);

      if (childIndex !== -1) {
        event.children.splice(childIndex, 1);
        return result;
      }
    }
  }

  return result;
};

export const replaceEvent = (
  events: PrimaryTrackingEvent[] | undefined,
  updatedEvent: TrackingEvent
): PrimaryTrackingEvent[] => {
  if (!events) {
    return [];
  }

  const result = structuredClone(events);

  for (let index = 0; index < result.length; index++) {
    const event = result[index];

    if (event.id === updatedEvent.id) {
      result[index] = updatedEvent as PrimaryTrackingEvent;
      return result;
    }

    if ('children' in event) {
      const childIndex = event.children.findIndex(child => child.id === updatedEvent.id);

      if (childIndex !== -1) {
        event.children[childIndex] = updatedEvent as (typeof event.children)[number];
        return result;
      }
    }
  }

  return result;
};

export const resolvePauseDuration = (event: TrackingEvent): number => {
  if (event.type !== 'task') {
    return 0;
  }

  let duration = 0;

  for (const child of event.children) {
    if (child.type === 'pause') {
      duration += child.meta.duration;
    }
  }

  return duration;
};

export const getTimeRange = (event: TrackingEvent): string => {
  const startDate = new Date(event.startTime);

  if (!('duration' in event.meta)) {
    return format(startDate, 'h:mm aaa');
  }

  const duration = 'duration' in event.meta ? event.meta.duration : 0;
  const totalDuration = duration + resolvePauseDuration(event);

  const endDate = addSeconds(startDate, totalDuration);
  const sameMeridiem = format(startDate, 'aaa') === format(endDate, 'aaa');
  const startFormatted = format(startDate, sameMeridiem ? 'h:mm' : 'h:mm aaa');
  const endTime = format(endDate, 'h:mm aaa');

  return `${startFormatted}\u2013${endTime}`;
};
