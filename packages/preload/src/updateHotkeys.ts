import { AppEvent, Hotkeys } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const updateHotkeys = (hotkeys: Partial<Hotkeys>): Promise<void> =>
  ipcRenderer.invoke(AppEvent.UpdateHotkeys, hotkeys);
