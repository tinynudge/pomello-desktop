import { getTrelloClient } from '../getTrelloClient';

export const updateComment = async (logId: string, text: string): Promise<void> => {
  await getTrelloClient()
    .put(`actions/${logId}`, {
      json: { text },
    })
    .catch(error => {
      if (error.response.status === 401) {
        throw new Error('no commenting permissions');
      }
    });
};
