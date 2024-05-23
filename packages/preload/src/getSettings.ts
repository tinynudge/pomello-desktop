import { AppEvent, Settings } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getSettings = (): Promise<Settings> => ipcRenderer.invoke(AppEvent.GetSettings);
