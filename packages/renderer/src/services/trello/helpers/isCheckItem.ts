import { TrelloCard, TrelloCheckItem } from '../domain';

const isCheckItem = (task: TrelloCard | TrelloCheckItem): task is TrelloCheckItem => {
  return 'state' in task;
};

export default isCheckItem;
