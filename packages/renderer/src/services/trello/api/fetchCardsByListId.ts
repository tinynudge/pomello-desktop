import { TrelloCard } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

const limit = 300;

// Since Trello blocks requests if there are too many cards, we'll need to chunk
// the requests to ensure we stay within the limit.
export const fetchCardsByListId = async (
  listId: string,
  previousCards: TrelloCard[] = []
): Promise<TrelloCard[]> => {
  const lastCard = previousCards.at(-1);

  const searchParams: Record<string, string> = {
    actions: 'commentCard',
    checklists: 'all',
    limit: `${limit}`,
    sort: '-id',
  };

  if (lastCard) {
    searchParams.before = lastCard.id;
  }

  const data = await getTrelloClient()
    .get(`lists/${listId}/cards`, { searchParams })
    .json<TrelloCard[]>();

  const cards: TrelloCard[] = [...previousCards, ...data];

  if (data.length === limit) {
    return fetchCardsByListId(listId, cards);
  }

  return cards;
};
