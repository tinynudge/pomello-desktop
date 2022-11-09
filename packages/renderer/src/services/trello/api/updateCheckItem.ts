import { TrelloCheckItem } from '../domain';
import trelloClient from '../trelloClient';

interface UpdateCheckItemOptions {
  id: string;
  cardId: string;
  data: CheckItemData;
}

type CheckItemData = Partial<Omit<TrelloCheckItem, 'id' | 'idCard'>>;

const updateCheckItem = async (options: UpdateCheckItemOptions): Promise<void> => {
  await trelloClient.put<TrelloCheckItem>(
    `cards/${options.cardId}/checkItem/${options.id}`,
    options.data
  );
};

export default updateCheckItem;
