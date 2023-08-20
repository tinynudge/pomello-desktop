import useCache from '@/shared/hooks/useCache';
import useStore from '@/shared/hooks/useStore';
import { TrelloBoard, TrelloCache, TrelloList, TrelloListPreferences } from './domain';

export const useTrelloCache = () => {
  const cache = useCache<TrelloCache>();

  return useStore(cache.get, cache.subscribe, {
    boardsAndListsFetched: (
      boards: Map<string, TrelloBoard>,
      lists: Map<string, TrelloList>,
      userId: string
    ) => {
      cache.set(draft => {
        draft.boards = boards;
        draft.lists = lists;
        draft.userId = userId;
      });
    },
    currentListSet: (board: TrelloBoard, list: TrelloList, preferences: TrelloListPreferences) => {
      cache.set(draft => {
        draft.currentBoard = board;
        draft.currentList = list;
        draft.preferences = preferences;
      });
    },
    didSwitchListUnset: () => {
      cache.set(draft => {
        delete draft.didSwitchList;
      });
    },
    previousListIdUnset: () => {
      cache.set(draft => {
        delete draft.previousListId;
      });
    },
    tokenSet: (token: string) => {
      cache.set(draft => {
        draft.token = token;
      });
    },
    tokenUnset: () => {
      cache.set(draft => {
        delete draft.token;
      });
    },
  });
};

export const selectBoards = (cache: TrelloCache) => cache.boards;

export const selectDidSwitchList = (cache: TrelloCache) => cache.didSwitchList;

export const selectLists = (cache: TrelloCache) => cache.lists;

export const selectPreviousListId = (cache: TrelloCache) => cache.previousListId;

export const selectToken = (cache: TrelloCache) => cache.token;
