import { useService } from '@/shared/context/ServiceContext';
import { Accessor, createMemo } from 'solid-js';

export const useTasksCacheKey = (): Accessor<string[]> => {
  const getService = useService();

  const taskCacheKey = createMemo(() => ['tasks', getService().id]);

  return taskCacheKey;
};
