import LoadingText from '@/app/ui/LoadingText';
import useCache from '@/shared/hooks/useCache';
import useServiceConfig from '@/shared/hooks/useServiceConfig';
import useTranslation from '@/shared/hooks/useTranslation';
import { InitializingView, SelectItem } from '@domain';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TrelloCache, TrelloConfig } from '../domain';
import fetchBoardsAndLists from '../queries/fetchBoardsAndLists';
import getPreferences from './helpers/getPreferences';
import parseBoardsAndLists from './helpers/parseBoardsAndLists';
import LoginView from './LoginView';
import SelectListView from './SelectListView';

const TrelloInitializingView: InitializingView = ({ onReady }) => {
  const { t } = useTranslation();

  const [cache, setCache] = useCache<TrelloCache>();
  const [config, setConfig, unsetConfig] = useServiceConfig<TrelloConfig>();

  const [lists, setLists] = useState<SelectItem[]>();

  const { data: boardsAndLists } = useQuery({
    enabled: Boolean(config.token),
    queryKey: 'trello-boards-lists',
    queryFn: fetchBoardsAndLists,
  });

  useEffect(() => {
    if (!boardsAndLists) {
      return;
    }

    const { boards, lists, selectItems } = parseBoardsAndLists({
      boardsAndLists,
      listFilter: config.listFilter,
      listFilterCaseSensitive: config.listFilterCaseSensitive,
      recentLists: config.recentLists,
    });

    setLists(selectItems);

    setCache(draft => {
      draft.boards = boards;
      draft.lists = lists;
    });
  }, [
    boardsAndLists,
    config.listFilter,
    config.listFilterCaseSensitive,
    config.recentLists,
    setCache,
  ]);

  useEffect(() => {
    if (!config.currentList || !cache.lists) {
      return;
    }

    const currentList = cache.lists.get(config.currentList);

    if (currentList) {
      const preferences = getPreferences(currentList, config.preferences);

      setCache(draft => {
        draft.currentListId = config.currentList;
        draft.preferences = preferences;
      });

      onReady();
    } else {
      new Notification(t('service:invalidListHeading'), { body: t('service:invalidListBody') });

      unsetConfig('currentList');
    }
  }, [cache.lists, config.currentList, config.preferences, onReady, setCache, t, unsetConfig]);

  const handleListSelect = (listId: string) => {
    const recentLists = new Set(config.recentLists ?? []);
    recentLists.delete(listId);

    setConfig('recentLists', [listId, ...recentLists]);
    setConfig('currentList', listId);
  };

  if (!config.token) {
    return <LoginView />;
  }

  if (!config.currentList && lists) {
    return <SelectListView lists={lists} onListSelect={handleListSelect} />;
  }

  return <LoadingText />;
};

export default TrelloInitializingView;
