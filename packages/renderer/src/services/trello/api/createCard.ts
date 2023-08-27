import { TrelloCard } from '../domain';
import getTrelloClient from '../getTrelloClient';

interface CreateCardOptions {
  description?: string;
  labelIds?: string[];
  listId: string;
  position: 'top' | 'bottom';
  title: string;
}

const createCard = async (options: CreateCardOptions): Promise<void> => {
  await getTrelloClient()
    .post('cards', {
      json: {
        desc: options.description ?? '',
        due: null,
        idLabels: options.labelIds,
        idList: options.listId,
        name: options.title,
        pos: options.position,
      },
    })
    .json<TrelloCard>();
};

export default createCard;
