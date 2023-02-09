import { SelectOptionType } from '@domain';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import useTasksCacheKey from './useTasksCacheKey';

type UseUpdateTasks = (update: UpdateFunction) => void;

type UpdateFunction = (previousTasks?: SelectOptionType[]) => SelectOptionType[];

const useUpdateTasks = (): UseUpdateTasks => {
  const queryClient = useQueryClient();
  const tasksCacheKey = useTasksCacheKey();

  return useCallback(
    (callback: UpdateFunction) => {
      queryClient.setQueryData<SelectOptionType[]>(tasksCacheKey, callback);
    },
    [queryClient, tasksCacheKey]
  );
};

export default useUpdateTasks;
