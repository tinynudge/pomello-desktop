import { TrelloCheckItem } from '../domain';
import trelloClient from '../trelloClient';

const markCheckItemComplete = async (checkItem: TrelloCheckItem): Promise<void> => {
  await trelloClient.put(`/cards/${checkItem.idCard}/checkItem/${checkItem.id}`, {
    state: 'complete',
  });
};

export default markCheckItemComplete;
