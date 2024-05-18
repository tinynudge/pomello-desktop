import { ServiceRuntime } from '@pomello-desktop/domain';
import { createStore, reconcile } from 'solid-js/store';
import { TrelloConfig, TrelloConfigActions, TrelloConfigStore } from './domain';

export const createTrelloConfig = ({
  config,
  onServiceCleanUp,
}: ServiceRuntime<TrelloConfigStore>): TrelloConfig => {
  const [store, setStore] = createStore(config.get());

  const actions: TrelloConfigActions = {
    currentListUnset: () => {
      config.unset('currentList');
    },
    listSelected: (listId, recentLists) => {
      config.set('recentLists', [listId, ...recentLists]);
      config.set('currentList', listId);
    },
    preferencesUpdated: preferences => {
      config.set('preferences', preferences);
    },
    tokenSet: token => {
      config.set('token', token);
    },
    tokenUnset: () => {
      config.unset('token');
    },
  };

  const unsubscribe = config.onChange(updatedConfig => setStore(reconcile(updatedConfig)));

  onServiceCleanUp(unsubscribe);

  return { actions, store };
};
