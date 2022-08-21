import runtime from '@/runtime';
import { IpcMainInvokeEvent } from 'electron';

const handleSetServiceConfigItem = (
  _event: IpcMainInvokeEvent,
  serviceId: string,
  key: string,
  value: unknown
): void => {
  const store = runtime.storeManager.getOrFailStore(serviceId);

  store.set(key, value);
};

export default handleSetServiceConfigItem;
