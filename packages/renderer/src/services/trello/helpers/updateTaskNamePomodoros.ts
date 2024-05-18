import { incrementTaskNamePomodoros } from '@/shared/helpers/incrementTaskNamePomodoros';
import { updateCard } from '../api/updateCard';
import { updateCheckItem } from '../api/updateCheckItem';
import { TrelloRuntime } from '../domain';
import { findOrFailTask } from './findOrFailTask';
import { isCheckItem } from './isCheckItem';

export const updateTaskNamePomodoros = (
  runtime: TrelloRuntime,
  taskId: string,
  timer: {
    adjustedTotalTime: number;
    time: number;
    totalTime: number;
  }
): void => {
  const { cache, settings } = runtime;
  const titleFormat = settings.titleFormat;
  const titleMarker = settings.titleMarker;

  const task = findOrFailTask(cache, taskId);

  const updatedLabel = incrementTaskNamePomodoros({
    taskName: task.name,
    marker: titleMarker,
    mode: titleFormat,
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
