import moveCardToList from '../api/moveCardToList';
import { TrelloCard } from '../domain';
import { TrelloRuntime } from '../TrelloRuntime';

const moveCardAndUpdateDoneList = async (
  { config, cache, logger, translate }: TrelloRuntime,
  task: TrelloCard,
  listId: string
): Promise<void> => {
  const { currentList, lists, log, preferences } = cache.get();
  const position = config.get().completedTaskPosition ?? 'top';

  if (preferences.keepLogs && log) {
    const list = lists.get(listId);

    if (list) {
      log.addEntry(translate('commentLogTaskMove', { list: list.name })).save();
    }
  }

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

  logger.debug('Will move Trello card');

  await moveCardToList({
    card: task,
    closed: preferences.archiveCards,
    listId,
    position,
  });

  logger.debug('Did move Trello card');
};

export default moveCardAndUpdateDoneList;
