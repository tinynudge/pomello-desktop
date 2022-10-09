import { Logger } from '@domain';
import { TrelloCard } from '../domain';
import sanitizeTrelloError from '../helpers/sanitizeTrelloError';
import trelloClient from '../trelloClient';

interface CreateCardOptions {
  description?: string;
  labelIds?: string[];
  listId: string;
  position: 'top' | 'bottom';
  title: string;
}

const createCard = async (logger: Logger, options: CreateCardOptions): Promise<void> => {
  await trelloClient
    .post<TrelloCard>('cards', {
      desc: options.description ?? '',
      due: null,
      idLabels: options.labelIds,
      idList: options.listId,
      name: options.title,
      pos: options.position,
    })
    .catch(error => {
      logger.error(sanitizeTrelloError(error));
    });
};

export default createCard;
