import { createStore, produce } from 'solid-js/store';
import {
  TrelloBoard,
  TrelloCache,
  TrelloCacheActions,
  TrelloCacheStore,
  TrelloList,
} from './domain';
import { getTrelloClient } from './getTrelloClient';

export const createTrelloCache = (): TrelloCache => {
  const [store, setStore] = createStore({
    hasToken: false,
  } as TrelloCacheStore);

  const actions: TrelloCacheActions = {
    boardsAndListsFetched: (
      boards: Map<string, TrelloBoard>,
      lists: Map<string, TrelloList>,
      userId: string
    ) => {
      setStore(
        produce(draft => {
          draft.boards = boards;
          draft.lists = lists;
          draft.userId = userId;
        })
      );
    },
    currentListSet: (board, list, preferences) => {
      setStore(
        produce(draft => {
          draft.currentBoard = board;
          draft.currentList = list;
          draft.preferences = preferences;
        })
      );
    },
    currentListSwitched: previousListId => {
      setStore(
        produce(draft => {
          draft.didSwitchList = true;
          draft.previousListId = previousListId;
        })
      );
    },
    didSwitchListUnset: () => {
      setStore('didSwitchList', undefined);
    },
    doneListUpdated: listId => {
      setStore('preferences', 'doneList', listId);
    },
    logSet: log => {
      setStore('log', log);
    },
    previousListIdUnset: () => {
      setStore('previousListId', undefined);
    },
    tasksSet: tasks => {
      setStore('tasks', tasks);
    },
    tokenSet: token => {
      getTrelloClient().setToken(token);

      setStore('hasToken', true);
    },
    tokenUnset: () => {
      getTrelloClient().unsetToken();

      setStore('hasToken', false);
    },
  };

  return { actions, store };
};
