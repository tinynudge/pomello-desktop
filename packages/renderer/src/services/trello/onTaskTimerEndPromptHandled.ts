import {
  TaskTimerEndPromptHandledEvent,
  TaskTimerEndPromptHandledResponse,
} from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { MARK_CHECK_ITEM_COMPLETE_ID } from './getTaskTimerEndItems';
import { completeCard } from './helpers/completeCard';
import { completeCheckItem } from './helpers/completeCheckItem';
import { MARK_CARD_COMPLETE_ID } from './helpers/createCardListItems';
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
    if (optionId !== MARK_CHECK_ITEM_COMPLETE_ID) {
      throw new Error(`Unknown optionId for check item: ${optionId}`);
    }

    return {
      action: 'switchTask',
      removeTask: async () => await completeCheckItem(runtime, task),
    };
  }

  if (optionId === MARK_CARD_COMPLETE_ID) {
    return {
      action: 'switchTask',
      removeTask: async () => await completeCard(runtime, task),
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
