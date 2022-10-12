import { useCacheSelector, useCacheUpdater } from '@/shared/hooks/useCache';
import { TrelloCache } from './domain';

type Selector<TValue> = (cache: TrelloCache) => TValue;

export const useTrelloCacheSelector = <TValue>(selector: Selector<TValue>): TValue => {
  return useCacheSelector(selector);
};

export const useTrelloCacheUpdater = useCacheUpdater<TrelloCache>;

export const selectBoards = (cache: TrelloCache) => cache.boards;

export const selectLists = (cache: TrelloCache) => cache.lists;

export const selectPreviousListId = (cache: TrelloCache) => cache.previousListId;

export const selectToken = (cache: TrelloCache) => cache.token;
