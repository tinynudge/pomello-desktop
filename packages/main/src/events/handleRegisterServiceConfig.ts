import storeManager from '@/helpers/storeManager';
import { ServiceConfigStore, StoreContents } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleRegisterServiceConfig = async (
  _event: IpcMainInvokeEvent,
  path: string,
  config: ServiceConfigStore
): Promise<StoreContents> => {
  const store = storeManager.registerStore({
    defaults: config.defaults,
    emitChangeEvents: true,
    path,
    schema: config.schema,
  });

  return store.all();
};

export default handleRegisterServiceConfig;
