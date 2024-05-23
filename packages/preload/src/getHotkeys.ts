import { AppEvent, LabeledHotkeys } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getHotkeys = (): Promise<LabeledHotkeys> => ipcRenderer.invoke(AppEvent.GetHotkeys);
