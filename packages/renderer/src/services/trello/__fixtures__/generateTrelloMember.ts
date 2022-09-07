import { TrelloMember } from '../domain';
import generateTrelloBoard from './generateTrelloBoard';

const generateTrelloMember = (): TrelloMember => ({
  id: 'TRELLO_USER_ID',
  boards: [generateTrelloBoard()],
});

export default generateTrelloMember;
