import { format, parseISO } from 'date-fns';
import { Tooltip } from './ChartTooltip';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

export const createXColumnTooltip = (
  date: string,
  weeklyProductivity: WeeklyProductivity
): Tooltip => {
  const productivity = weeklyProductivity.get(date);

  const tooltip: Tooltip = {
    title: format(parseISO(date), 'EEEE, MMMM d, yyyy'),
  };

  if (productivity) {
    tooltip.stats = [
      [
        {
          labelKey: 'tooltip.stat.pomodoros',
          type: 'number',
          value: productivity.pomodoros,
        },
        {
          labelKey: 'tooltip.stat.taskTime',
          type: 'duration',
          value: productivity.taskTime,
        },
        {
          labelKey: 'tooltip.stat.overTaskTime',
          type: 'duration',
          value: productivity.overTaskTime,
        },
      ],
      [
        {
          labelKey: 'tooltip.stat.breakTime',
          type: 'duration',
          value: productivity.breakTime,
        },
        {
          labelKey: 'tooltip.stat.overBreakTime',
          type: 'duration',
          value: productivity.overBreakTime,
        },
      ],
      [
        {
          labelKey: 'tooltip.stat.voidedPomodoros',
          type: 'number',
          value: productivity.voidedPomodoros,
        },
        {
          labelKey: 'tooltip.stat.voidedTime',
          type: 'duration',
          value: productivity.voidTime,
        },
      ],
    ];
  }

  return tooltip;
};
