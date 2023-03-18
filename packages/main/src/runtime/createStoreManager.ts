import { AppEvent, RegisterStoreOptions, Store, StoreContents, StoreManager } from '@domain';
import Ajv from 'ajv';
import ElectronStore from 'electron-store';
import runtime from '.';

const validator = new Ajv({
  allowUnionTypes: true,
});

const createStore = <TContents extends StoreContents = StoreContents>({
  defaults,
  emitChangeEvents = false,
  path,
  schema,
}: RegisterStoreOptions<TContents>): Store<TContents> => {
  const store = new ElectronStore<TContents>({
    defaults,
    name: path,
    watch: emitChangeEvents,
  });

  const validate = validator.compile(schema);

  if (!validate(store.store)) {
    // TODO: Add better error handling
    throw new Error(`Invalid schema: ${JSON.stringify(validate.errors)}`);
  }

  if (emitChangeEvents) {
    // onDidAnyChange returns an unsubscribe callback. Since we don't have any
    // methods to remove stores from the manager, we don't need to unsubscribe
    // this listener. If that does change, then this will need to be revisited
    // to avoid potential memory leaks.
    store.onDidAnyChange(() => {
      runtime.windowManager.getAllWindows().forEach(browserWindow => {
        browserWindow.webContents.send(`${AppEvent.StoreChange}:${path}`, store.store);
      });
    });
  }

  return {
    all: () => store.store,
    get: store.get.bind(store),
    set: store.set.bind(store),
    unset: store.delete.bind(store),
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
