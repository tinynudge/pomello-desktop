import { TrelloCheckItem } from '../domain/TrelloCheckItem';

export const generateTrelloCheckItem = (
  values: Partial<TrelloCheckItem> = {}
): TrelloCheckItem => ({
  id: values.id ?? 'TRELLO_CHECK_ITEM_ID',
  idCard: values.idCard ?? 'TRELLO_CARD_ID',
  name: values.name ?? 'My test checklist',
  pos: values.pos ?? 0,
  state: values.state ?? 'incomplete',
});
