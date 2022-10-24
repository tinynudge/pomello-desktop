import markCheckItemComplete from '../api/markCheckItemComplete';
import { TrelloCheckItem } from '../domain';
import { TrelloRuntime } from '../TrelloRuntime';

const completeCheckItem = (
  { cache, translate }: TrelloRuntime,
  checkItem: TrelloCheckItem
): void => {
  const { log, preferences } = cache.get();

  if (preferences.keepLogs && log) {
    log.addEntry(translate('commentLogCheckItemComplete')).save();
  }

  markCheckItemComplete(checkItem);
};

export default completeCheckItem;
