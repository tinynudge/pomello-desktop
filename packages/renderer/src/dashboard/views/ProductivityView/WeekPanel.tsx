import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { format } from 'date-fns';
import { Component, createMemo } from 'solid-js';
import { StatItem, StatsDisplay } from './StatsDisplay';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

type WeekPanelProps = {
  isLoading: boolean;
  startDate: Date;
  weeklyProductivity: WeeklyProductivity;
};

export const WeekPanel: Component<WeekPanelProps> = props => {
  const t = useTranslate();

  const getWeeklyProductivityStats = createMemo<StatItem[]>(() => {
    const weeklyProductivity = props.weeklyProductivity ?? new Map();

    let totalPomodoros = 0;
    let averagePomodoros = 0;
    let totalTaskTime = 0;
    let averageTaskTime = 0;

    for (const { pomodoros, taskTime } of weeklyProductivity.values()) {
      totalPomodoros += pomodoros;
      totalTaskTime += taskTime;
    }

    if (weeklyProductivity.size > 0) {
      averagePomodoros = totalPomodoros / weeklyProductivity.size;
      averageTaskTime = totalTaskTime / weeklyProductivity.size;
    }

    return [
      { label: t('statLabel.totalPomodoros'), type: 'number', value: totalPomodoros },
      { label: t('statLabel.averagePomodoros'), type: 'number', value: averagePomodoros },
      { label: t('statLabel.totalTaskTime'), type: 'duration', value: totalTaskTime },
      { label: t('statLabel.averageTaskTime'), type: 'duration', value: averageTaskTime },
    ];
  });

  return (
    <Panel heading={t('weekOf', { week: format(props.startDate, 'MMMM d') })}>
      <StatsDisplay isLoading={props.isLoading} stats={getWeeklyProductivityStats()} />
    </Panel>
  );
};
