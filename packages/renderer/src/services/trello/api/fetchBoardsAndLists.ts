import { TrelloMember } from '../domain';
import getTrelloClient from '../getTrelloClient';

const fetchBoardsAndLists = async (): Promise<TrelloMember> => {
  return getTrelloClient()
    .get('members/me', {
      searchParams: {
        fields: 'none',
        boards: 'open',
        board_lists: 'open',
        board_fields: 'name,prefs',
      },
    })
    .json<TrelloMember>();
};

export default fetchBoardsAndLists;
