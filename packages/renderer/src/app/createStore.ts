import { Settings } from '@domain';
import { configureStore } from '@reduxjs/toolkit';
import { PomelloState } from '@tinynudge/pomello-service';
import appSlice from './appSlice';

export type RootState = ReturnType<Store['getState']>;

export type AppDispatch = Store['dispatch'];

type Store = ReturnType<typeof createStore>;

interface CreateStoreOptions {
  pomelloState: PomelloState;
  serviceId?: string;
  settings: Settings;
}

const createStore = ({ pomelloState, serviceId, settings }: CreateStoreOptions) => {
  const store = configureStore({
    reducer: {
      app: appSlice,
    },
    preloadedState: {
      app: {
        isQuickTaskSelectEnabled: false,
        overlayView: null,
        pomelloState,
        serviceId,
        settings,
      },
    },
  });

  return store;
};

export default createStore;
