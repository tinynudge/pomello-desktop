import runtime from '@/runtime';
import { IpcMainInvokeEvent } from 'electron';

const handleUnsetStoreItem = (_event: IpcMainInvokeEvent, storeName: string, key: string): void => {
  const store = runtime.storeManager.getOrFailStore(storeName);

  store.unset(key);
};

export default handleUnsetStoreItem;
