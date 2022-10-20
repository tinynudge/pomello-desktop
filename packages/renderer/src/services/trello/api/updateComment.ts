import trelloClient from '../trelloClient';

const updateComment = async (logId: string, text: string): Promise<void> => {
  await trelloClient.put(`/actions/${logId}`, { text }).catch(error => {
    if (error.response.status === 401) {
      throw new Error('no commenting permissions');
    }
  });
};

export default updateComment;
