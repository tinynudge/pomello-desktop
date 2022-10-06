import { Cache, TaskCompleteItems, Translate } from '@domain';
import markCheckItemComplete from './api/markCheckItemComplete';
import { TrelloCache } from './domain';
import createMoveCardList from './helpers/createMoveCardList';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const getTaskCompleteItems = (
  translate: Translate,
  cache: Cache<TrelloCache>,
  taskId: string
): TaskCompleteItems => {
  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    return createMoveCardList(translate, cache);
  }

  markCheckItemComplete(task);
};

export default getTaskCompleteItems;
