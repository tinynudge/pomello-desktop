import { AppEvent, RegisterStoreOptions, Store, StoreContents } from '@domain';
import Ajv from 'ajv';
import ElectronStore from 'electron-store';
import windowManager from '../windowManager';

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
      windowManager.getAllWindows().forEach(browserWindow => {
        browserWindow.webContents.send(`${AppEvent.StoreChange}:${path}`, store.store);
      });
    });
  }

  return {
    all: () => store.store,
    delete: store.delete.bind(store),
    get: store.get.bind(store),
    set: store.set.bind(store),
    unset: store.delete.bind(store),
  };
};

export default createStore;
