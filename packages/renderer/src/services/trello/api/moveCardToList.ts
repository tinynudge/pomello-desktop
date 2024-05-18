import { TrelloCard } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

type MoveCardToListOptions = {
  card: TrelloCard;
  closed?: boolean;
  listId: string;
  position: 'top' | 'bottom';
};

export const moveCardToList = async ({
  card,
  closed,
  listId,
  position,
}: MoveCardToListOptions): Promise<void> => {
  await getTrelloClient().put(`cards/${card.id}`, {
    json: {
      closed: closed ?? null,
      idList: listId,
      pos: position,
    },
  });
};
