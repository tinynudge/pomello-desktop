import { SelectOptionType } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { useTasksCacheKey } from './useTasksCacheKey';

type UseUpdateTasks = (update: UpdateFunction) => void;

type UpdateFunction = (previousTasks?: SelectOptionType[]) => SelectOptionType[];

export const useUpdateTasks = (): UseUpdateTasks => {
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();

  return (callback: UpdateFunction) => {
    queryClient.setQueryData<SelectOptionType[]>(getTasksCacheKey(), callback);
  };
};
