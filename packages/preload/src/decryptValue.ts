import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const decryptValue = (value: string): string | null =>
  ipcRenderer.sendSync(AppEvent.DecryptValue, value);

export default decryptValue;
