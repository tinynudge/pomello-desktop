import runtime from '@/runtime';
import { ServiceConfigStore, StoreContents } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleRegisterServiceConfig = async (
  _event: IpcMainInvokeEvent,
  serviceId: string,
  config: ServiceConfigStore
): Promise<StoreContents> => {
  const store = runtime.storeManager.registerStore({
    defaults: config.defaults,
    directory: 'services',
    emitChangeEvents: true,
    name: serviceId,
    schema: config.schema,
  });

  return store.all();
};

export default handleRegisterServiceConfig;
