import {
  TaskCompletePromptHandledEvent,
  TaskCompletePromptHandledResponse,
} from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { completeCard } from './helpers/completeCard';
import { MARK_CARD_COMPLETE_ID } from './helpers/createCardListItems';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';
import { moveCardAndUpdateDoneList } from './helpers/moveCardAndUpdateDoneList';

export const onTaskCompletePromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskCompletePromptHandledEvent
): TaskCompletePromptHandledResponse | void => {
  const task = findOrFailTask(runtime.cache, taskId);
  const isCurrentList = runtime.cache.store.currentList.id === optionId;

  if (isCheckItem(task)) {
    // Check items are already handled in getTaskCompleteItems
    return;
  }

  if (optionId === MARK_CARD_COMPLETE_ID) {
    return {
      removeTask: async () => await completeCard(runtime, task),
    };
  }

  if (!isCurrentList) {
    return {
      removeTask: async () => await moveCardAndUpdateDoneList(runtime, task, optionId),
    };
  }
};
