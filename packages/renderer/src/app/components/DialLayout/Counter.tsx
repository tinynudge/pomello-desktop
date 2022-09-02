import { FC } from 'react';
import cc from 'classcat';
import styles from './Counter.module.scss';

interface CounterProps {
  time: number;
}

const Counter: FC<CounterProps> = ({ time }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const isSubMinute = minutes === 0;

  let count = `${minutes}`;
  if (isSubMinute) {
    count = seconds < 10 ? `0${seconds}` : `${seconds}`;
  }

  const rotation = (60 - seconds) * 6;

  return (
    <>
      <span
        className={cc({
          [styles.count]: true,
          [styles.isSubMinute]: isSubMinute,
        })}
      >
        {count}
      </span>
      {!isSubMinute && (
        <span className={styles.dot} style={{ transform: `rotate(-${rotation}deg)` }} />
      )}
    </>
  );
};

export default Counter;
