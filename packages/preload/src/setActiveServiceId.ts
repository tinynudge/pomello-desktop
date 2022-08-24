import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const setActiveServiceId = (serviceId: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetStoreItem, 'services', 'activeServiceId', serviceId);

export default setActiveServiceId;
