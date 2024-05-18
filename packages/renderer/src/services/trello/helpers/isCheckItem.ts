import { TrelloCard, TrelloCheckItem } from '../domain';

export const isCheckItem = (task: TrelloCard | TrelloCheckItem): task is TrelloCheckItem => {
  return 'state' in task;
};
