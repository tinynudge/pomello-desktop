import { useStoreActions } from '@/app/context/StoreContext';
import { SelectItem } from '@pomello-desktop/domain';
import { RemoveTask } from '@pomello-desktop/domain/src/RemoveTask';
import { useQueryClient } from '@tanstack/solid-query';
import { produce } from 'immer';
import { useTasksCacheKey } from '../useTasksCacheKey';
import { removeTaskById } from './removeTaskById';

export const useRemoveTaskFromCache = () => {
  const { updateTasksFinished, updateTasksStarted } = useStoreActions();
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();

  return (removeTask: RemoveTask, taskId: string) => {
    queryClient.setQueryData<SelectItem[] | undefined>(getTasksCacheKey(), tasks => {
      if (!tasks) {
        return;
      }

      return produce(tasks, draft => {
        removeTaskById(draft, taskId);
      });
    });

    if (typeof removeTask === 'function') {
      updateTasksStarted();

      removeTask().finally(updateTasksFinished);
    }
  };
};
