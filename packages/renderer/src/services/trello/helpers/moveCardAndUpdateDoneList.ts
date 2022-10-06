import { Cache, ServiceConfig } from '@domain';
import moveCardToList from '../api/moveCardToList';
import { TrelloCache, TrelloCard, TrelloConfig } from '../domain';

const moveCardAndUpdateDoneList = (
  config: ServiceConfig<TrelloConfig>,
  cache: Cache<TrelloCache>,
  task: TrelloCard,
  listId: string
): void => {
  const { currentList } = cache.get();

  const updatedPreferences = { ...config.get().preferences };
  updatedPreferences.lists = {
    ...updatedPreferences.lists,
    [currentList.id]: {
      ...updatedPreferences.lists?.[currentList.id],
      doneList: listId,
    },
  };

  cache.set(draft => {
    draft.preferences.doneList = listId;
  });

  config.set('preferences', updatedPreferences);

  moveCardToList(task, listId);
};

export default moveCardAndUpdateDoneList;
