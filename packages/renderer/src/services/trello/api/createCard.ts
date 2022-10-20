import { TrelloCard } from '../domain';
import trelloClient from '../trelloClient';

interface CreateCardOptions {
  description?: string;
  labelIds?: string[];
  listId: string;
  position: 'top' | 'bottom';
  title: string;
}

const createCard = async (options: CreateCardOptions): Promise<void> => {
  await trelloClient.post<TrelloCard>('cards', {
    desc: options.description ?? '',
    due: null,
    idLabels: options.labelIds,
    idList: options.listId,
    name: options.title,
    pos: options.position,
  });
};

export default createCard;
