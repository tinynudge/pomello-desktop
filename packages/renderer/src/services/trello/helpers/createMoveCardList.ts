import { SelectItem, Translate } from '@pomello-desktop/domain';
import { TrelloCache } from '../domain';

type MoveCardList = {
  items: SelectItem[];
  moveTaskItemId?: string;
};

export const createMoveCardList = (translate: Translate, cache: TrelloCache): MoveCardList => {
  const currentBoard = cache.store.currentBoard;
  const preferences = cache.store.preferences;

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
