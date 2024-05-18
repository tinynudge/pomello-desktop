import { TrelloBoard } from './TrelloBoard';
import { TrelloCard } from './TrelloCard';
import { TrelloCheckItem } from './TrelloCheckItem';
import { TrelloList } from './TrelloList';
import { TrelloListPreferences } from './TrelloListPreferences';
import { TrelloLogBuilder } from './TrelloLogBuilder';

export type TrelloCacheActions = {
  boardsAndListsFetched(
    boards: Map<string, TrelloBoard>,
    lists: Map<string, TrelloList>,
    userId: string
  ): void;
  currentListSet(board: TrelloBoard, list: TrelloList, preferences: TrelloListPreferences): void;
  currentListSwitched(previousListId?: string): void;
  didSwitchListUnset(): void;
  doneListUpdated(listId: string): void;
  logSet(logBuilder: TrelloLogBuilder): void;
  tasksSet(tasks: Map<string, TrelloCard | TrelloCheckItem>): void;
  previousListIdUnset(): void;
  tokenSet(token: string): void;
  tokenUnset(): void;
};
