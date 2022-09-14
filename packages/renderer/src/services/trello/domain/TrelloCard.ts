import { TrelloChecklist } from './TrelloChecklist';

export interface TrelloCard {
  checklists: TrelloChecklist[];
  id: string;
  name: string;
  pos: number;
}
