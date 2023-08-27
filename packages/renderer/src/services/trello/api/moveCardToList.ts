import { TrelloCard } from '../domain';
import getTrelloClient from '../getTrelloClient';

interface MoveCardToListOptions {
  card: TrelloCard;
  closed?: boolean;
  listId: string;
  position: 'top' | 'bottom';
}

const moveCardToList = async ({
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

export default moveCardToList;
