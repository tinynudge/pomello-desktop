import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const resetSelect = (): Promise<void> => ipcRenderer.invoke(AppEvent.ResetSelect);

export default resetSelect;
