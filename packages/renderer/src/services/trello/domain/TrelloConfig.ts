import { TrelloConfigActions } from './TrelloConfigActions';
import { TrelloConfigStore } from './TrelloConfigStore';

export type TrelloConfig = {
  actions: TrelloConfigActions;
  store: TrelloConfigStore;
};
