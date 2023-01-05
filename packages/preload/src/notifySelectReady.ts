import { ipcRenderer } from 'electron';
import { AppEvent } from '../../domain/AppEvent';

const notifySelectReady = (): Promise<void> => ipcRenderer.invoke(AppEvent.SelectReady);

export default notifySelectReady;
