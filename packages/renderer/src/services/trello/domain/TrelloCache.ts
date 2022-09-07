import { TrelloBoard } from './TrelloBoard';
import { TrelloList } from './TrelloList';
import { TrelloListPreferences } from './TrelloListPreferences';

export interface TrelloCache {
  boards?: Map<string, TrelloBoard>;
  currentListId?: string;
  lists?: Map<string, TrelloList>;
  preferences?: TrelloListPreferences;
}
