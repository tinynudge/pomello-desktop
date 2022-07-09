import runtime from '@/runtime';
import { RegisterStoreOptions, StoreContents } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleRegisterStore = async (
  _event: IpcMainInvokeEvent,
  options: RegisterStoreOptions
): Promise<StoreContents> => {
  const store = runtime.storeManager.registerStore(options);

  return store.all();
};

export default handleRegisterStore;
