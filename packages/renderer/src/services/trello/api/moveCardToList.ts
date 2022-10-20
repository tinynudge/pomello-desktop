import { TrelloCard } from '../domain';
import trelloClient from '../trelloClient';

const moveCardToList = async (
  card: TrelloCard,
  listId: string,
  position: 'top' | 'bottom'
): Promise<void> => {
  await trelloClient.put(`/cards/${card.id}`, {
    idList: listId,
    pos: position,
  });
};

export default moveCardToList;
