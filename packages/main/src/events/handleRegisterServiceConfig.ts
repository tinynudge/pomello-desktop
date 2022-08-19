import runtime from '@/runtime';
import { ServiceConfig, StoreContents } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleRegisterServiceConfig = async (
  _event: IpcMainInvokeEvent,
  serviceId: string,
  config: ServiceConfig
): Promise<StoreContents> => {
  const store = runtime.storeManager.registerStore({
    defaults: config.defaults,
    name: `services/${serviceId}`,
    schema: config.schema,
  });

  return store.all();
};

export default handleRegisterServiceConfig;
