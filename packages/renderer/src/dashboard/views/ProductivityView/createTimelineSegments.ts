import {
  BreakTrackingEvent,
  OverBreakTrackingEvent,
  TrackingEvent,
} from '@tinynudge/pomello-service';
import { DailyProductivity } from './WeeklyProductivityPanels';

export type TimelineSegment = {
  date: string;
  duration: number;
  endHour: number;
  event: TrackingEvent;
  startHour: number;
  startTime: string;
  type: string;
};

type TrackingEventWithBreakParent =
  | Exclude<TrackingEvent, OverBreakTrackingEvent>
  | (OverBreakTrackingEvent & { parent: BreakTrackingEvent });

/**
 * Converts an ISO timestamp to decimal hours (0-24).
 * For example, "2026-02-16T14:30:00" returns 14.5
 */
const getElapsedHours = (startTime: string): number => {
  const timePart = startTime.slice(11, 19); // Extract "HH:mm:ss"
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  return hours + minutes / 60 + seconds / 3600;
};

const getBarTypeFromEvent = (event: TrackingEventWithBreakParent): string => {
  switch (event.type) {
    case 'break':
      return `${event.meta.type}Break`;
    case 'over_break':
      return `${event.parent.meta.type}BreakOver`;
    case 'over_task':
      return 'taskOver';
    default:
      return event.type;
  }
};

export const createTimelineSegments = (productivity: DailyProductivity): TimelineSegment[] => {
  const timelineSegments: TimelineSegment[] = [];

  const events = [...productivity.events] as TrackingEventWithBreakParent[];

  while (events.length > 0) {
    const event = events.shift()!;

    if ('children' in event) {
      if (event.type === 'break') {
        events.unshift(...event.children.map(child => ({ ...child, parent: event })));
      } else {
        events.unshift(...event.children);
      }
    }

    if (event.type === 'note' || event.meta.duration <= 0) {
      continue;
    }

    const startHour = getElapsedHours(event.startTime);

    timelineSegments.push({
      date: event.startTime.substring(0, 10),
      duration: event.meta.duration,
      endHour: startHour + event.meta.duration / 3600,
      event,
      startHour,
      startTime: event.startTime,
      type: getBarTypeFromEvent(event),
    });
  }

  return timelineSegments;
};
