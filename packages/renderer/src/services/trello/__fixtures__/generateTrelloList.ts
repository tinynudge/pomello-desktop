import { TrelloList } from '../domain';

const generateTrelloList = (): TrelloList => {
  return {
    closed: false,
    id: 'TRELLO_LIST_ID',
    idBoard: 'TRELLO_BOARD_ID',
    name: 'My test list',
    pos: 0,
    subscribed: false,
  };
};

export default generateTrelloList;
