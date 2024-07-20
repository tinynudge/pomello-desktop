import { useService } from '@/shared/context/ServiceContext';
import { SelectItem, SelectOptionType } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { Accessor, createMemo } from 'solid-js';
import { useStore } from '../context/StoreContext';
import { useTasksCacheKey } from './useTasksCacheKey';

type CurrentTask = {
  item: SelectOptionType;
  label: string;
};

export const useCurrentTask = (): Accessor<CurrentTask> => {
  const getService = useService();
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();
  const store = useStore();

  const currentTask = createMemo(() => {
    let task: SelectOptionType | undefined;

    const currentTaskId = store.pomelloState.currentTaskId;
    const tasks = queryClient.getQueryData<SelectItem[]>(getTasksCacheKey()) ?? [];
    const itemsToSearch = [...tasks];

    while (!task && itemsToSearch.length) {
      const item = itemsToSearch.shift()!; // "item" must exist due to the length check above

      if (item.type === 'group' || item.type === 'customGroup') {
        itemsToSearch.unshift(...item.items);
      } else if (item.id === currentTaskId) {
        task = item;
      }
    }

    if (!task) {
      throw new Error(`Unable to find task with id "${currentTaskId}"`);
    }

    return {
      item: task,
      label: getService().getTaskLabel?.(task.id) ?? task?.label,
    };
  });

  return currentTask;
};
