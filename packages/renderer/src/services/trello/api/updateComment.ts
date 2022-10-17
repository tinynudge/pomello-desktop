import { Logger } from '@domain';
import sanitizeTrelloError from '../helpers/sanitizeTrelloError';
import trelloClient from '../trelloClient';

const updateComment = async (logger: Logger, logId: string, text: string): Promise<void> => {
  await trelloClient.put(`/actions/${logId}`, { text }).catch(error => {
    if (error.response.status === 401) {
      throw new Error('no commenting permissions');
    }

    logger.error(sanitizeTrelloError(error));
  });
};

export default updateComment;
