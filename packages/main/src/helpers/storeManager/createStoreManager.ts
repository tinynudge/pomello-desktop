import { RegisterStoreOptions, Store, StoreContents } from '@domain';
import createStore from './createStore';

interface StoreManager {
  getOrFailStore<TContents extends StoreContents = StoreContents>(id: string): Store<TContents>;
  registerStore<TContents extends StoreContents = StoreContents>(
    options: RegisterStoreOptions<TContents>
  ): Store<TContents>;
}

const createStoreManager = (): StoreManager => {
  const stores: Map<string, Store> = new Map();

  const getOrFailStore = <TContents = StoreContents>(id: string): Store<TContents> => {
    const store = stores.get(id);

    if (!store) {
      throw new Error(`Unable to find store with id "${id}".`);
    }

    return store as unknown as Store<TContents>;
  };

  const registerStore = <TContents extends StoreContents = StoreContents>(
    options: RegisterStoreOptions<TContents>
  ): Store<TContents> => {
    const cachedStore = stores.get(options.path);

    if (cachedStore) {
      return cachedStore as unknown as Store<TContents>;
    }

    const store = createStore<TContents>(options);

    stores.set(options.path, store as unknown as Store);

    return store as unknown as Store<TContents>;
  };

  return {
    getOrFailStore,
    registerStore,
  };
};

export default createStoreManager;
