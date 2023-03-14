import { TrelloCard } from './domain';
import createLogBuilder from './helpers/createLogBuilder';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import { TrelloRuntime } from './TrelloRuntime';

const onTaskSelect = (runtime: TrelloRuntime, optionId: string): false | void => {
  const { cache, config } = runtime;

  if (optionId === 'switch-lists') {
    cache.set(draft => {
      draft.didSwitchList = true;
      draft.previousListId = config.get().currentList;
    });

    config.unset('currentList');

    return false;
  }

  if (cache.get().preferences.keepLogs) {
    let card = findOrFailTask(cache, optionId);

    if (isCheckItem(card)) {
      card = findOrFailTask(cache, card.idCard);
    }

    cache.set(draft => {
      draft.log = createLogBuilder(runtime, card as TrelloCard);
    });
  }
};

export default onTaskSelect;
