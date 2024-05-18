import {
  TaskCompletePromptHandledEvent,
  TaskCompletePromptHandledResponse,
} from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';
import { moveCardAndUpdateDoneList } from './helpers/moveCardAndUpdateDoneList';

export const onTaskCompletePromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskCompletePromptHandledEvent
): TaskCompletePromptHandledResponse => {
  const task = findOrFailTask(runtime.cache, taskId);
  const isCurrentList = runtime.cache.store.currentList.id === optionId;

  if (!isCheckItem(task) && !isCurrentList) {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }

  return {
    shouldRemoveTaskFromCache: !isCurrentList,
  };
};
