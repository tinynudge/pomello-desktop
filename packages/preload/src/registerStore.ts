import { AppEvent, RegisterStoreOptions, Store } from '@domain';
import { ipcRenderer } from 'electron';

const registerStore = (options: RegisterStoreOptions): Promise<Store> =>
  ipcRenderer.invoke(AppEvent.RegisterStore, options);

export default registerStore;
