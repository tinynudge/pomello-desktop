import { Cache, ServiceConfig } from '@domain';
import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import markCheckItemComplete from './api/markCheckItemComplete';
import moveCardToList from './api/moveCardToList';
import { TrelloCache, TrelloConfig } from './domain';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const onTaskTimerEndPromptHandled = (
  config: ServiceConfig<TrelloConfig>,
  cache: Cache<TrelloCache>,
  currentTaskId: string,
  action: string
): TaskTimerEndPromptHandledAction => {
  const { currentList } = cache.get();
  const currentTask = findOrFailTask(cache, currentTaskId);

  if (isCheckItem(currentTask)) {
    markCheckItemComplete(currentTask);
  } else {
    const updatedPreferences = { ...config.get().preferences };
    updatedPreferences.lists = {
      ...updatedPreferences.lists,
      [currentList.id]: {
        ...updatedPreferences.lists?.[currentList.id],
        doneList: action,
      },
    };

    cache.set(draft => {
      draft.preferences.doneList = action;
    });

    config.set('preferences', updatedPreferences);

    moveCardToList(currentTask, action);
  }

  return 'switchTask';
};

export default onTaskTimerEndPromptHandled;
