import { TrelloListPreferences } from './TrelloListPreferences';
import { TrelloPreferences } from './TrelloPreferences';

export type TrelloPreferencesMap = {
  boards?: Record<string, TrelloPreferences | undefined>;
  global?: TrelloPreferences;
  lists?: Record<string, TrelloListPreferences | undefined>;
};
