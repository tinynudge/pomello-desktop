import { selectPomelloState } from '@/app/appSlice';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import useService from '@/shared/hooks/useService';
import { SelectItem, SelectOptionType } from '@domain';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import getTasksCacheKey from '../helpers/getTasksCacheKey';

interface CurrentTask {
  currentTask: SelectOptionType;
  currentTaskLabel: string;
}

const useCurrentTask = (): CurrentTask => {
  const { getTaskLabel, id } = useService();

  const queryClient = useQueryClient();
  const tasks = queryClient.getQueryData<SelectItem[]>(getTasksCacheKey(id));

  const { currentTaskId } = useSelector(selectPomelloState);

  assertNonNullish(tasks, 'Unable to get cached tasks');

  const currentTask = useMemo(() => {
    let task: SelectOptionType | undefined;

    const itemsToSearch = [...tasks];

    while (!task && itemsToSearch.length) {
      const item = itemsToSearch.shift()!; // "item" must exist due to the length check above

      if (item.type === 'group' || item.type === 'customGroup') {
        itemsToSearch.unshift(...item.items);
      } else if (item.id === currentTaskId) {
        task = item;
      }
    }

    return task;
  }, [tasks, currentTaskId]);

  if (!currentTask) {
    throw new Error(`Unable to find task with id "${currentTask}"`);
  }

  const currentTaskLabel = useMemo(
    () => getTaskLabel?.(currentTask) ?? currentTask.label,
    [currentTask, getTaskLabel]
  );

  return { currentTask, currentTaskLabel };
};

export default useCurrentTask;
