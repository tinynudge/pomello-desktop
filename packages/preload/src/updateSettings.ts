import { AppEvent, Settings } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const updateSettings = (settings: Partial<Settings>): Promise<void> =>
  ipcRenderer.invoke(AppEvent.UpdateSettings, settings);
