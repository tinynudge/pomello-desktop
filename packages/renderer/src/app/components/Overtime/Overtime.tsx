import { Overtime as IOvertime } from '@tinynudge/pomello-service';
import cc from 'classcat';
import { FC } from 'react';
import styles from './Overtime.module.scss';

interface OvertimeProps {
  isDialVisible: boolean;
  overtime: IOvertime;
}

const Overtime: FC<OvertimeProps> = ({ isDialVisible, overtime }) => {
  const hours = Math.floor(overtime.time / 3600);
  const minutes = Math.floor((overtime.time - hours * 3600) / 60);
  const seconds = overtime.time % 60;

  const timeUnits: string[] = [];

  if (hours) {
    timeUnits.push(`${hours}`);
  }

  if (minutes) {
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
        [styles.dialVisible]: isDialVisible,
      })}
      data-testid="overtime"
    >
      {time}
    </div>
  );
};

export default Overtime;
