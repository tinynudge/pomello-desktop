import { YScale } from './Chart';
import { DailyProductivity } from './WeeklyProductivityPanels';

export type OverviewSegment = {
  date: string;
  duration: number;
  height: number;
  overDuration: number;
  serviceId: string;
  type: 'task' | 'void';
  value: number;
  y: number;
};

export const createOverviewsSegments = (
  date: string,
  productivity: DailyProductivity,
  yScale: YScale
): OverviewSegment[] => {
  // Group events by service and type to aggregate pomodoro counts
  const eventGroups = new Map<string, Omit<OverviewSegment, 'height' | 'y'>>();

  for (const event of productivity.events) {
    if (event.type !== 'task' && event.type !== 'void') {
      continue;
    }

    const groupKey = `${event.type}:${event.serviceId}`;
    const group = eventGroups.get(groupKey) ?? {
      date,
      duration: 0,
      overDuration: 0,
      serviceId: event.serviceId,
      type: event.type,
      value: 0,
    };

    group.duration += event.meta.duration;
    group.value += event.type === 'task' ? event.meta.pomodoros : event.meta.voidedPomodoros;

    if (event.type === 'task') {
      for (const childEvent of event.children) {
        if (childEvent.type === 'over_task') {
          group.overDuration += childEvent.meta.duration;
        }
      }
    }

    eventGroups.set(groupKey, group);
  }

  // Sort so voided pomodoros render at the top, then by value for stacking order
  const sortedGroups = Array.from(eventGroups.values()).sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'void' ? -1 : 1;
    }

    return a.value - b.value;
  });

  // Calculate y positions for stacked bar segments
  const fullHeight = yScale(0);
  let cumulativeY = 0;

  return sortedGroups.map<OverviewSegment>(group => {
    const height = fullHeight - yScale(group.value);
    const y = cumulativeY;

    cumulativeY += height;

    return { ...group, height, y };
  });
};
