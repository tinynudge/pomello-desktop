import { TrelloCard } from '../domain/TrelloCard';
import { generateTrelloChecklist } from './generateTrelloChecklist';

export const generateTrelloCard = (values: Partial<TrelloCard> = {}): TrelloCard => ({
  actions: values.actions ?? [],
  checklists: values.checklists ?? [generateTrelloChecklist()],
  dueComplete: values.dueComplete ?? false,
  id: values.id ?? 'one',
  name: values.name ?? 'My test card',
  pos: values.pos ?? 0,
});
