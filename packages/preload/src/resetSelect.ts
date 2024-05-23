import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const resetSelect = (): Promise<void> => ipcRenderer.invoke(AppEvent.ResetSelect);
