import parseTaskName from '../parseTaskName';
import getFraction from './getFraction';
import roundToNearestEighth from './roundToNearestEighth';

interface IncrementTaskNamePomodorosOptions {
  marker: string;
  mode: string;
  taskName: string;
  timer: {
    time: number;
    totalTime: number;
  };
}

const incrementTaskNamePomodoros = ({
  marker,
  mode,
  taskName,
  timer,
}: IncrementTaskNamePomodorosOptions): string => {
  const { pomodoroCount, name } = parseTaskName(taskName, marker);

  const remainingTime = timer.totalTime - timer.time;
  const addedPomodoros = roundToNearestEighth(remainingTime / timer.totalTime);
  const totalPomodoros = pomodoroCount + addedPomodoros;

  let updatedCount = `${totalPomodoros}`;

  if (mode === 'fraction') {
    const wholePomodoro = Math.floor(totalPomodoros);
    const remainingPomodoroFraction = getFraction(totalPomodoros % 1) ?? '';

    updatedCount = `${wholePomodoro}${remainingPomodoroFraction}`;
  }

  return `${updatedCount} ${marker} ${name}`;
};

export default incrementTaskNamePomodoros;
