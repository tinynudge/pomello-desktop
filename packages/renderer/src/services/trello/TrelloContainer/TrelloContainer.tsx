import usePomelloActions from '@/app/hooks/usePomelloActions';
import { CacheProvider } from '@/shared/context/CacheContext';
import { Cache, ServiceContainer } from '@domain';
import { useEffect } from 'react';
import { TrelloCache } from '../domain';
import { selectCurrentListId, useTrelloConfigSelector } from '../useTrelloConfig';

type TrelloContainerProps = ServiceContainer<{
  cache: Cache<TrelloCache>;
}>;

const TrelloContainer: TrelloContainerProps = ({ cache, children }) => {
  const { reset } = usePomelloActions();

  const currentListId = useTrelloConfigSelector(selectCurrentListId);

  useEffect(() => {
    if (!currentListId) {
      reset({
        preserveActiveTimer: true,
        reinitialize: true,
      });
    }
  }, [currentListId, reset]);

  return <CacheProvider cache={cache} children={children} />;
};

export default TrelloContainer;
