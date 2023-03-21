import markCheckItemComplete from '../api/markCheckItemComplete';
import { TrelloCheckItem } from '../domain';
import { TrelloRuntime } from '../TrelloRuntime';

const completeCheckItem = (
  { cache, logger, translate }: TrelloRuntime,
  checkItem: TrelloCheckItem
): void => {
  const { log, preferences } = cache.get();

  if (preferences.keepLogs && log) {
    log.addEntry(translate('commentLogCheckItemComplete')).save();
  }

  logger.debug('Will complete Trello check item');

  markCheckItemComplete(checkItem);

  logger.debug('Did complete Trello check item');
};

export default completeCheckItem;
