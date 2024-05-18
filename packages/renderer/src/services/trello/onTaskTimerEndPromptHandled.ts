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
    completeCheckItem(runtime, task);
  } else if (!isCurrentList) {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }

  return {
    action: 'switchTask',
    shouldRemoveTaskFromCache: !isCurrentList,
  };
};
