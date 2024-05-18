import { useTasksCacheKey } from '@/app/hooks/useTasksCacheKey';
import { useQueryClient } from '@tanstack/solid-query';

export const useClearTasksCache = () => {
  const getTasksCacheKey = useTasksCacheKey();
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({
      queryKey: getTasksCacheKey(),
    });
  };
};
