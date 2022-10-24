import { TaskCompleteItems } from '@domain';
import completeCheckItem from './helpers/completeCheckItem';
import createMoveCardList from './helpers/createMoveCardList';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import { TrelloRuntime } from './TrelloRuntime';

const getTaskCompleteItems = (runtime: TrelloRuntime, taskId: string): TaskCompleteItems => {
  const { cache, translate } = runtime;

  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    return createMoveCardList(translate, cache);
  }

  completeCheckItem(runtime, task);
};

export default getTaskCompleteItems;
