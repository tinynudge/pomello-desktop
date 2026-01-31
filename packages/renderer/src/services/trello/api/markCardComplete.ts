import { TrelloCard } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

export const markCardComplete = async (card: TrelloCard): Promise<void> => {
  await getTrelloClient().put(`cards/${card.id}`, {
    json: {
      dueComplete: true,
    },
  });
};
