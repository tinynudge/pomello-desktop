import { TrelloCardAction } from './TrelloCardAction';
import { TrelloChecklist } from './TrelloChecklist';

export type TrelloCard = {
  actions: TrelloCardAction[];
  checklists: TrelloChecklist[];
  dueComplete: boolean;
  id: string;
  name: string;
  pos: number;
};
