import { useServiceConfigSelector, useServiceConfigUpdater } from '@/shared/hooks/useServiceConfig';
import { TrelloConfig } from './domain';

type Selector<TValue> = (config: TrelloConfig) => TValue;

export const useTrelloConfigSelector = <TValue>(selector: Selector<TValue>): TValue => {
  return useServiceConfigSelector(selector);
};

export const useTrelloConfigUpdater = useServiceConfigUpdater<TrelloConfig>;

export const selectCurrentListId = (config: TrelloConfig) => config.currentList;

export const selectListFilter = (config: TrelloConfig) => config.listFilter;

export const selectListFilterCaseSensitive = (config: TrelloConfig) =>
  config.listFilterCaseSensitive;

export const selectPreferences = (config: TrelloConfig) => config.preferences;

export const selectRecentLists = (config: TrelloConfig) => config.recentLists;

export const selectToken = (config: TrelloConfig) => config.token;
