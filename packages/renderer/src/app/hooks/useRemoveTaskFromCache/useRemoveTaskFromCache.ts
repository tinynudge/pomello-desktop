import { SelectItem } from '@domain';
import produce from 'immer';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import useTasksCacheKey from '../useTasksCacheKey';
import removeTask from './removeTask';

const useRemoveTaskFromCache = () => {
  const queryClient = useQueryClient();

  const tasksCacheKey = useTasksCacheKey();

  return useCallback(
    (taskId: string) => {
      queryClient.setQueryData<SelectItem[] | undefined>(tasksCacheKey, tasks => {
        if (!tasks) {
          return;
        }

        return produce(tasks, draft => {
          removeTask(draft, taskId);
        });
      });
    },
    [queryClient, tasksCacheKey]
  );
};

export default useRemoveTaskFromCache;
