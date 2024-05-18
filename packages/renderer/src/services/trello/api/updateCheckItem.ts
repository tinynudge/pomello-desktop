import { TrelloCheckItem } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

type UpdateCheckItemOptions = {
  id: string;
  cardId: string;
  data: CheckItemData;
};

type CheckItemData = Partial<Omit<TrelloCheckItem, 'id' | 'idCard'>>;

export const updateCheckItem = async (options: UpdateCheckItemOptions): Promise<void> => {
  await getTrelloClient().put(`cards/${options.cardId}/checkItem/${options.id}`, {
    json: options.data,
  });
};
