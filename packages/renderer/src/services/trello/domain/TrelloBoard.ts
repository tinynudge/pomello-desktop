import { TrelloList } from './TrelloList';

export type TrelloBoard = {
  id: string;
  lists: TrelloList[];
  name: string;
  prefs: Record<string, unknown>;
};
