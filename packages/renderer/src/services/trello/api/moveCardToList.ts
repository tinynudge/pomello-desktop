import { Logger } from '@domain';
import { TrelloCard } from '../domain';
import sanitizeTrelloError from '../helpers/sanitizeTrelloError';
import trelloClient from '../trelloClient';

const moveCardToList = async (
  logger: Logger,
  card: TrelloCard,
  listId: string,
  position: 'top' | 'bottom'
): Promise<void> => {
  await trelloClient
    .put(`/cards/${card.id}`, {
      idList: listId,
      pos: position,
    })
    .catch(error => {
      logger.error(JSON.stringify(sanitizeTrelloError(error)));
    });
};

export default moveCardToList;
