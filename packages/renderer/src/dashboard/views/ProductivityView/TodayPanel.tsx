import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { LoadingDots } from '@/ui/dashboard/LoadingDots';
import { Panel } from '@/ui/dashboard/Panel';
import { useQuery } from '@tanstack/solid-query';
import { format } from 'date-fns';
import { Component, For, Match, Switch } from 'solid-js';
import styles from './TodayPanel.module.scss';

export const TodayPanel: Component = () => {
  const pomelloApi = usePomelloApi();
  const t = useTranslate();

  const events = useQuery(() => ({
    queryKey: ['todaysProductivity'],
    queryFn: async () => {
      const events = await pomelloApi.fetchEvents({
        startDate: format(new Date(), 'yyyy-MM-dd'),
      });

      return events.reduce(
        (stats, event) => {
          if (event.type === 'break') {
            stats.breakTime.value += event.meta.duration;
          } else if (event.type === 'task') {
            stats.pomodoros.value += event.meta.pomodoros;
            stats.taskTime.value += event.meta.duration;
          } else if (event.type === 'void') {
            stats.voidedPomodoros.value += event.meta.voidedPomodoros;
          }

          return stats;
        },
        {
          pomodoros: { type: 'number', value: 0 },
          taskTime: { type: 'duration', value: 0 },
          breakTime: { type: 'duration', value: 0 },
          voidedPomodoros: { type: 'number', value: 0 },
        }
      );
    },
    throwOnError: true,
  }));

  const formatNumber = (value: number) => value.toFixed(2).replace(/\.00$/, '');

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    let minutesString: string = `${minutes}`;

    if (minutes < 10) {
      minutesString = `0${minutes}`;
    }

    return `${hours}:${minutesString}`;
  };

  return (
    <Panel heading={t('todayLabel')}>
      <Switch>
        <Match when={events.data}>
          {getEvents => (
            <dl class={styles.stats}>
              <For each={Object.entries(getEvents())}>
                {([key, { type, value }]) => (
                  <div>
                    <dt id={`stat-${key}`}>{t(`statLabel.${key}`)}</dt>
                    <dd aria-labelledby={`stat-${key}`}>
                      {type === 'number' ? formatNumber(value) : formatDuration(value)}
                    </dd>
                  </div>
                )}
              </For>
            </dl>
          )}
        </Match>
        <Match when={events.isLoading}>
          <LoadingDots class={styles.loadingDots} />
        </Match>
      </Switch>
    </Panel>
  );
};
