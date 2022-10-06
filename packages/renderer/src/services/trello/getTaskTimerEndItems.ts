import { Cache, TaskTimerEndItems, Translate } from '@domain';
import { TrelloCache } from './domain';
import createMoveCardList from './helpers/createMoveCardList';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const getTaskTimerEndItems = (
  translate: Translate,
  cache: Cache<TrelloCache>,
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

export default getTaskTimerEndItems;
