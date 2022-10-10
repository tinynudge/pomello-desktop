import { TrelloListPreferences } from './TrelloListPreferences';
import { TrelloPreferences } from './TrelloPreferences';

export interface TrelloConfig {
  completedTaskPosition?: 'top' | 'bottom';
  createdTaskPosition?: 'top' | 'bottom';
  currentList?: string;
  listFilter?: string;
  listFilterCaseSensitive?: boolean;
  preferences?: {
    boards?: Record<string, TrelloPreferences | undefined>;
    global?: TrelloPreferences;
    lists?: Record<string, TrelloListPreferences | undefined>;
  };
  recentLists?: string[];
  token?: string;
}
