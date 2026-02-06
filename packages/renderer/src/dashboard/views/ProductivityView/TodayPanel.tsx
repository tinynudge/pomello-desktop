import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { useQuery } from '@tanstack/solid-query';
import { format } from 'date-fns';
import { Component } from 'solid-js';
import { StatItem, StatsDisplay } from './StatsDisplay';

export const TodayPanel: Component = () => {
  const pomelloApi = usePomelloApi();
  const t = useTranslate();

  const todaysProductivity = useQuery<StatItem[]>(() => ({
    queryKey: ['todaysProductivity'],
    queryFn: async () => {
      const events = await pomelloApi.fetchEvents({
        startDate: format(new Date(), 'yyyy-MM-dd'),
      });

      let pomodoros = 0;
      let taskTime = 0;
      let breakTime = 0;
      let voidedPomodoros = 0;

      events.forEach(event => {
        if (event.type === 'break') {
          breakTime += event.meta.duration;
        } else if (event.type === 'task') {
          pomodoros += event.meta.pomodoros;
          taskTime += event.meta.duration;
        } else if (event.type === 'void') {
          voidedPomodoros += event.meta.voidedPomodoros;
        }
      });

      return [
        { label: t('statLabel.pomodoros'), type: 'number', value: pomodoros },
        { label: t('statLabel.taskTime'), type: 'duration', value: taskTime },
        { label: t('statLabel.breakTime'), type: 'duration', value: breakTime },
        { label: t('statLabel.voidedPomodoros'), type: 'number', value: voidedPomodoros },
      ];
    },
    throwOnError: true,
  }));

  return (
    <Panel heading={t('todayLabel')}>
      <StatsDisplay isLoading={todaysProductivity.isLoading} stats={todaysProductivity.data} />
    </Panel>
  );
};
