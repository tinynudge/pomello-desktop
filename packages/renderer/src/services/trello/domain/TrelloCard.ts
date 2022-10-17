import { TrelloCardAction } from './TrelloCardAction';
import { TrelloChecklist } from './TrelloChecklist';

export interface TrelloCard {
  actions: TrelloCardAction[];
  checklists: TrelloChecklist[];
  id: string;
  name: string;
  pos: number;
}
