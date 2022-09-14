import { TrelloCheckItem } from './TrelloCheckItem';

export interface TrelloChecklist {
  checkItems: TrelloCheckItem[];
  id: string;
  name: string;
  pos: number;
}
