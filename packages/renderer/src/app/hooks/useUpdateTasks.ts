import useService from '@/shared/hooks/useService';
import { SelectOptionType } from '@domain';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import getTasksCacheKey from '../helpers/getTasksCacheKey';

type UseUpdateTasks = (update: UpdateFunction) => void;

type UpdateFunction = (previousTasks?: SelectOptionType[]) => SelectOptionType[];

const useUpdateTasks = (): UseUpdateTasks => {
  const queryClient = useQueryClient();
  const { id } = useService();

  return useCallback(
    (callback: UpdateFunction) => {
      queryClient.setQueryData<SelectOptionType[]>(getTasksCacheKey(id), callback);
    },
    [id, queryClient]
  );
};

export default useUpdateTasks;
