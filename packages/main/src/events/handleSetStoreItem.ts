import { runtime } from '@/runtime';
import { IpcMainInvokeEvent } from 'electron';

export const handleSetStoreItem = (
  _event: IpcMainInvokeEvent,
  storeName: string,
  key: string,
  value: unknown
): void => {
  const store = runtime.storeManager.getOrFailStore(storeName);

  if (value === undefined) {
    store.delete(key);
  } else {
    store.set(key, value);
  }
};
