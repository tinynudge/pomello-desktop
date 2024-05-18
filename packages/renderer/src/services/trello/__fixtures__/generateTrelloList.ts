import { TrelloList } from '../domain';

export const generateTrelloList = (values: Partial<TrelloList> = {}): TrelloList => ({
  closed: values.closed ?? false,
  id: values.id ?? 'TRELLO_LIST_ID',
  idBoard: values.idBoard ?? 'TRELLO_BOARD_ID',
  name: values.name ?? 'My test list',
  pos: values.pos ?? 0,
  subscribed: values.subscribed ?? false,
});
