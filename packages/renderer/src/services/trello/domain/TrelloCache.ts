import { TrelloBoard } from './TrelloBoard';
import { TrelloCard } from './TrelloCard';
import { TrelloCheckItem } from './TrelloCheckItem';
import { TrelloList } from './TrelloList';
import { TrelloListPreferences } from './TrelloListPreferences';

export interface TrelloCache {
  boards: Map<string, TrelloBoard>;
  currentBoard: TrelloBoard;
  currentList: TrelloList;
  lists: Map<string, TrelloList>;
  preferences: TrelloListPreferences;
  tasks: Map<string, TrelloCard | TrelloCheckItem>;
  token?: string;
}
