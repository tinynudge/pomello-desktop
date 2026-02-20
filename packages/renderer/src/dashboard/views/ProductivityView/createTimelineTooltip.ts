import { addSeconds, parseISO } from 'date-fns';
import { Tooltip, TooltipStat } from './ChartTooltip';
import { TimelineSegment } from './createTimelineSegments';

export const createTimelineTooltip = (segment: TimelineSegment): Tooltip => {
  const primaryStats: TooltipStat[] = [
    {
      labelKey: 'tooltip.stat.type',
      type: 'text',
      valueKey: `chart.type.${segment.type}`,
    },
  ];

  if (segment.event.type === 'task') {
    primaryStats.push({
      labelKey: 'tooltip.stat.pomodoros',
      type: 'number',
      value: segment.event.meta.pomodoros,
    });
  } else if (segment.event.type === 'void') {
    primaryStats.push({
      labelKey: 'tooltip.stat.voidedPomodoros',
      type: 'number',
      value: segment.event.meta.voidedPomodoros,
    });
  }

  const startTime = parseISO(segment.event.startTime);

  const timeStats: TooltipStat[] = [
    {
      labelKey: 'tooltip.stat.startTime',
      type: 'time',
      value: startTime,
    },
    {
      labelKey: 'tooltip.stat.endTime',
      type: 'time',
      value: addSeconds(startTime, segment.duration),
    },
    {
      labelKey: 'tooltip.stat.duration',
      type: 'duration',
      value: segment.duration,
    },
  ];

  return {
    title: segment.event.serviceId,
    stats: [primaryStats, timeStats],
  };
};
