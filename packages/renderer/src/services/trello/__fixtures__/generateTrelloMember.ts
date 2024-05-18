import { TrelloMember } from '../domain';
import { generateTrelloBoard } from './generateTrelloBoard';

export const generateTrelloMember = (values: Partial<TrelloMember> = {}): TrelloMember => ({
  id: values.id ?? 'TRELLO_USER_ID',
  boards: values.boards ?? [generateTrelloBoard()],
});
