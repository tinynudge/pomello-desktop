import { TrelloLabel } from '../domain';
import getTrelloClient from '../getTrelloClient';

const fetchLabelsByBoardId = async (boardId: string): Promise<TrelloLabel[]> =>
  getTrelloClient().get(`boards/${boardId}/labels`).json<TrelloLabel[]>();

export default fetchLabelsByBoardId;
