import { Logger } from '@domain';
import { TrelloLabel } from '../domain';
import trelloClient from '../trelloClient';

const fetchLabelsByBoardId = async (_logger: Logger, boardId: string): Promise<TrelloLabel[]> => {
  const { data } = await trelloClient.get<TrelloLabel[]>(`boards/${boardId}/labels`);

  return data;
};

export default fetchLabelsByBoardId;
