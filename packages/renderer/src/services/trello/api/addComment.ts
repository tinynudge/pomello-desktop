import { Logger } from '@domain';
import { TrelloCardAction } from '../domain';
import trelloClient from '../trelloClient';

const addComment = async (
  logger: Logger,
  taskId: string,
  text: string
): Promise<TrelloCardAction> => {
  const { data } = await trelloClient
    .post<TrelloCardAction>(`/cards/${taskId}/actions/comments`, { text })
    .catch(error => {
      if (error.response.status === 401) {
        throw new Error('no commenting permissions');
      }

      throw error;
    });

  return data;
};

export default addComment;
