import { TrelloLabel } from '../domain';

const generateTrelloLabel = (values: Partial<TrelloLabel> = {}): TrelloLabel => ({
  color: values.color ?? 'red',
  id: values.id ?? 'TRELLO_LABEL_ID',
  idBoard: values.idBoard ?? 'TRELLO_BOARD_ID',
  name: values.name ?? 'My label',
});

export default generateTrelloLabel;
