import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const setActiveServiceId = (serviceId: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetStoreItem, 'services', 'activeServiceId', serviceId);
