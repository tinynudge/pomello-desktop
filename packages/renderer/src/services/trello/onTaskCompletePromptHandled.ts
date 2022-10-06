import { Cache, ServiceConfig } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';

const onTaskCompletePromptHandled = (
  config: ServiceConfig<TrelloConfig>,
  cache: Cache<TrelloCache>,
  taskId: string,
  optionId: string
): void => {
  const task = findOrFailTask(cache, taskId);

  if (!isCheckItem(task)) {
    moveCardAndUpdateDoneList(config, cache, task, optionId);
  }
};

export default onTaskCompletePromptHandled;
