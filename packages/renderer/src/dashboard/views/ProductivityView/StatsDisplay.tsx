import { LoadingDots } from '@/ui/dashboard/LoadingDots';
import { Component, createUniqueId, For, Match, Switch } from 'solid-js';
import styles from './StatsDisplay.module.scss';

type StatsDisplayProps = {
  isLoading: boolean;
  stats?: StatItem[];
};

export type StatItem = {
  label: string;
  type: 'number' | 'duration';
  value: number;
};

export const StatsDisplay: Component<StatsDisplayProps> = props => {
  const formatNumber = (value: number) => value.toFixed(2).replace(/\.00$/, '');

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = `${Math.floor((duration % 3600) / 60)}`.padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const id = createUniqueId();

  return (
    <Switch>
      <Match when={props.isLoading}>
        <LoadingDots class={styles.loadingDots} />
      </Match>
      <Match when={props.stats}>
        <dl class={styles.statsDisplay}>
          <For each={props.stats}>
            {(item, getIndex) => (
              <>
                <dt id={`stat-${id}-${getIndex()}`}>{item.label}</dt>
                <dd aria-labelledby={`stat-${id}-${getIndex()}`}>
                  {item.type === 'number' ? formatNumber(item.value) : formatDuration(item.value)}
                </dd>
              </>
            )}
          </For>
        </dl>
      </Match>
    </Switch>
  );
};
