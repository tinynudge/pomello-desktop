import { TrelloCheckItem } from '../domain';
import getTrelloClient from '../getTrelloClient';

interface UpdateCheckItemOptions {
  id: string;
  cardId: string;
  data: CheckItemData;
}

type CheckItemData = Partial<Omit<TrelloCheckItem, 'id' | 'idCard'>>;

const updateCheckItem = async (options: UpdateCheckItemOptions): Promise<void> => {
  await getTrelloClient().put(`cards/${options.cardId}/checkItem/${options.id}`, {
    json: options.data,
  });
};

export default updateCheckItem;
