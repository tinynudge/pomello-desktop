import { GetTaskCompleteItemsParams, TaskCompleteItems } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { completeCheckItem } from './helpers/completeCheckItem';
import { createCardListItems } from './helpers/createCardListItems';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const getTaskCompleteItems = (
  runtime: TrelloRuntime,
  { taskId }: GetTaskCompleteItemsParams
): TaskCompleteItems => {
  const { cache, translate } = runtime;

  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    return createCardListItems(translate, cache);
  }

  return {
    removeTask: async () => await completeCheckItem(runtime, task),
  };
};
