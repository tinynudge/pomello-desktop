import { GetTaskCompleteItemsParams, GetTaskCompleteItemsResponse } from '@domain';
import { TrelloRuntime } from './TrelloRuntime';
import completeCheckItem from './helpers/completeCheckItem';
import createMoveCardList from './helpers/createMoveCardList';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const getTaskCompleteItems = (
  runtime: TrelloRuntime,
  { taskId }: GetTaskCompleteItemsParams
): GetTaskCompleteItemsResponse => {
  const { cache, translate } = runtime;

  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    return createMoveCardList(translate, cache);
  }

  completeCheckItem(runtime, task);

  return {
    shouldRemoveTaskFromCache: true,
  };
};

export default getTaskCompleteItems;
