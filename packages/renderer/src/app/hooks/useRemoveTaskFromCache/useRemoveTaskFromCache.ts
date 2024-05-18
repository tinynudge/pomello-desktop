import { SelectItem } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { produce } from 'immer';
import { useTasksCacheKey } from '../useTasksCacheKey';
import { removeTask } from './removeTask';

export const useRemoveTaskFromCache = () => {
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();

  return (taskId: string) => {
    queryClient.setQueryData<SelectItem[] | undefined>(getTasksCacheKey(), tasks => {
      if (!tasks) {
        return;
      }

      return produce(tasks, draft => {
        removeTask(draft, taskId);
      });
    });
  };
};
