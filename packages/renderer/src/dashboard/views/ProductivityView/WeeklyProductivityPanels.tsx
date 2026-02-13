import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useQuery } from '@tanstack/solid-query';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { Component, createMemo, createSignal } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { HistoryPanel } from './HistoryPanel';
import { WeekPanel } from './WeekPanel';

export type WeeklyProductivity = Map<
  string,
  {
    breakTime: number;
    events: TrackingEvent[];
    pomodoros: number;
    taskTime: number;
    voidedPomodoros: number;
  }
>;

export const WeeklyProductivityPanels: Component = () => {
  const pomelloApi = usePomelloApi();

  const initialDateRange: [Date, Date] = [startOfWeek(new Date()), endOfWeek(new Date())];
  const [getDateRange, setDateRange] = createSignal<[Date, Date]>(initialDateRange);

  const events = useQuery<TrackingEvent[]>(() => ({
    queryKey: ['weekProductivity', getDateRange()[0].getTime(), getDateRange()[1].getTime()],
    queryFn: async () => {
      const [startDate, endDate] = getDateRange();

      return await pomelloApi.fetchEvents({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      });
    },
    throwOnError: true,
  }));

  const getWeeklyProductivity = createMemo<WeeklyProductivity>(() => {
    const productivity: WeeklyProductivity = new Map();

    if (!events.data) {
      return productivity;
    }

    events.data.forEach(event => {
      if (event.type === 'note') {
        return;
      }

      const date = event.startTime.substring(0, 10);

      const dateData = productivity.get(date) ?? {
        breakTime: 0,
        events: [],
        pomodoros: 0,
        taskTime: 0,
        voidedPomodoros: 0,
      };

      dateData.events.push(unwrap(event));

      if (event.type === 'task') {
        dateData.pomodoros += event.meta.pomodoros;
        dateData.taskTime += event.meta.duration;
      } else if (event.type === 'break') {
        dateData.breakTime += event.meta.duration;
      } else if (event.type === 'void') {
        dateData.voidedPomodoros += event.meta.voidedPomodoros;
      }

      productivity.set(date, dateData);
    });

    return productivity;
  });

  return (
    <>
      <WeekPanel
        isLoading={events.isLoading}
        startDate={getDateRange()[0]}
        weeklyProductivity={getWeeklyProductivity()}
      />
      <HistoryPanel
        dateRange={getDateRange()}
        initialDateRange={initialDateRange}
        onDateRangeChange={setDateRange}
        weeklyProductivity={getWeeklyProductivity()}
      />
    </>
  );
};
