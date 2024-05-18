import { TrelloBoard } from './TrelloBoard';

export type TrelloMember = {
  id: string;
  boards: TrelloBoard[];
};
