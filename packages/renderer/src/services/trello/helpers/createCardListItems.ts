import { SelectItem, Translate } from '@pomello-desktop/domain';
import { TrelloCache } from '../domain';

type CardListItems = {
  completeTaskItemId?: string;
  items: SelectItem[];
  moveTaskItemId?: string;
};

export const MARK_CARD_COMPLETE_ID = 'mark-card-complete';

export const createCardListItems = (translate: Translate, cache: TrelloCache): CardListItems => {
  const currentBoard = cache.store.currentBoard;
  const preferences = cache.store.preferences;

  return {
    items: [
      {
        id: MARK_CARD_COMPLETE_ID,
        label: translate('completeCardLabel'),
      },
      {
        id: 'move-card',
        items: currentBoard.lists.map(list => ({ id: list.id, label: list.name })),
        label: translate('moveTaskLabel'),
        type: 'group',
      },
    ],
    completeTaskItemId: MARK_CARD_COMPLETE_ID,
    moveTaskItemId: preferences.doneList,
  };
};
