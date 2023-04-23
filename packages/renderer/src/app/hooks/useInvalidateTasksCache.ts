import useTasksCacheKey from '@/app/hooks/useTasksCacheKey';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

const useInvalidateTasksCache = () => {
  const queryClient = useQueryClient();
  const tasksCacheKey = useTasksCacheKey();

  return useCallback(() => {
    queryClient.invalidateQueries(tasksCacheKey);
  }, [queryClient, tasksCacheKey]);
};

export default useInvalidateTasksCache;
