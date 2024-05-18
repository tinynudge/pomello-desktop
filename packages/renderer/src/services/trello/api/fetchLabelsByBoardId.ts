import { TrelloLabel } from '../domain';
import { getTrelloClient } from '../getTrelloClient';

export const fetchLabelsByBoardId = async (boardId: string): Promise<TrelloLabel[]> =>
  getTrelloClient().get(`boards/${boardId}/labels`).json<TrelloLabel[]>();
