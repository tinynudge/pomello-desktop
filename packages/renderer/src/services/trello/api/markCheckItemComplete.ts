import { TrelloCheckItem } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

export const markCheckItemComplete = async (checkItem: TrelloCheckItem): Promise<void> => {
  await getTrelloClient().put(`cards/${checkItem.idCard}/checkItem/${checkItem.id}`, {
    json: {
      state: 'complete',
    },
  });
};
