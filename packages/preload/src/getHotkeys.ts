import { AppEvent, FormattedHotkeys } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getHotkeys = (): Promise<FormattedHotkeys> => ipcRenderer.invoke(AppEvent.GetHotkeys);
