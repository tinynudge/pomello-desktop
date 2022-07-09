import { configureStore } from '@reduxjs/toolkit';
import { PomelloState } from '@tinynudge/pomello-service';
import appSlice from './appSlice';

export type RootState = ReturnType<Store['getState']>;

export type AppDispatch = Store['dispatch'];

type Store = ReturnType<typeof createStore>;

interface CreateStoreOptions {
  pomelloState: PomelloState;
  serviceId?: string;
}

const createStore = ({ pomelloState, serviceId }: CreateStoreOptions) => {
  const store = configureStore({
    reducer: {
      app: appSlice,
    },
    preloadedState: {
      app: {
        pomelloState,
        serviceId,
      },
    },
  });

  return store;
};

export default createStore;
