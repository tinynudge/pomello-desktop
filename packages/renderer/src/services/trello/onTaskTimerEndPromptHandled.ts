import { Cache, ServiceConfig } from '@domain';
import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import markCheckItemComplete from './api/markCheckItemComplete';
import { TrelloCache, TrelloConfig } from './domain';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';

const onTaskTimerEndPromptHandled = (
  config: ServiceConfig<TrelloConfig>,
  cache: Cache<TrelloCache>,
  taskId: string,
  action: string
): TaskTimerEndPromptHandledAction => {
  const task = findOrFailTask(cache, taskId);

  if (isCheckItem(task)) {
    markCheckItemComplete(task);
  } else {
    moveCardAndUpdateDoneList(config, cache, task, action);
  }

  return 'switchTask';
};

export default onTaskTimerEndPromptHandled;
