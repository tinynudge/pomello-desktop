import { useTranslate } from '@/shared/context/RuntimeContext';
import { useClearTasksCache } from '@/shared/hooks/useClearTasksCache';
import { LoadingText } from '@/ui/app/LoadingText';
import { InitializingView, SelectItem } from '@pomello-desktop/domain';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createEffect, createSignal } from 'solid-js';
import { useTrelloCache, useTrelloConfig } from '../TrelloRuntimeContext';
import { fetchBoardsAndLists } from '../api/fetchBoardsAndLists';
import { LoginView } from './LoginView';
import { SelectListView } from './SelectListView';
import { getPreferences } from './helpers/getPreferences';
import { parseBoardsAndLists } from './helpers/parseBoardsAndLists';

export const TrelloInitializingView: InitializingView = props => {
  const t = useTranslate();
  const cache = useTrelloCache();
  const config = useTrelloConfig();
  const clearTasksCache = useClearTasksCache();

  const [getLists, setLists] = createSignal<SelectItem[]>();

  const boardsAndLists = createQuery(() => ({
    enabled: cache.store.hasToken,
    queryFn: fetchBoardsAndLists,
    queryKey: ['trello-boards-lists'],
    throwOnError: true,
  }));

  createEffect(() => {
    if (!boardsAndLists.data) {
      return;
    }

    const { boards, lists, selectItems } = parseBoardsAndLists({
      boardsAndLists: boardsAndLists.data,
      listFilter: config.store.listFilter,
      listFilterCaseSensitive: config.store.listFilterCaseSensitive,
      previousListId: cache.store.previousListId,
      recentLists: config.store.recentLists,
      translate: t,
    });

    setLists(selectItems);

    cache.actions.boardsAndListsFetched(boards, lists, boardsAndLists.data.id);
  });

  createEffect(() => {
    if (!config.store.currentList || !cache.store.lists) {
      return;
    }

    const currentList = cache.store.lists.get(config.store.currentList);
    const currentBoard = currentList ? cache.store.boards.get(currentList.idBoard) : null;

    if (currentBoard && currentList) {
      const listPreferences = getPreferences(currentList, config.store.preferences);

      cache.actions.currentListSet(currentBoard, currentList, listPreferences);

      props.onReady({
        openTaskSelect: cache.store.didSwitchList,
      });

      if (cache.store.didSwitchList) {
        cache.actions.didSwitchListUnset();
      }
    } else {
      new Notification(t('service:invalidListHeading'), { body: t('service:invalidListBody') });

      config.actions.currentListUnset();
    }
  });

  const handleListSelect = (optionId: string) => {
    let listId = optionId;

    if (optionId === 'previous-list' && cache.store.previousListId) {
      listId = cache.store.previousListId;

      cache.actions.previousListIdUnset();
    } else {
      clearTasksCache();
    }

    const updatedRecentLists = new Set(config.store.recentLists ?? []);
    updatedRecentLists.delete(listId);

    config.actions.listSelected(listId, updatedRecentLists);
  };

  return (
    <Switch fallback={<LoadingText />}>
      <Match when={!cache.store.hasToken && !config.store.token}>
        <LoginView />
      </Match>
      <Match when={!config.store.currentList && getLists()}>
        {getLists => (
          <SelectListView
            defaultOpen={Boolean(cache.store.previousListId)}
            lists={getLists()}
            onListSelect={handleListSelect}
          />
        )}
      </Match>
    </Switch>
  );
};
