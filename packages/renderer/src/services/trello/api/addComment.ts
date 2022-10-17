import { Logger } from '@domain';
import sanitizeTrelloError from '../helpers/sanitizeTrelloError';
import trelloClient from '../trelloClient';

const addComment = async (logger: Logger, taskId: string, text: string): Promise<void> => {
  await trelloClient.post(`/cards/${taskId}/actions/comments`, { text }).catch(error => {
    if (error.response.status === 401) {
      throw new Error('no commenting permissions');
    }

    logger.error(sanitizeTrelloError(error));
  });
};

export default addComment;
