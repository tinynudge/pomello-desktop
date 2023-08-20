import useServiceConfig from '@/shared/hooks/useServiceConfig';
import useStore from '@/shared/hooks/useStore';
import { TrelloConfig } from './domain';

export const useTrelloConfig = () => {
  const config = useServiceConfig<TrelloConfig>();

  return useStore(config.get, config.onChange, {
    currentListUnset: () => {
      config.unset('currentList');
    },
    listSelected: (listId: string, recentLists: Set<string>) => {
      config.set('recentLists', [listId, ...recentLists]);
      config.set('currentList', listId);
    },
    tokenSet: (token: string) => {
      config.set('token', token);
    },
    tokenUnset: () => {
      config.unset('token');
    },
  });
};

export const selectCurrentListId = (config: TrelloConfig) => config.currentList;

export const selectListFilter = (config: TrelloConfig) => config.listFilter;

export const selectListFilterCaseSensitive = (config: TrelloConfig) =>
  config.listFilterCaseSensitive;

export const selectPreferences = (config: TrelloConfig) => config.preferences;

export const selectRecentLists = (config: TrelloConfig) => config.recentLists;

export const selectToken = (config: TrelloConfig) => config.token;
