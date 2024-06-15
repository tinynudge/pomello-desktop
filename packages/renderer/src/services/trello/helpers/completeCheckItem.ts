import { markCheckItemComplete } from '../api/markCheckItemComplete';
import { TrelloCheckItem, TrelloRuntime } from '../domain';

export const completeCheckItem = async (
  { cache, logger, translate }: TrelloRuntime,
  checkItem: TrelloCheckItem
): Promise<void> => {
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  if (preferences.keepLogs && log) {
    log.addEntry(translate('commentLogCheckItemComplete')).save();
  }

  logger.debug('Will complete Trello check item');

  await markCheckItemComplete(checkItem);

  logger.debug('Did complete Trello check item');
};
