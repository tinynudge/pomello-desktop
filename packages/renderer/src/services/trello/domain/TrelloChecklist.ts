import { TrelloCheckItem } from './TrelloCheckItem';

export type TrelloChecklist = {
  checkItems: TrelloCheckItem[];
  id: string;
  name: string;
  pos: number;
};
