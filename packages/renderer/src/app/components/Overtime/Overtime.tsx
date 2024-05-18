import { useStore } from '@/app/context/StoreContext';
import cc from 'classcat';
import { Component, Show, createMemo } from 'solid-js';
import styles from './Overtime.module.scss';

export const Overtime: Component = () => {
  const store = useStore();

  const getTime = createMemo(() => {
    const overtime = store.pomelloState.overtime;

    if (!overtime) {
      return;
    }

    const hours = Math.floor(overtime.time / 3600);
    const minutes = Math.floor((overtime.time - hours * 3600) / 60);
    const seconds = overtime.time % 60;

    const timeUnits: string[] = [];

    if (hours) {
      timeUnits.push(`${hours}`);
    }

    if (hours || minutes) {
      timeUnits.push(hours && minutes < 10 ? `0${minutes}` : `${minutes}`);
    }

    timeUnits.push(seconds < 10 ? `0${seconds}` : `${seconds}`);

    let time = timeUnits.join(':');

    if (timeUnits.length === 1) {
      time = `:${time}`;
    }

    return time;
  });

  return (
    <Show when={getTime()}>
      {getTime => (
        <div
          class={cc({
            [styles.overtime]: true,
            [styles.dialVisible]: Boolean(store.pomelloState.timer),
          })}
          data-testid="overtime"
        >
          {getTime()}
        </div>
      )}
    </Show>
  );
};
