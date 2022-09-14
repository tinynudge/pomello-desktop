import { TrelloCheckItem } from '../domain/TrelloCheckItem';

const generateTrelloCheckItem = (values?: Partial<TrelloCheckItem>): TrelloCheckItem => ({
  id: values?.id ?? 'TRELLO_CHECK_ITEM_ID',
  name: values?.name ?? 'My test checklist',
  pos: values?.pos ?? 0,
  state: values?.state ?? 'incomplete',
});

export default generateTrelloCheckItem;
