import { TrelloCard } from '../domain/TrelloCard';
import generateTrelloChecklist from './generateTrelloChecklist';

const generateTrelloCard = (values: Partial<TrelloCard> = {}): TrelloCard => ({
  actions: values.actions ?? [],
  checklists: values.checklists ?? [generateTrelloChecklist()],
  id: values.id ?? 'one',
  name: values.name ?? 'My test card',
  pos: values.pos ?? 0,
});

export default generateTrelloCard;
