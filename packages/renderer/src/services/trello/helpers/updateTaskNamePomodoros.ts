import incrementTaskPomodoroCount from '@/shared/helpers/incrementTaskNamePomodoros';
import updateCard from '../api/updateCard';
import updateCheckItem from '../api/updateCheckItem';
import { TrelloRuntime } from '../TrelloRuntime';
import findOrFailTask from './findOrFailTask';
import isCheckItem from './isCheckItem';

const updateTaskNamePomodoros = (
  runtime: TrelloRuntime,
  taskId: string,
  timer: {
    adjustedTotalTime: number;
    time: number;
    totalTime: number;
  }
): void => {
  const { cache, settings } = runtime;

  const task = findOrFailTask(cache, taskId);

  const updatedLabel = incrementTaskPomodoroCount({
    taskName: task.name,
    marker: settings.titleMarker,
    mode: settings.titleFormat,
    timer,
  });

  if (isCheckItem(task)) {
    updateCheckItem({
      id: task.id,
      cardId: task.idCard,
      data: {
        name: updatedLabel,
      },
    });

    return updateTaskNamePomodoros(runtime, task.idCard, timer);
  }

  updateCard({
    id: taskId,
    data: {
      name: updatedLabel,
    },
  });
};

export default updateTaskNamePomodoros;
