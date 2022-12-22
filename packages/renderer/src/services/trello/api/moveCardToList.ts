import { TrelloCard } from '../domain';
import trelloClient from '../trelloClient';

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
  await trelloClient.put(`/cards/${card.id}`, {
    closed: closed ?? null,
    idList: listId,
    pos: position,
  });
};

export default moveCardToList;
