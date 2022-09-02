import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const decryptValue = (value: string): string => ipcRenderer.sendSync(AppEvent.DecryptValue, value);

export default decryptValue;
