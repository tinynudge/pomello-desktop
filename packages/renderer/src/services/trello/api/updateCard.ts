import { TrelloCard } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

type UpdateCardOptions = {
  id: string;
  data: CardData;
};

type CardData = Partial<Omit<TrelloCard, 'actions' | 'checklists' | 'id'>>;

export const updateCard = async (options: UpdateCardOptions): Promise<void> => {
  await getTrelloClient().put(`cards/${options.id}`, { json: options.data });
};
