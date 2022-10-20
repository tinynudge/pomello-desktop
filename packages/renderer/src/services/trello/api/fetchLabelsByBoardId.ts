import { TrelloLabel } from '../domain';
import trelloClient from '../trelloClient';

const fetchLabelsByBoardId = async (boardId: string): Promise<TrelloLabel[]> => {
  const { data } = await trelloClient.get<TrelloLabel[]>(`boards/${boardId}/labels`);

  return data;
};

export default fetchLabelsByBoardId;
