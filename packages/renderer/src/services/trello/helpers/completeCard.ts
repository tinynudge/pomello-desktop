import { markCardComplete } from '../api/markCardComplete';
import { TrelloCard, TrelloRuntime } from '../domain';

export const completeCard = async (
  { cache, logger, translate }: TrelloRuntime,
  card: TrelloCard
): Promise<void> => {
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  if (preferences.keepLogs && log) {
    log.addEntry(translate('commentLogCardComplete')).save();
  }

  logger.debug('Will complete Trello card');

  await markCardComplete(card);

  logger.debug('Did complete Trello card');
};
