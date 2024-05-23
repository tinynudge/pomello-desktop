import { runtime } from '@/runtime';
import { ServiceConfigStore, StoreContents } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleRegisterServiceConfig = async (
  _event: IpcMainInvokeEvent,
  path: string,
  config: ServiceConfigStore
): Promise<StoreContents> => {
  const store = runtime.storeManager.registerStore({
    defaults: config.defaults,
    emitChangeEvents: true,
    path,
    schema: config.schema,
  });

  return store.all();
};
