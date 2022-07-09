import { RegisterStoreOptions, Store, StoreContents, StoreManager } from '@domain';
import Ajv from 'ajv';
import ElectronStore from 'electron-store';

const validator = new Ajv({
  allowUnionTypes: true,
});

const createStore = <TContents = StoreContents>({
  schema,
  ...options
}: RegisterStoreOptions<TContents>): Store<TContents> => {
  const store = new ElectronStore<TContents>(options);

  const validate = validator.compile(schema);

  if (!validate(store.store)) {
    // TOCO: Add better error handling
    throw new Error(`Invalid schema: ${JSON.stringify(validate.errors)}`);
  }

  return {
    all: () => store.store,
    get: store.get,
    set: store.set,
  };
};

const createStoreManager = (): StoreManager => {
  const stores: Map<string, Store> = new Map();

  const getOrFailStore = <TContents = StoreContents>(id: string): Store<TContents> => {
    const store = stores.get(id);

    if (!store) {
      throw new Error(`Unable to find store with id "${id}".`);
    }

    return store as unknown as Store<TContents>;
  };

  const registerStore = <TContents = StoreContents>(
    options: RegisterStoreOptions<TContents>
  ): Store<TContents> => {
    const cachedStore = stores.get(options.name);

    if (cachedStore) {
      return cachedStore as unknown as Store<TContents>;
    }

    const store = createStore<TContents>(options);

    stores.set(options.name, store as unknown as Store);

    return store as unknown as Store<TContents>;
  };

  return {
    getOrFailStore,
    registerStore,
  };
};

export default createStoreManager;
