import { usePomelloConfig } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Accessor, createMemo } from 'solid-js';

export const useTasksCacheKey = (): Accessor<string[]> => {
  const config = usePomelloConfig();
  const getService = useService();

  const taskCacheKey = createMemo(() => {
    const isPremium = config.store.user?.type === 'premium';

    return ['tasks', getService().id, `premium:${isPremium}`];
  });

  return taskCacheKey;
};
