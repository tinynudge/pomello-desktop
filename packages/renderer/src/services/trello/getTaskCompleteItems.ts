import { TaskCompleteItems } from '@domain';
import markCheckItemComplete from './api/markCheckItemComplete';
import createMoveCardList from './helpers/createMoveCardList';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import { TrelloRuntime } from './TrelloRuntime';

const getTaskCompleteItems = (
  { cache, translate }: TrelloRuntime,
  taskId: string
): TaskCompleteItems => {
  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    return createMoveCardList(translate, cache);
  }

  markCheckItemComplete(task);
};

export default getTaskCompleteItems;
