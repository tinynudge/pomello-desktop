import { TrelloBoard } from '../domain';
import { generateTrelloList } from './generateTrelloList';

export const generateTrelloBoard = (values: Partial<TrelloBoard> = {}): TrelloBoard => ({
  id: values.id ?? 'TRELLO_BOARD_ID',
  lists: values.lists ?? [generateTrelloList()],
  name: values.name ?? 'My test board',
  prefs: values.prefs ?? {},
});
