import { TrelloCard, TrelloRuntime } from './domain';
import { createLogBuilder } from './helpers/createLogBuilder';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const onTaskSelect = (runtime: TrelloRuntime, optionId: string): false | void => {
  const { cache, config } = runtime;
  const { currentList } = config.store;
  const { preferences } = cache.store;

  if (optionId === 'switch-lists') {
    cache.actions.currentListSwitched(currentList);
    config.actions.currentListUnset();

    return false;
  }

  if (preferences.keepLogs) {
    let card = findOrFailTask(cache, optionId);

    if (isCheckItem(card)) {
      card = findOrFailTask(cache, card.idCard);
    }

    cache.actions.logSet(createLogBuilder(runtime, card as TrelloCard));
  }
};
