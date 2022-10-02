import { selectIsTimerVisible, selectOvertime } from '@/app/appSlice';
import cc from 'classcat';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './Overtime.module.scss';

const Overtime: FC = () => {
  const isTimerVisible = useSelector(selectIsTimerVisible);
  const overtime = useSelector(selectOvertime);

  if (!overtime) {
    return null;
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

  return (
    <div
      className={cc({
        [styles.overtime]: true,
        [styles.dialVisible]: isTimerVisible,
      })}
      data-testid="overtime"
    >
      {time}
    </div>
  );
};

export default Overtime;
