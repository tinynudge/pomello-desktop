import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const quitApp = (): void => {
  ipcRenderer.invoke(AppEvent.QuitApp);
};

export default quitApp;
