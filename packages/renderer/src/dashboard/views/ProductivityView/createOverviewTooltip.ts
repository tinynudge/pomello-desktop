import { Tooltip } from './ChartTooltip';
import { OverviewSegment } from './createOverviewsSegments';
import { FetchTaskName } from './useFetchTaskNames';

export const createOverviewTooltip = (
  segment: OverviewSegment,
  fetchTaskName: FetchTaskName
): Tooltip => {
  const tooltip: Tooltip = {
    getTitle: () =>
      fetchTaskName({
        date: segment.date,
        service: segment.service,
        taskId: segment.serviceId,
      }),
    key: segment.serviceId,
  };

  if (segment.type === 'task') {
    tooltip.stats = [
      [
        {
          labelKey: 'tooltip.stat.pomodoros',
          type: 'number',
          value: segment.value,
        },
        {
          labelKey: 'tooltip.stat.taskTime',
          type: 'duration',
          value: segment.duration,
        },
        {
          labelKey: 'tooltip.stat.overTaskTime',
          type: 'duration',
          value: segment.overDuration,
        },
      ],
    ];
  } else {
    tooltip.stats = [
      [
        {
          labelKey: 'tooltip.stat.voidedPomodoros',
          type: 'number',
          value: segment.value,
        },
        {
          labelKey: 'tooltip.stat.voidedTime',
          type: 'duration',
          value: segment.duration,
        },
      ],
    ];
  }

  return tooltip;
};
