import moveCardToList from '../api/moveCardToList';
import { TrelloCard } from '../domain';
import { TrelloRuntime } from '../TrelloRuntime';

const moveCardAndUpdateDoneList = (
  { config, cache }: TrelloRuntime,
  task: TrelloCard,
  listId: string
): void => {
  const { currentList } = cache.get();
  const position = config.get().completedTaskPosition ?? 'top';

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

  moveCardToList(task, listId, position);
};

export default moveCardAndUpdateDoneList;
