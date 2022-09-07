import { TrelloBoard } from './TrelloBoard';

export interface TrelloMember {
  id: string;
  boards: TrelloBoard[];
}
