import { useStoreActions } from '@/app/context/StoreContext';
import { useRuntime } from '@/shared/context/RuntimeContext';
import { RemoveTask, SelectItem } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { produce } from 'immer';
import { useTasksCacheKey } from '../useTasksCacheKey';
import { removeTaskById } from './removeTaskById';

export const useRemoveTaskFromCache = () => {
  const { logger } = useRuntime();
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

      removeTask()
        .catch(error => {
          logger.error('Failed to remove task from cache', error);
        })
        .finally(updateTasksFinished);
    }
  };
};
