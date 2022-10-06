import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { Cache } from '@domain';
import { TrelloCache, TrelloCard, TrelloCheckItem } from '../domain';

const findOrFailTask = (
  cache: Cache<TrelloCache>,
  taskId: string
): TrelloCard | TrelloCheckItem => {
  const { tasks } = cache.get();

  const task = tasks.get(taskId);

  assertNonNullish(task, `Unable to get task with id "${taskId}"`);

  return task;
};

export default findOrFailTask;
