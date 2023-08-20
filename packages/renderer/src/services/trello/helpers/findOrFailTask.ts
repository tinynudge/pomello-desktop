import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { Signal } from '@domain';
import { TrelloCache, TrelloCard, TrelloCheckItem } from '../domain';

const findOrFailTask = (
  cache: Signal<TrelloCache>,
  taskId: string
): TrelloCard | TrelloCheckItem => {
  const { tasks } = cache.get();

  const task = tasks.get(taskId);

  assertNonNullish(task, `Unable to get task with id "${taskId}"`);

  return task;
};

export default findOrFailTask;
