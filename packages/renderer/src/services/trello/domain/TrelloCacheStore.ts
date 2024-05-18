import { TrelloBoard } from './TrelloBoard';
import { TrelloCard } from './TrelloCard';
import { TrelloCheckItem } from './TrelloCheckItem';
import { TrelloList } from './TrelloList';
import { TrelloListPreferences } from './TrelloListPreferences';
import { TrelloLogBuilder } from './TrelloLogBuilder';

export type TrelloCacheStore = {
  boards: Map<string, TrelloBoard>;
  currentBoard: TrelloBoard;
  currentList: TrelloList;
  didSwitchList?: boolean;
  hasToken: boolean;
  lists: Map<string, TrelloList>;
  log?: TrelloLogBuilder;
  preferences: TrelloListPreferences;
  previousListId?: string;
  tasks: Map<string, TrelloCard | TrelloCheckItem>;
  userId: string;
};
