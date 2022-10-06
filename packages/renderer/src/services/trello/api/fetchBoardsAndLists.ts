import { TrelloMember } from '../domain';
import trelloClient from '../trelloClient';

const fetchBoardsAndLists = (): Promise<TrelloMember> => {
  return trelloClient
    .get<TrelloMember>('members/me', {
      params: {
        fields: 'none',
        boards: 'open',
        board_lists: 'open',
        board_fields: 'name,prefs',
      },
    })
    .then(({ data }) => data);
};

export default fetchBoardsAndLists;
