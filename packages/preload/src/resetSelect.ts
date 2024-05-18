import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const resetSelect = (): Promise<void> => ipcRenderer.invoke(AppEvent.ResetSelect);

export default resetSelect;
