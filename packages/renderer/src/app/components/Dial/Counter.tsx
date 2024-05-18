import { useStore } from '@/app/context/StoreContext';
import cc from 'classcat';
import { Component, Show, createMemo } from 'solid-js';
import styles from './Counter.module.scss';

export const Counter: Component = () => {
  const store = useStore();

  const getCounter = createMemo(() => {
    const time = store.pomelloState.timer?.time ?? 0;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const isSubMinute = minutes === 0;

    let count = `${minutes}`;
    if (isSubMinute) {
      count = seconds < 10 ? `0${seconds}` : `${seconds}`;
    }

    const rotation = (60 - seconds) * 6;

    return {
      count,
      isSubMinute,
      rotation,
    };
  });

  return (
    <>
      <span
        class={cc({
          [styles.count]: true,
          [styles.isSubMinute]: getCounter().isSubMinute,
        })}
      >
        {getCounter().count}
      </span>
      <Show when={!getCounter().isSubMinute}>
        <span class={styles.dot} style={{ transform: `rotate(-${getCounter().rotation}deg)` }} />
      </Show>
    </>
  );
};
