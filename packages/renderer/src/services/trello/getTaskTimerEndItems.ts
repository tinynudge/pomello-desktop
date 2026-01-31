import { TaskTimerEndItems } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { createCardListItems } from './helpers/createCardListItems';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const MARK_CHECK_ITEM_COMPLETE_ID = 'check-item-complete';

export const getTaskTimerEndItems = (
  { cache, translate }: TrelloRuntime,
  currentTaskId: string
): TaskTimerEndItems => {
  const currentTask = findOrFailTask(cache, currentTaskId);

  if (isCheckItem(currentTask)) {
    return {
      items: [
        {
          id: MARK_CHECK_ITEM_COMPLETE_ID,
          label: translate('completeCheckItemLabel'),
        },
      ],
      completeTaskItemId: MARK_CHECK_ITEM_COMPLETE_ID,
    };
  }

  return createCardListItems(translate, cache);
};
