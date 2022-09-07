import { TrelloList } from './TrelloList';

export interface TrelloBoard {
  id: string;
  lists: TrelloList[];
  name: string;
  prefs: Record<string, unknown>;
}
