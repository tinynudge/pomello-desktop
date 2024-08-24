import { AppEvent, CompleteFormattedHotkeys } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getDefaultHotkeys = (): Promise<CompleteFormattedHotkeys> =>
  ipcRenderer.invoke(AppEvent.GetDefaultHotkeys);
