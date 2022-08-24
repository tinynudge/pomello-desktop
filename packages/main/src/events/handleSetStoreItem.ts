import runtime from '@/runtime';
import { IpcMainInvokeEvent } from 'electron';

const handleSetStoreItem = (
  _event: IpcMainInvokeEvent,
  storeName: string,
  key: string,
  value: unknown
): void => {
  const store = runtime.storeManager.getOrFailStore(storeName);

  store.set(key, value);
};

export default handleSetStoreItem;
