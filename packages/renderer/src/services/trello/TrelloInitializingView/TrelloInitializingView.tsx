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
  useTrelloCache,
} from '../useTrelloCache';
import {
  selectCurrentListId,
  selectListFilter,
  selectListFilterCaseSensitive,
  selectPreferences,
  selectRecentLists,
  selectToken,
  useTrelloConfig,
} from '../useTrelloConfig';
import LoginView from './LoginView';
import SelectListView from './SelectListView';
import getPreferences from './helpers/getPreferences';
import parseBoardsAndLists from './helpers/parseBoardsAndLists';

const TrelloInitializingView: InitializingView = ({ onReady }) => {
  const { t } = useTranslation();

  const trelloCache = useTrelloCache();
  const trelloConfig = useTrelloConfig();

  const cachedBoards = trelloCache(selectBoards);
  const cachedLists = trelloCache(selectLists);
  const cachedToken = trelloCache(selectCachedToken);
  const didSwitchList = trelloCache(selectDidSwitchList);
  const previousListId = trelloCache(selectPreviousListId);

  const currentListId = trelloConfig(selectCurrentListId);
  const listFilter = trelloConfig(selectListFilter);
  const listFilterCaseSensitive = trelloConfig(selectListFilterCaseSensitive);
  const preferences = trelloConfig(selectPreferences);
  const recentLists = trelloConfig(selectRecentLists);
  const token = trelloConfig(selectToken);

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
        trelloCache.tokenSet(decryptedToken);
      } else {
        trelloConfig.tokenUnset();
      }
    } else {
      trelloCache.tokenUnset();
    }
  }, [token, trelloCache, trelloConfig]);

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

    trelloCache.boardsAndListsFetched(boards, lists, boardsAndLists.id);
  }, [
    boardsAndLists,
    currentListId,
    listFilter,
    listFilterCaseSensitive,
    previousListId,
    recentLists,
    t,
    trelloCache,
  ]);

  useEffect(() => {
    if (!currentListId || !cachedLists) {
      return;
    }

    const currentList = cachedLists.get(currentListId);
    const currentBoard = currentList ? cachedBoards.get(currentList.idBoard) : null;

    if (currentBoard && currentList) {
      const listPreferences = getPreferences(currentList, preferences);

      trelloCache.currentListSet(currentBoard, currentList, listPreferences);

      onReady({ openTaskSelect: didSwitchList });

      if (didSwitchList) {
        trelloCache.didSwitchListUnset();
      }
    } else {
      new Notification(t('service:invalidListHeading'), { body: t('service:invalidListBody') });

      trelloConfig.currentListUnset();
    }
  }, [
    cachedBoards,
    cachedLists,
    currentListId,
    didSwitchList,
    onReady,
    preferences,
    t,
    trelloCache,
    trelloConfig,
  ]);

  const queryClient = useQueryClient();
  const tasksCacheKey = useTasksCacheKey();

  const handleListSelect = (optionId: string) => {
    let listId = optionId;

    if (optionId === 'previous-list' && previousListId) {
      listId = previousListId;

      trelloCache.previousListIdUnset();
    } else {
      queryClient.removeQueries(tasksCacheKey);
    }

    const updatedRecentLists = new Set(recentLists ?? []);
    updatedRecentLists.delete(listId);

    trelloConfig.listSelected(listId, updatedRecentLists);
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
