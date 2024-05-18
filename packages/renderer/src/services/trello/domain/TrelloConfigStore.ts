import { TrelloPreferencesMap } from './TrelloPreferencesMap';

export type TrelloConfigStore = {
  completedTaskPosition?: 'top' | 'bottom';
  createdTaskPosition?: 'top' | 'bottom';
  currentList?: string;
  listFilter?: string;
  listFilterCaseSensitive?: boolean;
  preferences?: TrelloPreferencesMap;
  recentLists?: string[];
  token?: string;
};
