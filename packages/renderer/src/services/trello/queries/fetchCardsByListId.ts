import { TrelloCard } from '../domain/TrelloCard';
import trelloClient from '../trelloClient';

const limit = 300;

// Since Trello blocks requests if there are too many cards, we'll need to chunk
// the requests to ensure we stay within the limit.
const fetchCardsByListId = async (
  listId: string,
  previousCards: TrelloCard[] = []
): Promise<TrelloCard[]> => {
  const lastCard = previousCards.at(-1);

  const { data } = await trelloClient.get(`lists/${listId}/cards`, {
    params: {
      actions: 'commentCard',
      before: lastCard?.id,
      checklists: 'all',
      limit,
      sort: '-id',
    },
  });

  const cards: TrelloCard[] = [...previousCards, ...data];

  if (data.length === limit) {
    return fetchCardsByListId(listId, cards);
  }

  return cards;
};

export default fetchCardsByListId;
