import { TrelloBoard } from './TrelloBoard';
import { TrelloCard } from './TrelloCard';
import { TrelloCheckItem } from './TrelloCheckItem';
import { TrelloList } from './TrelloList';
import { TrelloListPreferences } from './TrelloListPreferences';
import { TrelloLogBuilder } from './TrelloLogBuilder';

export interface TrelloCache {
  boards: Map<string, TrelloBoard>;
  currentBoard: TrelloBoard;
  currentList: TrelloList;
  didSwitchList?: boolean;
  lists: Map<string, TrelloList>;
  log?: TrelloLogBuilder;
  preferences: TrelloListPreferences;
  previousListId?: string;
  tasks: Map<string, TrelloCard | TrelloCheckItem>;
  token?: string;
  userId: string;
}
