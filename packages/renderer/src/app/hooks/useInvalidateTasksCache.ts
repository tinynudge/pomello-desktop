import { useQueryClient } from '@tanstack/solid-query';
import { useTasksCacheKey } from './useTasksCacheKey';

export const useInvalidateTasksCache = () => {
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: getTasksCacheKey(),
    });
  };
};
