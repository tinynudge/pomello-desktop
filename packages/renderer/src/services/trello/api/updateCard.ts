import { TrelloCard } from '../domain';
import trelloClient from '../trelloClient';

interface UpdateCardOptions {
  id: string;
  data: CardData;
}

type CardData = Partial<Omit<TrelloCard, 'actions' | 'checklists' | 'id'>>;

const updateCard = async (options: UpdateCardOptions): Promise<void> => {
  await trelloClient.put<TrelloCard>(`cards/${options.id}`, options.data);
};

export default updateCard;
