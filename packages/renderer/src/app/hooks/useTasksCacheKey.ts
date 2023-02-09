import { selectIsPremium, usePomelloConfigSelector } from '@/shared/hooks/usePomelloConfig';
import useService from '@/shared/hooks/useService';

const useTasksCacheKey = () => {
  const { id } = useService();

  const isPremium = usePomelloConfigSelector(selectIsPremium);

  return `${id}-premium:${isPremium}-tasks`;
};

export default useTasksCacheKey;
