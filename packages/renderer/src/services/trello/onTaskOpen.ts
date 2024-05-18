import { OnTaskOpenEvent } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const onTaskOpen = (runtime: TrelloRuntime, { openUrl, taskId }: OnTaskOpenEvent): void => {
  let card = findOrFailTask(runtime.cache, taskId);

  if (isCheckItem(card)) {
    card = findOrFailTask(runtime.cache, card.idCard);
  }

  openUrl('https://trello.com/c/' + card.id);
};
