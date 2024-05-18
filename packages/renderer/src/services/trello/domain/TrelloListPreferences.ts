import { TrelloPreferences } from './TrelloPreferences';

export type TrelloListPreferences = TrelloPreferences & {
  doneList?: string;
};
