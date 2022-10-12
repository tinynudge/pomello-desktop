import { TrelloRuntime } from './TrelloRuntime';

const onTaskSelect = ({ cache, config }: TrelloRuntime, optionId: string): false | void => {
  if (optionId === 'switch-lists') {
    cache.set(draft => {
      draft.previousListId = config.get().currentList;
    });

    config.unset('currentList');

    return false;
  }
};

export default onTaskSelect;
