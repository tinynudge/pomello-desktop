import {
  TaskTimerEndPromptHandledEvent,
  TaskTimerEndPromptHandledResponse,
} from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { completeCheckItem } from './helpers/completeCheckItem';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';
import { moveCardAndUpdateDoneList } from './helpers/moveCardAndUpdateDoneList';

export const onTaskTimerEndPromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskTimerEndPromptHandledEvent
): TaskTimerEndPromptHandledResponse => {
  const task = findOrFailTask(runtime.cache, taskId);
  const isCurrentList = runtime.cache.store.currentList.id === optionId;

  if (isCheckItem(task)) {
    return {
      action: 'switchTask',
      removeTask: async () => await completeCheckItem(runtime, task),
    };
  }

  if (!isCurrentList) {
    return {
      action: 'switchTask',
      removeTask: async () => await moveCardAndUpdateDoneList(runtime, task, optionId),
    };
  }

  return {
    action: 'switchTask',
  };
};
