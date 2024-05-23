import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const decryptValue = (value: string): string | null =>
  ipcRenderer.sendSync(AppEvent.DecryptValue, value);
