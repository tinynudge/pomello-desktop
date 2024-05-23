import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getActiveServiceId = (): Promise<string | undefined> =>
  ipcRenderer.invoke(AppEvent.GetActiveServiceId);
