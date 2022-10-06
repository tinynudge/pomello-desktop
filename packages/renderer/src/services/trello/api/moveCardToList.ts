import { TrelloCard } from '../domain';
import trelloClient from '../trelloClient';

const moveCardToList = async (card: TrelloCard, listId: string): Promise<void> => {
  await trelloClient.put(`/cards/${card.id}`, { idList: listId });
};

export default moveCardToList;
