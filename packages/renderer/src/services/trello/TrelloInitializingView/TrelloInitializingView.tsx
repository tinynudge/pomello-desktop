import useTasksCacheKey from '@/app/hooks/useTasksCacheKey';
import LoadingText from '@/app/ui/LoadingText';
import useTranslation from '@/shared/hooks/useTranslation';
import { InitializingView, SelectItem } from '@domain';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import fetchBoardsAndLists from '../api/fetchBoardsAndLists';
import {
  selectBoards,
  selectToken as selectCachedToken,
  selectDidSwitchList,
  selectLists,
  selectPreviousListId,
  useTrelloCacheSelector,
  useTrelloCacheUpdater,
} from '../useTrelloCache';
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
import LoginView from './LoginView';
import SelectListView from './SelectListView';
import getPreferences from './helpers/getPreferences';
import parseBoardsAndLists from './helpers/parseBoardsAndLists';

const TrelloInitializingView: InitializingView = ({ onReady }) => {
  const { t } = useTranslation();

  const setCache = useTrelloCacheUpdater();
  const cachedBoards = useTrelloCacheSelector(selectBoards);
  const cachedLists = useTrelloCacheSelector(selectLists);
  const cachedToken = useTrelloCacheSelector(selectCachedToken);
  const didSwitchList = useTrelloCacheSelector(selectDidSwitchList);
  const previousListId = useTrelloCacheSelector(selectPreviousListId);

  const [setConfig, unsetConfig] = useTrelloConfigUpdater();
  const currentListId = useTrelloConfigSelector(selectCurrentListId);
  const listFilter = useTrelloConfigSelector(selectListFilter);
  const listFilterCaseSensitive = useTrelloConfigSelector(selectListFilterCaseSensitive);
  const preferences = useTrelloConfigSelector(selectPreferences);
  const recentLists = useTrelloConfigSelector(selectRecentLists);
  const token = useTrelloConfigSelector(selectToken);

  const [lists, setLists] = useState<SelectItem[]>();

  const { data: boardsAndLists } = useQuery({
    enabled: Boolean(cachedToken),
    queryKey: 'trello-boards-lists',
    queryFn: fetchBoardsAndLists,
  });

  useEffect(() => {
    if (token) {
      const decryptedToken = window.app.decryptValue(token);

      if (decryptedToken) {
        setCache(draft => {
          draft.token = decryptedToken;
        });
      } else {
        unsetConfig('token');
      }
    } else {
      setCache(draft => {
        delete draft.token;
      });
    }
  }, [setCache, token, unsetConfig]);

  useEffect(() => {
    if (!boardsAndLists) {
      return;
    }

    const { boards, lists, selectItems } = parseBoardsAndLists({
      boardsAndLists,
      listFilter,
      listFilterCaseSensitive,
      previousListId,
      recentLists,
      translate: t,
    });

    setLists(selectItems);

    setCache(draft => {
      draft.boards = boards;
      draft.lists = lists;
      draft.userId = boardsAndLists.id;
    });
  }, [
    boardsAndLists,
    currentListId,
    listFilter,
    listFilterCaseSensitive,
    previousListId,
    recentLists,
    setCache,
    t,
  ]);

  useEffect(() => {
    if (!currentListId || !cachedLists) {
      return;
    }

    const currentList = cachedLists.get(currentListId);
    const currentBoard = currentList ? cachedBoards.get(currentList.idBoard) : null;

    if (currentBoard && currentList) {
      const listPreferences = getPreferences(currentList, preferences);

      setCache(draft => {
        draft.currentBoard = currentBoard;
        draft.currentList = currentList;
        draft.preferences = listPreferences;
      });

      onReady({ openTaskSelect: didSwitchList });

      if (didSwitchList) {
        setCache(draft => {
          delete draft.didSwitchList;
        });
      }
    } else {
      new Notification(t('service:invalidListHeading'), { body: t('service:invalidListBody') });

      unsetConfig('currentList');
    }
  }, [
    cachedBoards,
    cachedLists,
    currentListId,
    didSwitchList,
    onReady,
    preferences,
    setCache,
    t,
    unsetConfig,
  ]);

  const queryClient = useQueryClient();
  const tasksCacheKey = useTasksCacheKey();

  const handleListSelect = (optionId: string) => {
    let listId = optionId;

    if (optionId === 'previous-list' && previousListId) {
      listId = previousListId;

      setCache(draft => {
        delete draft.previousListId;
      });
    } else {
      queryClient.removeQueries(tasksCacheKey);
    }

    const updatedRecentLists = new Set(recentLists ?? []);
    updatedRecentLists.delete(listId);

    setConfig('recentLists', [listId, ...updatedRecentLists]);
    setConfig('currentList', listId);
  };

  if (!cachedToken && !token) {
    return <LoginView />;
  }

  if (!currentListId && lists) {
    return (
      <SelectListView
        defaultOpen={Boolean(previousListId)}
        lists={lists}
        onListSelect={handleListSelect}
      />
    );
  }

  return <LoadingText />;
};

export default TrelloInitializingView;
