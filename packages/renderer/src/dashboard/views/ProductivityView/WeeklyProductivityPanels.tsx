import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { useQuery } from '@tanstack/solid-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { Component, createSignal } from 'solid-js';
import { HistoryPanel } from './HistoryPanel';
import { StatItem, StatsDisplay } from './StatsDisplay';

export const WeeklyProductivityPanels: Component = () => {
  const pomelloApi = usePomelloApi();
  const t = useTranslate();

  const initialDateRange: [Date, Date] = [startOfWeek(new Date()), endOfWeek(new Date())];
  const [dateRange, setDateRange] = createSignal<[Date, Date]>(initialDateRange);

  const weeklyProductivity = useQuery<StatItem[]>(() => ({
    queryKey: ['weekProductivity', dateRange()[0].getTime(), dateRange()[1].getTime()],
    queryFn: async () => {
      const [startDate, endDate] = dateRange();

      const events = await pomelloApi.fetchEvents({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      });

      let totalPomodoros = 0;
      let averagePomodoros = 0;
      let totalTaskTime = 0;
      let averageTaskTime = 0;

      const activeDays = new Set<string>();

      events.forEach(event => {
        if (event.type === 'task') {
          totalPomodoros += event.meta.pomodoros;
          totalTaskTime += event.meta.duration;

          activeDays.add(event.startTime.substring(0, 10));
        }
      });

      if (activeDays.size > 0) {
        averagePomodoros = totalPomodoros / activeDays.size;
        averageTaskTime = totalTaskTime / activeDays.size;
      }

      return [
        { label: t('statLabel.totalPomodoros'), type: 'number', value: totalPomodoros },
        { label: t('statLabel.averagePomodoros'), type: 'number', value: averagePomodoros },
        { label: t('statLabel.totalTaskTime'), type: 'duration', value: totalTaskTime },
        { label: t('statLabel.averageTaskTime'), type: 'duration', value: averageTaskTime },
      ];
    },
    throwOnError: true,
  }));

  return (
    <>
      <Panel heading={t('weekOf', { week: format(dateRange()[0], 'MMMM d') })}>
        <StatsDisplay isLoading={weeklyProductivity.isLoading} stats={weeklyProductivity.data} />
      </Panel>
      <HistoryPanel
        getDateRange={dateRange}
        initialDateRange={initialDateRange}
        onDateRangeChange={setDateRange}
      />
    </>
  );
};
