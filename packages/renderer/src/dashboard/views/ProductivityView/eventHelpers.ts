import { TrackingEvent } from '@tinynudge/pomello-service';
import { addSeconds, format } from 'date-fns';

export const getTimeRange = (event: TrackingEvent): string => {
  const startDate = new Date(event.startTime);

  if (!('duration' in event.meta)) {
    return format(startDate, 'h:mm aaa');
  }

  const duration =
    event.type === 'task'
      ? event.children.reduce((duration, childEvent) => {
          const childDuration = childEvent.type === 'pause' ? childEvent.meta.duration : 0;

          return duration + childDuration;
        }, event.meta.duration)
      : event.meta.duration;

  const endDate = addSeconds(startDate, duration);
  const sameMeridiem = format(startDate, 'aaa') === format(endDate, 'aaa');
  const startFormatted = format(startDate, sameMeridiem ? 'h:mm' : 'h:mm aaa');
  const endTime = format(endDate, 'h:mm aaa');

  return `${startFormatted}\u2013${endTime}`;
};
