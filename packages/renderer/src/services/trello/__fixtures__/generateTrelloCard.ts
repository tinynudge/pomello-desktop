import { TrelloCard } from '../domain/TrelloCard';
import generateTrelloChecklist from './generateTrelloChecklist';

const generateTrelloCard = (values: Partial<TrelloCard> = {}): TrelloCard => ({
  checklists: values.checklists ?? [generateTrelloChecklist()],
  id: values.id ?? 'TRELLO_CARD_ID',
  name: values.name ?? 'My test card',
  pos: values.pos ?? 0,
});

export default generateTrelloCard;
