import { getPomelloStateContext } from '@/app/contexts/pomelloStateContext';
import { getServiceContext } from '@/app/contexts/serviceContext';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import type { SelectItem, SelectOptionType } from '@domain';
import { useQueryClient } from '@tanstack/svelte-query';
import { derived, get, type Readable } from 'svelte/store';
import getTasksCacheKey from './getTasksCacheKey';

interface CurrentTask {
  task: SelectOptionType;
  label: string;
}

const getCurrentTask = (): Readable<CurrentTask> => {
  const { getTaskLabel } = getServiceContext();
  const pomelloState = getPomelloStateContext();
  const queryClient = useQueryClient();
  const tasksCacheKey = getTasksCacheKey();

  const tasks = queryClient.getQueryData<SelectItem[]>(get(tasksCacheKey));
  const currentTaskId = pomelloState.getCurrentTaskId();

  assertNonNullish(tasks, 'Unable to get cached tasks');

  return derived(currentTaskId, $currentTaskId => {
    let task: SelectOptionType | undefined;

    const itemsToSearch = [...tasks];

    while (!task && itemsToSearch.length) {
      const item = itemsToSearch.shift()!; // "item" must exist due to the length check above

      if (item.type === 'group' || item.type === 'customGroup') {
        itemsToSearch.unshift(...item.items);
      } else if (item.id === $currentTaskId) {
        task = item;
      }
    }

    if (!task) {
      throw new Error(`Unable to find task with id "${$currentTaskId}"`);
    }

    const label = getTaskLabel?.(task.id) ?? task.label;

    return { label, task };
  });
};

export default getCurrentTask;
