import { SelectItem, Signal, Translate } from '@domain';
import { TrelloCache } from '../domain';

interface MoveCardList {
  items: SelectItem[];
  moveTaskItemId?: string;
}

const createMoveCardList = (translate: Translate, cache: Signal<TrelloCache>): MoveCardList => {
  const { currentBoard, preferences } = cache.get();

  return {
    items: [
      {
        id: 'move-card',
        items: currentBoard.lists.map(list => ({ id: list.id, label: list.name })),
        label: translate('moveTaskLabel'),
        type: 'group',
      },
    ],
    moveTaskItemId: preferences.doneList,
  };
};

export default createMoveCardList;
