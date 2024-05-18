import { TrelloCardAction } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

export const addComment = async (taskId: string, text: string): Promise<TrelloCardAction> => {
  return await getTrelloClient()
    .post(`cards/${taskId}/actions/comments`, {
      json: { text },
    })
    .json<TrelloCardAction>()
    .catch(error => {
      if (error.response.status === 401) {
        throw new Error('no commenting permissions');
      }

      throw error;
    });
};
