import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const encryptValue = (value: string): string => ipcRenderer.sendSync(AppEvent.EncryptValue, value);

export default encryptValue;
