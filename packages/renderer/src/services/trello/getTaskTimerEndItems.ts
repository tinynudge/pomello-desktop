import { TaskTimerEndItems } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { createMoveCardList } from './helpers/createMoveCardList';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const getTaskTimerEndItems = (
  { cache, translate }: TrelloRuntime,
  currentTaskId: string
): TaskTimerEndItems => {
  const currentTask = findOrFailTask(cache, currentTaskId);

  if (isCheckItem(currentTask)) {
    return {
      items: [
        {
          id: 'check-item-complete',
          label: translate('completeCheckItemLabel'),
        },
      ],
      moveTaskItemId: 'check-item-complete',
    };
  }

  return createMoveCardList(translate, cache);
};
