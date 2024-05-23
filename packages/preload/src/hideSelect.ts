import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const hideSelect = (): Promise<void> => ipcRenderer.invoke(AppEvent.HideSelect);
