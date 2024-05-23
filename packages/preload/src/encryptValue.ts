import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const encryptValue = (value: string): string =>
  ipcRenderer.sendSync(AppEvent.EncryptValue, value);
