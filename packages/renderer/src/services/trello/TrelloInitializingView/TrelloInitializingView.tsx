import LoadingText from '@/app/ui/LoadingText';
import useTranslation from '@/shared/hooks/useTranslation';
import { InitializingView, SelectItem } from '@domain';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import fetchBoardsAndLists from '../queries/fetchBoardsAndLists';
import { selectLists, useTrelloCacheSelector, useTrelloCacheUpdater } from '../useTrelloCache';
import {
  selectCurrentListId,
  selectListFilter,
  selectListFilterCaseSensitive,
  selectPreferences,
  selectRecentLists,
  selectToken,
  useTrelloConfigSelector,
  useTrelloConfigUpdater,
} from '../useTrelloConfig';
import getPreferences from './helpers/getPreferences';
import parseBoardsAndLists from './helpers/parseBoardsAndLists';
import LoginView from './LoginView';
import SelectListView from './SelectListView';

const TrelloInitializingView: InitializingView = ({ onReady }) => {
  const { t } = useTranslation();

  const setCache = useTrelloCacheUpdater();
  const cachedLists = useTrelloCacheSelector(selectLists);

  const [setConfig, unsetConfig] = useTrelloConfigUpdater();
  const currentListId = useTrelloConfigSelector(selectCurrentListId);
  const listFilter = useTrelloConfigSelector(selectListFilter);
  const listFilterCaseSensitive = useTrelloConfigSelector(selectListFilterCaseSensitive);
  const preferences = useTrelloConfigSelector(selectPreferences);
  const recentLists = useTrelloConfigSelector(selectRecentLists);
  const token = useTrelloConfigSelector(selectToken);

  const [lists, setLists] = useState<SelectItem[]>();

  const { data: boardsAndLists } = useQuery({
    enabled: Boolean(token),
    queryKey: 'trello-boards-lists',
    queryFn: fetchBoardsAndLists,
  });

  useEffect(() => {
    if (!boardsAndLists) {
      return;
    }

    const { boards, lists, selectItems } = parseBoardsAndLists({
      boardsAndLists,
      listFilter,
      listFilterCaseSensitive,
      recentLists,
    });

    setLists(selectItems);

    setCache(draft => {
      draft.boards = boards;
      draft.lists = lists;
    });
  }, [boardsAndLists, listFilter, listFilterCaseSensitive, recentLists, setCache]);

  useEffect(() => {
    if (!currentListId || !cachedLists) {
      return;
    }

    const currentList = cachedLists.get(currentListId);

    if (currentList) {
      const listPreferences = getPreferences(currentList, preferences);

      setCache(draft => {
        draft.currentListId = currentListId;
        draft.preferences = listPreferences;
      });

      onReady();
    } else {
      new Notification(t('service:invalidListHeading'), { body: t('service:invalidListBody') });

      unsetConfig('currentList');
    }
  }, [cachedLists, currentListId, onReady, preferences, setCache, t, unsetConfig]);

  const handleListSelect = (listId: string) => {
    const updatedRecentLists = new Set(recentLists ?? []);
    updatedRecentLists.delete(listId);

    setConfig('recentLists', [listId, ...updatedRecentLists]);
    setConfig('currentList', listId);
  };

  if (!token) {
    return <LoginView />;
  }

  if (!currentListId && lists) {
    return <SelectListView lists={lists} onListSelect={handleListSelect} />;
  }

  return <LoadingText />;
};

export default TrelloInitializingView;
