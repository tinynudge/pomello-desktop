import { TrelloPreferences } from './TrelloPreferences';

export interface TrelloListPreferences extends TrelloPreferences {
  doneList?: string;
}
