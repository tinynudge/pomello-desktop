import { Cache, TaskTimerEndItems, Translate } from '@domain';
import { TrelloCache } from './domain';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const getTaskTimerEndItems = (
  cache: Cache<TrelloCache>,
  translate: Translate,
  currentTaskId: string
): TaskTimerEndItems => {
  const { currentBoard, preferences } = cache.get();

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

  return {
    items: [
      {
        id: 'move-card',
        items: currentBoard.lists.map(list => ({ id: list.id, label: list.name })),
        label: translate('moveTaskLabel'),
        type: 'group',
      },
    ],
    moveTaskItemId: preferences.doneList,
  };
};

export default getTaskTimerEndItems;
