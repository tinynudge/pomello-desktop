import { TrelloMember } from '../domain';
import generateTrelloBoard from './generateTrelloBoard';

const generateTrelloMember = (values: Partial<TrelloMember> = {}): TrelloMember => ({
  id: values.id ?? 'TRELLO_USER_ID',
  boards: values.boards ?? [generateTrelloBoard()],
});

export default generateTrelloMember;
