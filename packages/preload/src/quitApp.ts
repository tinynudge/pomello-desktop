import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const quitApp = (): void => {
  ipcRenderer.invoke(AppEvent.QuitApp);
};
