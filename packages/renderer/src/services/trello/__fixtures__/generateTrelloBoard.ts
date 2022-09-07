import { TrelloBoard } from '../domain';
import generateTrelloList from './generateTrelloList';

const generateTrelloBoard = (): TrelloBoard => {
  return {
    id: 'TRELLO_BOARD_ID',
    lists: [generateTrelloList()],
    name: 'My test board',
    prefs: {},
  };
};

export default generateTrelloBoard;
