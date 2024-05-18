import { TrelloLogTime } from './TrelloLogTime';

export type TrelloLog = {
  cardId: string;
  entries: string[];
  footer: string;
  header: string;
  id?: string;
  time: TrelloLogTime;
  timeSpent: string;
};
