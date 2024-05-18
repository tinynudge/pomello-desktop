import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { TrelloCache, TrelloCard, TrelloCheckItem } from '../domain';

export const findOrFailTask = (
  cache: TrelloCache,
  taskId: string
): TrelloCard | TrelloCheckItem => {
  const tasks = cache.store.tasks;
  const task = tasks.get(taskId);

  assertNonNullish(task, `Unable to get task with id "${taskId}"`);

  return task;
};
