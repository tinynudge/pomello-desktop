import { TrelloPreferencesMap } from './TrelloPreferencesMap';

export type TrelloConfigActions = {
  currentListUnset(): void;
  listSelected(listId: string, recentLists: Set<string>): void;
  preferencesUpdated(preferences: TrelloPreferencesMap): void;
  tokenSet(token: string): void;
  tokenUnset(): void;
};
