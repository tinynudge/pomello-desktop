import { Logger } from '@domain';
import { TrelloCheckItem } from '../domain';
import sanitizeTrelloError from '../helpers/sanitizeTrelloError';
import trelloClient from '../trelloClient';

const markCheckItemComplete = async (logger: Logger, checkItem: TrelloCheckItem): Promise<void> => {
  await trelloClient
    .put(`/cards/${checkItem.idCard}/checkItem/${checkItem.id}`, {
      state: 'complete',
    })
    .catch(error => {
      logger.error(JSON.stringify(sanitizeTrelloError(error)));
    });
};

export default markCheckItemComplete;
