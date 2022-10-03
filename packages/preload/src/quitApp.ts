import { ipcRenderer } from 'electron';
import { AppEvent } from '../../domain/AppEvent';

const quitApp = (): void => {
  ipcRenderer.invoke(AppEvent.QuitApp);
};

export default quitApp;
