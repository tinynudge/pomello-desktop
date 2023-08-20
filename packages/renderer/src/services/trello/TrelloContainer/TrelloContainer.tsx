import usePomelloActions from '@/app/hooks/usePomelloActions';
import { CacheProvider } from '@/shared/context/CacheContext';
import { ServiceContainer, Signal } from '@domain';
import { useEffect } from 'react';
import { TrelloCache } from '../domain';
import { selectCurrentListId, useTrelloConfig } from '../useTrelloConfig';

type TrelloContainerProps = ServiceContainer<{
  cache: Signal<TrelloCache>;
}>;

const TrelloContainer: TrelloContainerProps = ({ cache, children }) => {
  const { reset } = usePomelloActions();

  const trelloConfig = useTrelloConfig();
  const currentListId = trelloConfig(selectCurrentListId);

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
