import { unwrap } from 'solid-js/store';
import { moveCardToList } from '../api/moveCardToList';
import { TrelloCard, TrelloRuntime } from '../domain';

export const moveCardAndUpdateDoneList = async (
  { config, cache, logger, translate }: TrelloRuntime,
  task: TrelloCard,
  listId: string
): Promise<void> => {
  const currentList = cache.store.currentList;
  const lists = cache.store.lists;
  const log = cache.store.log;
  const preferences = cache.store.preferences;
  const position = config.store.completedTaskPosition ?? 'top';

  if (preferences.keepLogs && log) {
    const list = lists.get(listId);

    if (list) {
      log.addEntry(translate('commentLogTaskMove', { list: list.name })).save();
    }
  }

  const updatedPreferences = { ...unwrap(config.store.preferences) };
  updatedPreferences.lists = {
    ...updatedPreferences.lists,
    [currentList.id]: {
      ...updatedPreferences.lists?.[currentList.id],
      doneList: listId,
    },
  };

  cache.actions.doneListUpdated(listId);
  config.actions.preferencesUpdated(updatedPreferences);

  logger.debug('Will move Trello card');

  await moveCardToList({
    card: task,
    closed: preferences.archiveCards,
    listId,
    position,
  });

  logger.debug('Did move Trello card');
};
