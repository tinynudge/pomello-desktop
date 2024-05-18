import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const hideSelect = (): Promise<void> => ipcRenderer.invoke(AppEvent.HideSelect);

export default hideSelect;
